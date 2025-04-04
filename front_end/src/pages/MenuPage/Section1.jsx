import React, { useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Image1 from "../../assets/menu/burger-11.jpg";
import Image2 from "../../assets/menu/burger-12.jpg";
import Image3 from "../../assets/menu/burger-13.jpg";
import Image4 from "../../assets/menu/burger-14.jpg";
import Image5 from "../../assets/menu/burger-15.jpg";
import Image6 from "../../assets/menu/burger-16.jpg";
import Image7 from "../../assets/menu/burger-17.jpg";
import Image8 from "../../assets/menu/burger-18.jpg";
import Burger_banner from "../../assets/selection/burger_banner.jpg";
import Burger_combo_banner from "../../assets/selection/burger_combo_banner.jpg";
import Chip_banner from "../../assets/selection/chip_banner.png";
import Drink_banner from "../../assets/selection/drink_banner.jpg";
import New_banner from "../../assets/selection/new_banner.png";
import Rice_banner from "../../assets/selection/rice_banner.png";
import Soft_drink_banner from "../../assets/selection/soft_drink_banner.png";
import CategoryComponent from "../../components/CategoryComponent/CategoryComponent";
import Cards from "../../components/Layouts/Cards";
import ProductDetailComponent from "../../components/ProductDetailComponent/ProductDetailComponent";
// Mock Data Cards
const mockData = [
  {
    id: "0001",
    image: Image1,
    title: "Crispy Chicken",
    paragraph: "Chicken breast, chilli sauce, tomatoes, pickles, coleslaw",
    rating: 5,
    price: 99.15,
  },
  {
    id: "0002",
    image: Image2,
    title: "Ultimate Bacon",
    paragraph: "House patty, cheddar cheese, bacon, onion, mustard",
    rating: 4.5,
    price: 99.32,
  },
  {
    id: "0003",
    image: Image3,
    title: "Black Sheep",
    paragraph: "American cheese, tomato relish, avocado, lettuce, red onion",
    rating: 4,
    price: 69.15,
  },
  {
    id: "0004",
    image: Image4,
    title: "Vegan Burger",
    paragraph: "House patty, cheddar cheese, bacon, onion, mustard",
    rating: 3.5,
    price: 99.25,
  },
  {
    id: "0005",
    image: Image5,
    title: "Double Burger",
    paragraph: "2 patties, cheddar cheese, mustard, pickles, tomatoes",
    rating: 3.0,
    price: 59.25,
  },
  {
    id: "0006",
    image: Image6,
    title: "Turkey Burger",
    paragraph: "Turkey, cheddar cheese, onion, lettuce, tomatoes, pickles",
    rating: 3,
    price: 79.18,
  },
  {
    id: "0007",
    image: Image7,
    title: "Smokey House",
    paragraph: "patty, cheddar cheese, onion, lettuce, tomatoes, pickles",
    rating: 2.5,
    price: 99.19,
  },
  {
    id: "0008",
    image: Image8,
    title: "Classic Burger",
    paragraph: "cheddar cheese, ketchup, mustard, pickles, onion",
    rating: 2.0,
    price: 89.12,
  },
  // Add more mock data objects as needed
];

const categoryData = [
  {
    id: "0001",
    image: New_banner,
    title: "New Food",
  },
  {
    id: "0002",
    image: Burger_banner,
    title: "Burger",
  },
  {
    id: "0003",
    image: Burger_combo_banner,
    title: "Combo",
  },
  {
    id: "0004",
    image: Drink_banner,
    title: "Fried Chicken",
  },
  {
    id: "0005",
    image: Chip_banner,
    title: "Chips",
  },
  {
    id: "0006",
    image: Rice_banner,
    title: "Brown Rice",
  },
  {
    id: "0007",
    image: Soft_drink_banner,
    title: "Soft Drink",
  },
];

// Rating Logical Data
const renderRatingIcons = (rating) => {
  const stars = [];

  for (let i = 0; i < 5; i++) {
    if (rating > 0.5) {
      stars.push(<i key={i} className="bi bi-star-fill"></i>);
      rating--;
    } else if (rating > 0 && rating < 1) {
      stars.push(<i key={"half"} className="bi bi-star-half"></i>);
      rating--;
    } else {
      stars.push(<i key={`empty${i}`} className="bi bi-star"></i>);
    }
  }
  return stars;
};

function Section1() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleCardClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  return (
    <section className="hero_section">
      <section className="menu_section">
        <Container>
          <Row>
            <Col lg={{ span: 8, offset: 2 }} className="text-center mb-5">
              <h2 style={{ color: "#FF6347" }}>LOOKING FOR THE MENU</h2>
            </Col>
          </Row>
          <CategoryComponent categories={categoryData} />
          <ProductDetailComponent
            product={selectedProduct}
            show={showModal}
            onHide={() => setShowModal(false)}
          />
          <Row>
            <Col lg={{ span: 8, offset: 2 }} className="text-center mb-5">
              <h2 style={{ color: "#F27B01" }}>OR FIND YOUR CRAZY BURGERS</h2>
              <InputGroup>
                <Form.Control
                  placeholder="Search your burger"
                  aria-label="Search your burger"
                />
                <Button variant="dark" id="button-search1">
                  <span>
                    <i
                      className="bi bi-search"
                      style={{
                        width: "1.5rem",
                        height: "1.5rem",
                        color: "#F27B01",
                        paddingRight: "0.5rem",
                      }}
                    ></i>
                  </span>
                  Searching
                </Button>
              </InputGroup>
            </Col>
          </Row>
          <Row>
            {mockData.map((cardData, index) => (
              <Cards
                key={index}
                image={cardData.image}
                rating={cardData.rating}
                title={cardData.title}
                paragraph={cardData.paragraph}
                price={cardData.price}
                renderRatingIcons={renderRatingIcons}
                onClick={() => handleCardClick(cardData)}
              />
            ))}
          </Row>

          <Row className="pt-5">
            <Col sm={6} lg={5}>
              <div className="ads_box ads_img1 mb-5 mb-md-0">
                <h4 className="mb-0">GET YOUR FREE</h4>
                <h5>CHEESE FRIES</h5>
                <Link to="/" className="btn btn_red px-4 rounded-0" >
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

export default Section1;
