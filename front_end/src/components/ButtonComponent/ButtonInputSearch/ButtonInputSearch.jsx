import { Button, Form, InputGroup } from "react-bootstrap";

function ButtonInputSearch(props) {
  const { size, placeholder, textButton, colorButton, value, onChange } = props;
  return (
    <InputGroup style={{ marginTop: "2rem" }}>
      <Form.Control
        aria-label="Search your burger"
        size={size}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <Button
        variant="dark"
        id="button-search1"
        size={size}
        style={{ backgroundColor: colorButton, borderColor: colorButton }}
      >
        <span>
          <i
            className="bi bi-search"
            style={{
              width: "1.5rem",
              height: "1.5rem",
              color: "white",
              paddingRight: "0.5rem",
            }}
          ></i>
        </span>
        {textButton}
      </Button>
    </InputGroup>
  );
}

export default ButtonInputSearch;
