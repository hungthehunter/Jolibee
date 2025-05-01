import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import InputForm from "../../InputForm/InputForm";
import LoadingComponent from "../../LoadingComponent/LoadingComponent";

const ModalUserComponent = ({
  show,
  handleClose,
  mutationCreate,
  isPending,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    isAdmin: false,
    password: "",
    confirmPassword: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, files, type, checked } = e.target;

    if (name === "avatar" && files?.[0]) {
      const file = files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setFormData((prev) => ({
        ...prev,
        avatar: file, 
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : e.target.value,
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      isAdmin: false,
      password: "",
      confirmPassword: "",
    });
    setImageFile(null);
    setImagePreview("");
  };

  const onSave = () => {
    mutationCreate.mutate({ formData });
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        resetForm();
        handleClose();
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Add New User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {["name", "email", "phone", "address", "city"].map((field) => (
            <Form.Group className="mb-3" key={field}>
              <Form.Label>{field}</Form.Label>
              <InputForm
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={`Enter ${field}`}
              />
            </Form.Group>
          ))}
          <Form.Group className="mb-3" key="password">
            <Form.Label>Password</Form.Label>
            <div style={{ display: "flex", gap: "10px" }}>
              <InputForm
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                autoComplete="new-password"
              />
              <Button
                variant="outline-secondary"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "Hide" : "Show"}
              </Button>
            </div>
          </Form.Group>

          <Form.Group className="mb-3" key="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <InputForm
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Avatar</Form.Label>
            <input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleChange}
              className="form-control"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="preview"
                style={{
                  marginTop: "10px",
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Is Admin"
              name="isAdmin"
              checked={formData.isAdmin}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            resetForm();
            handleClose();
          }}
          disabled={isPending}
          style={{
            opacity: isPending ? 0.5 : 1
          }}
        >
          Cancel
        </Button>
        <LoadingComponent isPending={isPending} />
        <Button variant="primary" 
        onClick={isPending ? null : onSave}
        disabled={isPending}
        style={{
          opacity: isPending ? 0.5 : 1
        }}
        >
          Save User
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalUserComponent;
