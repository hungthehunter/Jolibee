import React, { useEffect, useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent/ButtonComponent";
import InputForm from "../../components/InputForm/InputForm";
import * as Message from "../../components/MessageComponent/MessageComponent";
import { useMutationHook } from "../../hooks/useMutationHook";
import { updateUser } from "../../redux/slices/userSlice";
import * as UserService from "../../services/UserService";
import "../../styles/ProfileStyle.css";

const ProfilePage = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const mutation = useMutationHook((data) => {
    const { id, access_token, formData } = data;
    return UserService.updateUser(id, formData, access_token);
  });

  const { data, isPending, isSuccess, isError } = mutation;

  useEffect(() => {
    if (isSuccess) {
      Message.toastSuccess("Update successfully");
      handleGetDetailUser(user?.id, user?.access_token);
    }
  }, [isSuccess, isError]);

  const handleGetDetailUser = async (id, token) => {
    const res = await UserService.getDetailUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token }));
  };

  useEffect(() => {
    setEmail(user?.email);
    setName(user?.name);
    setPhone(user?.phone);
    setAddress(user?.address);
    setAvatar(user?.avatar);
  }, [user]);

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleChangeName = (e) => {
    setName(e.target.value);
  };
  const handleChangePhone = (e) => {
    setPhone(e.target.value);
  };
  const handleChangeAddress = (e) => {
    setAddress(e.target.value);
  };

  const handleChangeAvatar = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
    setAvatar(URL.createObjectURL(file)); // Preview ảnh tạm thời
  };

  const handleUpdate = () => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("address", address);
    if (avatarFile) {
      formData.append("avatar", avatarFile); // tên field phải trùng với backend
    }
    mutation.mutate({
      id: user?.id,
      access_token: user?.access_token,
      formData: formData,
    });
  };

  return (
    <div className="profile">
      <div className="container mt-5">
        <h5 style={{ color: "yellow" }}>Thông tin người dùng</h5>
        <Card className="p-4 shadow-sm">
          <Form>
            {/* Name */}
            <Form.Group as={Row} className="mb-3" controlId="formName">
              <Form.Label column sm={2} className="form-label">
                Name
              </Form.Label>
              <Col sm={7}>
                <InputForm
                  value={name}
                  onChange={handleChangeName}
                  type="text"
                  size={50}
                  placeholder="Enter your name ..."
                />
              </Col>
              <Col sm={3} className="form-col_button">
                <ButtonComponent
                  onClick={handleUpdate}
                  disable={false}
                  variant="primary"
                  className="w-100 form-button"
                  styleButton={{
                    height: "30px",
                    width: "fit-content",
                    border: "1px solid rgb(26,148,255)",
                    borderRadius: "4px",
                    padding: "6px",
                  }}
                  textButton="Cập nhật"
                />
              </Col>
            </Form.Group>

            {/* Email */}
            <Form.Group as={Row} className="mb-3" controlId="formEmail">
              <Form.Label column sm={2} className="form-label">
                Email
              </Form.Label>
              <Col sm={7}>
                <InputForm
                  value={email}
                  onChange={handleChangeEmail}
                  type="text"
                  size={50}
                  placeholder="Enter your email..."
                />
              </Col>
              <Col sm={3} className="form-col_button">
                <ButtonComponent
                  onClick={handleUpdate}
                  disable={false}
                  variant="primary"
                  className="w-100 form-button"
                  styleButton={{
                    height: "30px",
                    width: "fit-content",
                    border: "1px solid rgb(26,148,255)",
                    borderRadius: "4px",
                    padding: "6px",
                  }}
                  textButton="Cập nhật"
                />
              </Col>
            </Form.Group>

            {/* Phone */}
            <Form.Group as={Row} className="mb-3" controlId="formPhone">
              <Form.Label column sm={2} className="form-label">
                Phone
              </Form.Label>
              <Col sm={7}>
                <InputForm
                  value={phone}
                  onChange={handleChangePhone}
                  type="text"
                  size={50}
                  placeholder="Enter your phone ..."
                />
              </Col>
              <Col sm={3} className="form-col_button">
                <ButtonComponent
                  onClick={handleUpdate}
                  disable={false}
                  variant="primary"
                  className="w-100 form-button"
                  styleButton={{
                    height: "30px",
                    width: "fit-content",
                    border: "1px solid rgb(26,148,255)",
                    borderRadius: "4px",
                    padding: "6px",
                  }}
                  textButton="Cập nhật"
                />
              </Col>
            </Form.Group>

            {/* Address */}
            <Form.Group as={Row} className="mb-3" controlId="formAddress">
              <Form.Label column sm={2} className="form-label">
                Address
              </Form.Label>
              <Col sm={7}>
                <InputForm
                  value={address}
                  onChange={handleChangeAddress}
                  type="text"
                  size={50}
                  placeholder="Enter your Address ..."
                />
              </Col>
              <Col sm={3} className="form-col_button">
                <ButtonComponent
                  onClick={handleUpdate}
                  disable={false}
                  variant="primary"
                  className="w-100 form-button"
                  styleButton={{
                    height: "30px",
                    width: "fit-content",
                    border: "1px solid rgb(26,148,255)",
                    borderRadius: "4px",
                    padding: "6px",
                  }}
                  textButton="Cập nhật"
                />
              </Col>
            </Form.Group>

            {/* Avatar */}
            <Form.Group as={Row} className="mb-3" controlId="formAvatar">
              <Form.Label column sm={2} className="form-label">
                Avatar
              </Form.Label>
              <Col sm={7}>
                <InputForm
                  type="file"
                  accept="image/*"
                  onChange={handleChangeAvatar}
                  className="form-control"
                />
                {avatar && (
                  <img
                    src={avatar}
                    alt="avatar"
                    style={{
                      marginTop: "10px",
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                )}
              </Col>
              <Col sm={3} className="form-col_button">
                <ButtonComponent
                  onClick={handleUpdate}
                  disable={false}
                  variant="primary"
                  className="w-100 form-button"
                  styleButton={{
                    height: "30px",
                    width: "fit-content",
                    border: "1px solid rgb(26,148,255)",
                    borderRadius: "4px",
                    padding: "6px",
                  }}
                  textButton="Cập nhật"
                />
              </Col>
            </Form.Group>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
