import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import { useSelector } from "react-redux";
import * as UserService from "../../../services/UserService";
import DrawerComponent from "../../DrawerComponent/DrawerComponent";
import InputForm from "../../InputForm/InputForm";
import LoadingComponent from "../../LoadingComponent/LoadingComponent";
import {
  toastError,
  toastSuccess,
} from "../../MessageComponent/MessageComponent";
import ModalConfirmDelete from "../../ModalComponent/ModalConfirmDelete/ModalConfirmDelete";
import ModalUserComponent from "../../ModalComponent/ModalUserComponent/ModalUserComponent";
import TableComponent from "../../TableComponent/TableComponent";

const AdminUser = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [numericFilters, setNumericFilters] = useState({});
  const [showDrawer, setShowDrawer] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [rowSelected, setRowSelected] = useState(null);
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  const user = useSelector((state) => state.user);
  const queryClient = useQueryClient();

  const { isPending, data: users } = useQuery({
    queryKey: ["users", user?.access_token],
    queryFn: () => UserService.getAllUser(user?.access_token),
  });

  const resetFormState = () => {
    setFormData({});
    setImageFile(null);
    setImagePreview("");
    setRowSelected(null);
  };

  const { data: userDetail } = useQuery({
    queryKey: ["user-details", rowSelected, user?.access_token],
    queryFn: () => UserService.getDetailUser(rowSelected, user?.access_token),
    enabled: !!rowSelected,
  });

  useEffect(() => {
    if (userDetail?.data) {
      setFormData(userDetail.data);
      setImagePreview(userDetail.data.avatar);
    }
  }, [userDetail]);

  useEffect(() => {
    if (users?.data?.length) {
      let filtered = [...users.data];
      if (searchTerm) {
        filtered = filtered.filter(
          (u) =>
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      setFilteredUsers(filtered);
    }
  }, [users, searchTerm, numericFilters]);

  const mutationDeleteMany = useMutation({
    mutationFn: ({ ids, access_token }) => {
      return UserService.deleteManyUser(ids, access_token);
    },
    onSuccess: () => {
      toastSuccess("Xóa nhiều người dùng thành công!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setSelectedRows([]);
    },
    onError: () => {
      toastError("Xóa nhiều người dùng thất bại!");
    },
  });
  

  const mutationCreate = useMutation({
    mutationFn: ({ formData }) => {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value);
      });
      if (imageFile) form.append("avatar", imageFile);
      return UserService.createUser(form);
    },
    onSuccess: () => {
      toastSuccess("Tạo người dùng thành công!");
      setShowModal(false);
      resetFormState();
    },
    onError: () => {
      toastError("Tạo người dùng thất bại!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: ({ formData, access_token }) => {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value);
      });
      if (imageFile) form.append("avatar", imageFile);
      return UserService.updateUser(rowSelected, form, access_token);
    },
    onSuccess: () => {
      toastSuccess("Cập nhật người dùng thành công!");
      setShowDrawer(false);
      resetFormState();
    },
    onError: () => {
      toastError("Cập nhật thất bại!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const mutationDelete = useMutation({
    mutationFn: ({ id, access_token }) =>
      UserService.deleteUser(id, access_token),
    onSuccess: () => {
      toastSuccess("Xóa người dùng thành công!");
      setShowDeleteModal(false);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      toastError("Xóa người dùng thất bại!");
    },
  });


  const handleDelete = (id) => {
    setUserToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    mutationDelete.mutate({
      id: userToDelete,
      access_token: user?.access_token,
    });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar" && files?.[0]) {
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
    { title: "#", dataIndex: "_id" },
    {
      title: "Avatar",
      dataIndex: "avatar",
      render: (avatar) => (
        <img
          src={avatar}
          alt="avatar"
          style={{
            width: 40,
            height: 40,
            objectFit: "cover",
            borderRadius: "50%",
          }}
        />
      ),
    },
    { title: "Name", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    { title: "Phone", dataIndex: "phone" },
    { title: "City", dataIndex: "city" },
    {
      title: "Admin",
      dataIndex: "isAdmin",
      render: (value) => (value ? "Yes" : "No"),
    },
  ];

  const renderAction = (user) => (
    <>
      <Button
        size="sm"
        variant="warning"
        className="me-2"
        onClick={() => {
          setRowSelected(user._id);
          setShowDrawer(true);
        }}
      >
        <BsPencilSquare />
      </Button>
      <Button size="sm" variant="danger" onClick={() => handleDelete(user._id)}>
        <BsTrash />
      </Button>
    </>
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">User Management</h4>
        <Button variant="success" onClick={() => setShowModal(true)}>
          + Add User
        </Button>
      </div>

      <Form.Control
        type="text"
        placeholder="Search by name or email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
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
           Xóa {selectedRows.length} người đã chọn
        </Button>
      )}

      <TableComponent
        products={filteredUsers}
        isPending={isPending}
        columns={columns}
        rowSelected={rowSelected}
        setRowSelected={setRowSelected}
        setSelectedIds={setSelectedRows}
        action={renderAction}
      />

      <ModalUserComponent
        show={showModal}
        handleClose={() => setShowModal(false)}
        mutationCreate={mutationCreate}
        isPending={isPending}
      />

      <DrawerComponent
        title="Update User"
        isOpen={showDrawer}
        onClose={() => setShowDrawer(false)}
      >
        <Form>
          {["name", "email", "phone", "address", "city"].map((field) => (
            <Form.Group className="mb-3" key={field}>
              <Form.Label>{field}</Form.Label>
              <InputForm
                type="text"
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
              />
            </Form.Group>
          ))}
          <Form.Group className="mb-3">
            <Form.Label>Avatar</Form.Label>
            <InputForm
              type="file"
              name="avatar"
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
              checked={formData.isAdmin || false}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isAdmin: e.target.checked,
                }))
              }
            />
          </Form.Group>
          <Modal.Footer>
            <Button variant="secondary" 
            onClick={isPending ? null : () => setShowDrawer(false)}
            disabled={isPending}
            style={{
              opacity: isPending ? 0.5 : 1
            }}
            >
              Close
            </Button>
            <LoadingComponent isPending={false} />
            <Button variant="primary" 
            onClick={isPending ? null : onUpdate}
            disabled={isPending}
            style={{
              opacity: isPending ? 0.5 : 1
            }}
            >
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

export default AdminUser;
