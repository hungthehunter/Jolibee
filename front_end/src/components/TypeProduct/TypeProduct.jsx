import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TypeProduct = ({ name, selectedType, onClick }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

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
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "10px 15px",
        marginBottom: "8px",
        borderRadius: "6px",
        cursor: "pointer",
        backgroundColor: hovered ? "#f1f1f1" : "transparent",
        color: hovered || selectedType === name ? "#d32f2f" : "#000",
        fontWeight: selectedType === name ? "bold" : "normal",
        transition: "all 0.2s ease-in-out",
      }}
    >
      {name}
    </div>
  );
};

export default TypeProduct;
