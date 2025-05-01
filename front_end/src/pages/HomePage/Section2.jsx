import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Delivery from "../../assets/about/delivery-bike.png";
import Pizza from "../../assets/about/pizza.png";
import Salad from "../../assets/about/salad.png";

// Mock Data Cards
const mockData = [
  {
    image: Pizza,
    title: "Original",
    paragraph: `A timeless classic featuring a juicy beef patty, fresh lettuce, tomato, and onion, all nestled in a soft toasted bun. Served with a side of crispy fries, this burger delivers an authentic, mouthwatering experience that never goes out of style`,
  },
  {
    image: Salad,
    title: "Qualty Foods",
    paragraph: `A commitment to fresh, nutritious, and delicious ingredients. Whether it's farm-fresh produce, premium meats, or carefully crafted meals, Quality Foods ensures every bite is packed with flavor and goodness. Perfect for those who value taste and health in every meal`,
  },
  {
    image: Delivery,
    title: "Fastest Delivery",
    paragraph: `Speed and efficiency at their best! Whether it's food, packages, or essentials, our delivery service ensures your order arrives in record time. With optimized routes and dedicated couriers, we guarantee swift and reliable service, so you never have to wait long`,
  },
  // Add more mock data objects as needed
];

function Section2() {
  return (
    <>
      <section className="about_section">
        <Container>
          <Row>
            <Col lg={{ span: 8, offset: 2 }} className="text-center">
              <h2>The burger tastes better when you eat it with your family</h2>
              <p>
              A delicious burger experience that brings people together. With rich flavors and fresh ingredients, this burger is best enjoyed in good company
              </p>
              <Link to="/menu" className="btn order_now btn_red">
                Explore Full Menu
              </Link>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="about_wrapper">
        <Container>
          <Row className="justify-content-md-center">
            {mockData.map((cardData, index) => (
              <Col md={6} lg={4} className="mb-4 mb-md-0" key={index}>
                <div className="about_box text-center">
                  <div className="about_icon">
                    <img
                      src={cardData.image}
                      className="img-fluid"
                      alt="icon"
                    />
                  </div>
                  <h4>{cardData.title}</h4>
                  <p>{cardData.paragraph}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  );
}

export default Section2;
