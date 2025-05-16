import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import ButtonInputSearch from "../../components/ButtonComponent/ButtonInputSearch/ButtonInputSearch";
import CategoryComponent from "../../components/CategoryComponent/CategoryComponent";
import Cards from "../../components/Layouts/Cards";
import ProductDetailComponent from "../../components/ProductDetailComponent/ProductDetailComponent";
import { useDebounce } from "../../hooks/useDebounce";
import * as ProductService from "../../services/ProductService";

// Mock category images (fallback)
import Burger_banner from "../../assets/selection/burger_banner.jpg";
import Burger_combo_banner from "../../assets/selection/burger_combo_banner.jpg";
import Chip_banner from "../../assets/selection/chip_banner.png";
import Drink_banner from "../../assets/selection/drink_banner.jpg";
import New_banner from "../../assets/selection/new_banner.png";
import Rice_banner from "../../assets/selection/rice_banner.png";
import Soft_drink_banner from "../../assets/selection/soft_drink_banner.png";

const categoryData = [
  { id: "0001", image: New_banner, title: "New Food" },
  { id: "0002", image: Burger_banner, title: "Burger" },
  { id: "0003", image: Burger_combo_banner, title: "Combo" },
  { id: "0004", image: Drink_banner, title: "Fried Chicken" },
  { id: "0005", image: Chip_banner, title: "Chips" },
  { id: "0006", image: Rice_banner, title: "Brown Rice" },
  { id: "0007", image: Soft_drink_banner, title: "Soft Drink" },
];

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

function Section3() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [visibleCount, setVisibleCount] = useState(0);
  const [itemsPerLoad, setItemsPerLoad] = useState(6);

  // Responsive setup for product cards
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

  // Fetch all products with search + limit
  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ["products", debouncedSearch, visibleCount],
    queryFn: async () => {
      if (debouncedSearch.trim()) {
        const res = await ProductService.getAllProduct(
          debouncedSearch,
          1000,
          0
        );
        return res.data;
      } else {
        const res = await ProductService.getAllProduct("", visibleCount, 0);
        return res.data;
      }
    },
    keepPreviousData: true,
    retry: 3,
    retryDelay: 1000,
  });

  const { data: allProductsForCategories = [], isLoading: loadingAllProducts } =
    useQuery({
      queryKey: ["all-products-for-categories"],
      queryFn: async () => {
        const res = await ProductService.getAllProduct("", 1000, 0);
        return res.data;
      },
      staleTime: 5 * 60 * 1000, // Optional: Cache trong 5 phút
    });

  const categories = useMemo(() => {
    const map = new Map();
    allProductsForCategories.forEach((p) => {
      if (!map.has(p.type)) {
        map.set(p.type, p.image);
      }
    });
    return Array.from(map.entries()).map(([type, image], idx) => ({
      id: (idx + 1).toString().padStart(4, "0"),
      name: type,
      image,
    }));
  }, [allProductsForCategories]);

  const filteredProducts = useMemo(() => {
    let result = products;
    if (searchTerm.trim() !== "") {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return result;
  }, [products, searchTerm]);

  // Handlers
  const handleCardClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };
  const handleLoadMore = () => setVisibleCount((c) => c + itemsPerLoad);

  return (
    <section className="hero_section">
      <section className="menu_section">
        <Container>
          {/* Heading */}
          <Row>
            <Col lg={{ span: 8, offset: 2 }} className="text-center mb-5">
              <h2 style={{ color: "#FF6347" }}>LOOKING FOR THE MENU</h2>
            </Col>
          </Row>

          {/* Categories */}
          <CategoryComponent
            categories={categories.length > 0 ? categories : categoryData}
          />

          {/* Product Detail Modal */}
          <ProductDetailComponent
            product={selectedProduct}
            show={showModal}
            onHide={() => setShowModal(false)}
          />

          {/* Search Bar */}
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

          {/* Product Cards */}
          <Row>
            {filteredProducts.map((prod, idx) => (
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

          {/* Load More */}
          {filteredProducts.length >= visibleCount && (
            <Row className="mt-4">
              <Col className="text-center">
                <button
                  className="btn btn-outline-warning"
                  onClick={handleLoadMore}
                  style={{ fontWeight: "bold" }}
                >
                  Load More
                </button>
              </Col>
            </Row>
          )}

          {/* Promo Banners */}
          <Row className="pt-5">
            <Col sm={6} lg={5}>
              <div className="ads_box ads_img1 mb-5 mb-md-0">
                <h4 className="mb-0">GET YOUR FREE</h4>
                <h5>CHEESE FRIES</h5>
                <Link to="/" className="btn btn_red px-4 rounded-0">
                  Learn More
                </Link>
              </div>
            </Col>
            <Col sm={6} lg={7}>
              <div className="ads_box ads_img2">
                <h4 className="mb-0">GET YOUR FREE</h4>
                <h5>CHEESE FRIES</h5>
                <Link to="/" className="btn btn_red px-4 rounded-0">
                  Learn More
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </section>
  );
}

export default Section3;
