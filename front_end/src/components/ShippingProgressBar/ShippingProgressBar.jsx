import React from "react";

const ShippingProgressBar = ({ itemPrice }) => {
  const shippingSteps = [
    { min: 0, max: 20, fee: 2, label: "Below $20" },
    { min: 20, max: 100, fee: 1, label: "From $20 to under $100" },
    { min: 100, max: Infinity, fee: 0, label: "Above $100" },
  ];

  const currentLevel = shippingSteps.findIndex(
    step => itemPrice >= step.min && itemPrice < step.max
  );

  return (
    <div className="d-flex justify-content-between align-items-center my-3">
      {shippingSteps.map((step, index) => (
        <div
          key={index}
          className="text-center"
          style={{ flex: 1, position: "relative" }}
        >
          <div
            className={`rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center ${
              index <= currentLevel ? "bg-primary text-white" : "bg-light text-muted"
            }`}
            style={{ width: 30, height: 30 }}
          >
            {index <= currentLevel ? "✔" : ""}
          </div>

          <div className="fw-bold">
            {step.fee.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </div>
          <div className="text-muted small">{step.label}</div>

          {index < shippingSteps.length - 1 && (
            <div
              className="position-absolute"
              style={{
                top: 15,
                left: "50%",
                width: "100%",
                height: 2,
                backgroundColor: currentLevel >= index + 1 ? "#0d6efd" : "#dee2e6",
                zIndex: -1,
              }}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ShippingProgressBar;
