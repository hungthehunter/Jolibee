import { Button } from "react-bootstrap";
function ButtonComponent(props) {
  const { size,styleButton,styleTextButton,textButton,disable,...rest } = props;
  return (
      <Button
      style={{
        ...styleButton,
        backGround: disable ? "#ccc" : styleButton.backGround
      }}
     size={size}
     {...rest}
      >
       <span style={styleTextButton}>{textButton}</span>
      </Button>
  );
}

export default ButtonComponent;
