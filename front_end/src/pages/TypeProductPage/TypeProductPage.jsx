import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";

import ButtonInputSearch from "../../components/ButtonComponent/ButtonInputSearch/ButtonInputSearch";
import Cards from "../../components/Layouts/Cards";
import ProductDetailComponent from "../../components/ProductDetailComponent/ProductDetailComponent";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import * as ProductService from "../../services/ProductService";

const decodeSlug = (slug) => {
  return slug
    .replace(/_/g, " ")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
};

const renderRatingIcons = (rating) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (rating > 0.5) {
      stars.push(<i key={i} className="bi bi-star-fill"></i>);
      rating--;
    } else if (rating > 0) {
      stars.push(<i key={`half${i}`} className="bi bi-star-half"></i>);
      rating--;
    } else {
      stars.push(<i key={`empty${i}`} className="bi bi-star"></i>);
    }
  }
  return stars;
};

const TypeProductPage = () => {
  const { type } = useParams();
  const [selectedType, setSelectedType] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const [itemsPerLoad, setItemsPerLoad] = useState(6);

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await ProductService.getAllProduct();
      return res.data;
    },
  });

  const categories = useMemo(() => {
    const map = new Map();
    products.forEach((p) => {
      if (!map.has(p.type)) {
        map.set(p.type, p.image);
      }
    });
    return Array.from(map.entries()).map(([type, image], idx) => ({
      id: (idx + 1).toString().padStart(4, "0"),
      name: type,
      image,
    }));
  }, [products]);

  useEffect(() => {
    if (type) {
      const cleanType = decodeSlug(type);
      setSelectedType(cleanType);
    }
  }, [type]);

  useEffect(() => {
    const updateItemsPerLoad = () => {
      const w = window.innerWidth;
      if (w < 576) {
        setItemsPerLoad(2);
        setVisibleCount(2);
      } else if (w < 992) {
        setItemsPerLoad(4);
        setVisibleCount(4);
      } else {
        setItemsPerLoad(6);
        setVisibleCount(6);
      }
    };
    updateItemsPerLoad();
    window.addEventListener("resize", updateItemsPerLoad);
    return () => window.removeEventListener("resize", updateItemsPerLoad);
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products;
    if (selectedType) {
      result = result.filter((p) => p.type === selectedType);
    }
    if (searchTerm.trim() !== "") {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return result;
  }, [products, selectedType, searchTerm]);

  const handleLoadMore = () => setVisibleCount((prev) => prev + itemsPerLoad);
  const handleCardClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  return (
    <section className="hero_section">
      <section className="menu_section">
        <Container className="my-5">
          <Row>
            <Col lg={{ span: 8, offset: 2 }} className="text-center mb-5">
              <h2 style={{ color: "#F27B01" }}>OR FIND YOUR CRAZY BURGERS</h2>
              <ButtonInputSearch
                size="lg"
                placeholder="Search your burger"
                textButton="Searching"
                colorButton="#F27B01"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
          </Row>

          <Row>
            <Col md={3}>
              <h4 className="mb-3">Categories</h4>
              {categories.map((cat) => (
                <TypeProduct
                  key={cat.id}
                  name={cat.name}
                  selectedType={selectedType}
                  onClick={setSelectedType}
                />
              ))}
            </Col>

            <Col md={9}>
              <h3 className="mb-4 text-center">
                {selectedType ? `${selectedType} Products` : "All Products"}
              </h3>

              <Row>
                {filteredProducts.slice(0, visibleCount).map((prod, idx) => (
                  <Cards
                    key={idx}
                    image={prod.image}
                    name={prod.name}
                    description={prod.description}
                    price={prod.price}
                    rating={prod.rating}
                    countInStock={prod.countInStock}
                    renderRatingIcons={renderRatingIcons}
                    type={prod.type}
                    onClick={() => handleCardClick(prod)}
                  />
                ))}
              </Row>

              {visibleCount < filteredProducts.length && (
                <div className="text-center mt-4">
                  <button
                    className="btn btn-outline-warning"
                    onClick={handleLoadMore}
                    style={{ fontWeight: "bold" }}
                  >
                    Load More
                  </button>
                </div>
              )}
            </Col>
          </Row>

          <ProductDetailComponent
            product={selectedProduct}
            show={showModal}
            onHide={() => setShowModal(false)}
          />
        </Container>
      </section>
    </section>
  );
};

export default TypeProductPage;