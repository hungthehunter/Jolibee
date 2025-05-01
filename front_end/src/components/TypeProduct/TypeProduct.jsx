import React from "react";
import { useNavigate } from "react-router-dom";

const TypeProduct = ({ name, selectedType, onClick }) => {
  const navigate = useNavigate();

  const handleNavigateType = () => {
    const slug = name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ /g, "_");
    navigate(`/menu/${slug}`);
    if (onClick) onClick(name);
  };

  return (
    <div
      onClick={handleNavigateType}
      style={{
        padding: "10px 15px",
        marginBottom: "8px",
        borderRadius: "6px",
        cursor: "pointer",
        hover: selectedType === name ? "#ffc107" : "#f8f9fa",
        backgroundColor:'transparent',
        fontWeight: selectedType === name ? "bold" : "normal",
      }}
    >
  {name}
    </div>
  );
};

export default TypeProduct;
