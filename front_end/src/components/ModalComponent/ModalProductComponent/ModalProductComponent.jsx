import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import * as ProductService from "../../../services/ProductService";
import InputForm from "../../InputForm/InputForm";
import LoadingComponent from "../../LoadingComponent/LoadingComponent";
import * as Message from "../../MessageComponent/MessageComponent";

const ModalProductComponent = ({ show, handleClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    price: "",
    countInStock: "",
    rating: "",
    description: "",
    discount: "",
  });

  const { data: types = [], isPending: loadingTypes } = useQuery({
    queryKey: ["productTypes"],
    queryFn: ProductService.getAllType,
    select: (res) => {
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data) => {
      const payload = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        payload.append(key, value);
      });
      if (imageFile) {
        payload.append("image", imageFile);
      }
      return ProductService.createProduct(payload);
    },
    onSuccess: () => {
      Message.toastSuccess("Product created successfully");
      queryClient.invalidateQueries(["products"]);
      resetForm();
      handleClose();
    },
    onError: (error) => {
      if (error.response && error.response.data) {
        console.error("Server error:", error.response.data);
      }
      Message.toastError("Failed to create product");
    },
    onSettled: () => {
      queryClient.invalidateQueries(["products"]);
    },
  });

  const { isPending, isSuccess, isError } = mutation;

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files?.[0]) {
      const file = files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else if (name === "type" && value === "__add_new__") {
      setFormData((prev) => ({ ...prev, type: "__add_new__" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const onSave = () => {
    const dataToSubmit = { ...formData, discount: Number(formData.discount) };
    mutation.mutate(dataToSubmit);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      price: "",
      countInStock: "",
      rating: "",
      description: "",
      discount:"",
    });
    setImageFile(null);
    setImagePreview("");
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
        <Modal.Title>Add New Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {[
            "name",
            "price",
            "countInStock",
            "rating",
            "description",
            "discount",
          ].map((field) => (
            <Form.Group className="mb-3" key={field}>
              <Form.Label>{field}</Form.Label>
                <InputForm
                  type={field === "description" ? "textarea" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={`Enter ${field}`}
                />
            </Form.Group>
          ))}
          <Form.Group className="mb-3">
            <Form.Label>Type</Form.Label>
            <Form.Select
              name="type"
              value={formData.type}
              onChange={handleChange}
              disabled={loadingTypes}
            >
              <option value="">-- Select Type --</option>
              {types.map((type, idx) => (
                <option key={idx} value={type}>
                  {type}
                </option>
              ))}
              <option value="__add_new__">+ Add new type</option>
            </Form.Select>
            {formData.type === "__add_new__" && (
              <Form.Control
                className="mt-2"
                type="text"
                placeholder="Enter new type"
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, type: e.target.value }))
                }
              />
            )}
          </Form.Group>

          <Form.Group className="mb-3" controlId="formImage">
            <Form.Label>Image</Form.Label>
            <InputForm
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
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
                  borderRadius: "8px",
                }}
              />
            )}
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
        >
          Save Product
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalProductComponent;
