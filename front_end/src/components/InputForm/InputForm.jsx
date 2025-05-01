import "../InputForm/InputFormStyle.css";
function InputForm(props) {
  const handleOnChangeInput = (e) => {
    props.onChange(e.target.value);
  };
  const { size, placeholder, type, styleInput, value, ...rest } = props;
  return (
    <input
      value={value ?? ""}
      size={size}
      type={type}
      placeholder={placeholder}
      style={styleInput}
      onChange={handleOnChangeInput}
      {...rest}
      className="WrapperInputStyle"
    />
  );
}
export default InputForm;
