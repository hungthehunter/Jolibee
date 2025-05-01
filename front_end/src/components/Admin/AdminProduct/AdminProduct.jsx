import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import { useSelector } from "react-redux";
import * as ProductService from "../../../services/ProductService";
import DrawerComponent from "../../DrawerComponent/DrawerComponent";
import InputForm from "../../InputForm/InputForm";
import LoadingComponent from "../../LoadingComponent/LoadingComponent";
import { toastError, toastSuccess } from "../../MessageComponent/MessageComponent";
import ModalConfirmDelete from "../../ModalComponent/ModalConfirmDelete/ModalConfirmDelete";
import ModalProductComponent from "../../ModalComponent/ModalProductComponent/ModalProductComponent";
import NumericFilter from "../../NumericFilter/NumericFilter";
import TableComponent from "../../TableComponent/TableComponent";

const AdminProduct = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [numericFilters, setNumericFilters] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [rowSelected, setRowSelected] = useState(null);
  const [isShowDrawer, setIsShowDrawer] = useState(false);
  const [formData, setFormData] = useState({});
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);

  const user = useSelector((state) => state.user);
  const queryClient = useQueryClient();

  const { isPending: isPendingProduct, data: products } = useQuery({
    queryKey: ["products", searchTerm, page, limit],
    queryFn: () => ProductService.getAllProduct(searchTerm, limit, page),
    keepPreviousData: true,
  });

  const { data: detailProduct } = useQuery({
    queryKey: ["product-details", rowSelected],
    queryFn: () => ProductService.getDetailsProduct(rowSelected),
    enabled: !!rowSelected,
  });

  useEffect(() => {
    if (detailProduct?.data) {
      setFormData(detailProduct.data);
      setImagePreview(detailProduct.data.image);
    }
  }, [detailProduct]);

  const filterProducts = () => {
    if (!products?.data?.length) return [];
    let filtered = [...products.data];
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.price.toString().includes(searchTerm)
      );
    }

    Object.entries(numericFilters).forEach(([field, { min, max }]) => {
      if (min !== "") filtered = filtered.filter((product) => product[field] >= parseFloat(min));
      if (max !== "") filtered = filtered.filter((product) => product[field] <= parseFloat(max));
    });

    return filtered;
  };

  const handleNumericFilter = (field) => (filter) => {
    setNumericFilters((prev) => ({
      ...prev,
      [field]: filter,
    }));
  };

  const mutationUpdate = useMutation({
    mutationFn: ({ formData, access_token }) => {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => form.append(key, value));
      if (imageFile) form.append("image", imageFile);
      return ProductService.updateProduct(rowSelected, form, access_token);
    },
    onSuccess: () => {
      toastSuccess("Update thành công!");
      setIsShowDrawer(false);
    },
    onError: () => {
      toastError("Update thất bại!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const mutationDeleteMany = useMutation({
    mutationFn: ({ ids, access_token }) => ProductService.deleteManyProduct(ids, access_token),
    onSuccess: () => {
      toastSuccess("Xóa nhiều sản phẩm thành công!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setSelectedRows([]);
    },
    onError: () => {
      toastError("Xóa nhiều sản phẩm thất bại!");
    },
  });

  const mutationDelete = useMutation({
    mutationFn: ({ id, access_token }) => ProductService.deleteProduct(id, access_token),
    onSuccess: () => {
      toastSuccess("Xóa sản phẩm thành công!");
      setShowDeleteModal(false);
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {
      toastError("Xóa sản phẩm thất bại!");
    },
  });

  const handleDelete = (id) => {
    setProductToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    mutationDelete.mutate({
      id: productToDelete,
      access_token: user?.access_token,
    });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files?.[0]) {
      const file = files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const onUpdate = () => {
    mutationUpdate.mutate({ formData, access_token: user?.access_token });
  };

  const columns = [
    { title: "#", dataIndex: "_id", exportTitle: "#" },
    {
      title: "Image",
      dataIndex: "image",
      render: (image) => <img src={image} alt="product" style={{ width: 50, height: 50, objectFit: "cover" }} />,
    },
    { title: "Product Name", dataIndex: "name", exportTitle: "Product Name" },
    {
      title: (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span>Price</span>
          <NumericFilter label="Price" onFilter={handleNumericFilter("price")} />
        </div>
      ),
      dataIndex: "price",
      render: (price) => `$${price}`,
      exportTitle: "Price",
    },
    {
      title: (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span>Stock</span>
          <NumericFilter label="Inventory" onFilter={handleNumericFilter("countInStock")} />
        </div>
      ),
      dataIndex: "countInStock",
      exportTitle: "Stock",
    },
  ];

  const renderAction = (product) => (
    <>
      <Button
        size="sm"
        variant="warning"
        className="me-2"
        onClick={() => {
          setRowSelected(product._id);
          setIsShowDrawer(true);
        }}
      >
        <BsPencilSquare />
      </Button>
      <Button size="sm" variant="danger" onClick={() => handleDelete(product._id)}>
        <BsTrash />
      </Button>
    </>
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Product Management</h4>
        <Button variant="success" onClick={() => setShowModal(true)}>
          + Add Product
        </Button>
      </div>

      <Form.Control
        type="text"
        placeholder="Search by product type"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setPage(0); // reset to page 0 when searchTerm changes
        }}
        className="mb-3"
      />

      {selectedRows.length > 0 && (
        <Button
          variant="danger"
          className="mb-3"
          onClick={() =>
            mutationDeleteMany.mutate({
              ids: selectedRows,
              access_token: user?.access_token,
            })
          }
        >
          Xóa {selectedRows.length} sản phẩm đã chọn
        </Button>
      )}

      <TableComponent
        products={filterProducts()}
        isPending={isPendingProduct}
        columns={columns}
        rowSelected={rowSelected}
        setRowSelected={setRowSelected}
        setSelectedIds={setSelectedRows}
        action={renderAction}
      />

      <ModalProductComponent show={showModal} handleClose={() => setShowModal(false)} />

      <DrawerComponent title="Update Product" isOpen={isShowDrawer} onClose={() => setIsShowDrawer(false)}>
        <Form>
          {["name", "type", "price", "countInStock", "rating", "description", "discount"].map((field) => (
            <Form.Group className="mb-3" key={field}>
              <Form.Label>{field}</Form.Label>
              <InputForm
                type={
                  field === "description"
                    ? "textarea"
                    : ["price", "countInStock", "discount", "rating"].includes(field)
                    ? "number"
                    : "text"
                }
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                placeholder={`Enter ${field}`}
              />
            </Form.Group>
          ))}
          <Form.Group className="mb-3">
            <Form.Label>Image</Form.Label>
            <InputForm type="file" name="image" accept="image/*" onChange={handleChange} />
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
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setIsShowDrawer(false)}>
              Close
            </Button>
            <LoadingComponent isPending={false} />
            <Button variant="primary" onClick={onUpdate}>
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </DrawerComponent>

      <ModalConfirmDelete
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default AdminProduct;
