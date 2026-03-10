import React from "react";

const About = () => {
  return (
    <div className="about-page container">

      <h1 className="page-title">About Bracker India</h1>

      <div className="about-grid">

        <div className="about-card">
          <h3>Who We Are</h3>
          <p>
            Bracker India manufactures industrial machinery and LD polythene &
            garbage bags, providing reliable products to businesses across India.
          </p>
        </div>

        <div className="about-card">
          <h3>Our Mission</h3>
          <p>
            Deliver quality manufacturing solutions with affordability and
            trust.
          </p>
        </div>

        <div className="about-card">
          <h3>Our Vision</h3>
          <p>
            Build long-term partnerships by supplying dependable industrial
            products.
          </p>
        </div>

      </div>

    </div>
  );
};

export default About;