import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import PromotionImage from "../../assets/promotion/pro.png";

function Section4() {
  return (
    <>
      <section className="promotion_section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="text-center mb-5 mb-lg-0">
              <img src={PromotionImage} className="img-fluid" alt="Promotion" />
            </Col>
            <Col lg={6} className="px-5">
              <h2>Nothing brings people together like a good burger</h2>
              <p>
              A delicious burger experience that unites friends and family. With rich flavors, fresh ingredients, and a perfectly grilled patty, this burger is more than just a meal—it's a moment to share and enjoy together
              </p>
              <ul>
                <li>
                  <p>
                  More than just a meal, this burger is a reason to gather. With its juicy patty, fresh toppings, and perfectly toasted bun, it turns any moment into a shared experience of flavor and joy
                  </p>
                </li>
                <li>
                  <p>Whether it's a casual hangout or a family dinner, this burger brings people together. Packed with bold flavors and crafted with care, it's the perfect excuse to enjoy great company</p>
                </li>
                <li>
                  <p>
                  Every bite of this burger is a reminder that good food is best enjoyed with good people. From the first crunch to the last savory bite, it’s a meal made for sharing
                  </p>
                </li>
              </ul>
            </Col>
          </Row>
        </Container>
      </section>

      {/* BG Parallax Scroll */}
      <section className="bg_parallax_scroll"></section>
    </>
  );
}

export default Section4;
