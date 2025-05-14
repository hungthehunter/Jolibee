// Trong ModalShippingInfo.jsx
import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import InputForm from "../../InputForm/InputForm";
import LoadingComponent from "../../LoadingComponent/LoadingComponent";
import ShippingAndPaymentOptions from "../../ShippingAndPaymentOptions/ShippingAndPaymentOptions";
const ModalShippingInfo = ({
  show,
  handleClose,
  mutationUpdate,
  isPending,
  userInfo,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    phone: "",
    address: "",
    paymentMethod: "",
  });
  const [tableNumber, setTableNumber] = useState("");
  const [shippingMethod, setShippingMethod] = useState("FAST");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [isPaid, setIsPaid] = useState(false);
  useEffect(() => {
    if (userInfo) {
      setFormData({
        name: userInfo?.name || "",
        city: userInfo?.city || "",
        phone: userInfo?.phone || "",
        address: userInfo?.address || "",
        paymentMethod: userInfo?.paymentMethod || "",
      });
    }
  }, [userInfo, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSave = () => {
    let newAddress = formData.address;
    let newPaymentMethod = formData.paymentMethod;
    if (shippingMethod === "EAT_IN" && tableNumber) {
      newAddress = `At restaurant table number ${tableNumber}`;
      newPaymentMethod = `EAT_IN`;
    } else if (shippingMethod === "GO_JEK") {
      newPaymentMethod = `GO_JEK`;
    } else if (shippingMethod === "FAST") {
      newPaymentMethod = `FAST`;
    }

    mutationUpdate?.mutate?.({
      ...formData,
      address: newAddress,
      shippingMethod,
      paymentMethod: newPaymentMethod,
      isPaid,
    });
    handleClose();
  };

  const handlePaypalSuccess = () => {
    setIsPaid(true);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Cập nhật thông tin giao hàng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {[
            { label: "Name", name: "name" },
            { label: "City", name: "city" },
            { label: "Phone", name: "phone" },
            { label: "Address", name: "address" },
          ].map((field) => (
            <Form.Group className="mb-3" key={field.name}>
              <Form.Label>
                <span className="text-danger">*</span> {field.label}:
              </Form.Label>
              <InputForm
                type="text"
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={`Nhập ${field.label.toLowerCase()}`}
              />
            </Form.Group>
          ))}
        </Form>
        <ShippingAndPaymentOptions
          shippingMethod={shippingMethod}
          setShippingMethod={setShippingMethod}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          onPaypalSuccess={handlePaypalSuccess}
          tableNumber={tableNumber}
          setTableNumber={setTableNumber}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleClose}
          disabled={isPending}
          style={{
            opacity: isPending ? 0.5 : 1,
          }}
        >
          Cancel
        </Button>
        <LoadingComponent isPending={isPending} />
        <Button
          variant="primary"
          onClick={isPending ? null : onSave}
          disabled={isPending}
        >
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalShippingInfo;
