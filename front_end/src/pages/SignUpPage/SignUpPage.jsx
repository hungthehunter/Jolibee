import { useEffect, useState } from "react";
import { Col, Container, Image, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Burger_14 from "../../assets/menu/burger-14.jpg";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent/ButtonComponent";
import InputForm from "../../components/InputForm/InputForm";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import * as Message from "../../components/MessageComponent/MessageComponent";
import { useMutationHook } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService";

import "../../styles/SignInStyle.css";
function SignUpPage() {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isDelaying, setIsDelaying] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const mutation = useMutationHook((data) => UserService.signupUser(data));

  const { data, isPending,isSuccess, isError } = mutation;

  useEffect(() => {
    if (isSuccess) {
      Message.toastSuccess("Register successfully");
      setIsDelaying(true);
      const timer = setTimeout(() => {
        setIsDelaying(false);
        handleNavigateSignIn();
      }, 2000);
      return () => clearTimeout(timer);
    } else if (isError) {
      Message.toastError("Register failed");
    }
  }, [isSuccess, isError , navigate]);

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };
  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleForgotPasswordPage = () => navigate("/forgot-password");


  const handleNavigateSignIn = () => {
    navigate("/sign-in");
  };

  const handleSignUp = () => {
    mutation.mutate({
      email: email,
      password: password,
      phone: phone,
      name: name,
      confirmPassword: confirmPassword,
    });
  };


return (
  <Container fluid className="WrapperContainer" style={{ backgroundColor: "white" }}>
    <Row className="min-vh-100 align-items-center">
      <Col
        xs={12}
        md={6}
        className="p-4 d-flex flex-column justify-content-center"
      >
        <h1 className="text-warning fw-bold" style={{ fontSize: "2.5rem" }}>
          Welcome to Tasty Burger 🍔
        </h1>
        <p className="text-danger fw-bold mt-4 mb-4" style={{ fontSize: "1.5rem" }}>
          Sign in to get more discount 💸
        </p>

        <InputForm
          type="text"
          size={500}
          placeholder="Enter your email ..."
          value={email}
          onChange={handleEmailChange}
          styleInput={{
            border: "1px solid #ccc",
            borderRadius: "5px",
            padding: "10px",
            width: "100%",
          }}
        />

        <InputForm
          type="text"
          size={500}
          placeholder="Enter your phone ..."
          value={phone}
          onChange={handlePhoneChange}
          styleInput={{
            border: "1px solid #ccc",
            borderRadius: "5px",
            padding: "10px",
            width: "100%",
          }}
        />

        {/* Password Input */}
        <div style={{ position: "relative" }}>
          <InputForm
            type={isShowPassword ? "text" : "password"}
            size={50}
            placeholder="Enter your password ..."
            value={password}
            onChange={handlePasswordChange}
          />
          <span
            style={{
              zIndex: 10,
              position: "absolute",
              top: "5px",
              right: "8px",
              cursor: "pointer",
            }}
            onClick={() => setIsShowPassword(!isShowPassword)}
          >
            {isShowPassword ? (
              <i className="bi bi-eye fs-5"></i>
            ) : (
              <i className="bi bi-eye-slash fs-5"></i>
            )}
          </span>
        </div>

        {/* Confirm Password Input */}
        <div style={{ position: "relative" }}>
          <InputForm
            type={isShowConfirmPassword ? "text" : "password"}
            size={50}
            placeholder="Enter your confirm password ..."
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
          />
          <span
            style={{
              zIndex: 10,
              position: "absolute",
              top: "5px",
              right: "8px",
              cursor: "pointer",
            }}
            onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
          >
            {isShowConfirmPassword ? (
              <i className="bi bi-eye fs-5"></i>
            ) : (
              <i className="bi bi-eye-slash fs-5"></i>
            )}
          </span>
        </div>

        <InputForm
          type="text"
          size={500}
          placeholder="Enter your name ..."
          value={name}
          onChange={handleNameChange}
        />

        {data?.status === "ERR" && (
          <span style={{ color: "red" }}>{data?.message}</span>
        )}

        <LoadingComponent isPending={isPending || isDelaying} />

        <ButtonComponent
          disable={
            !email.length ||
            !phone.length ||
            !name.length ||
            !password.length ||
            !confirmPassword.length ||
            isPending ||
            isDelaying
          }
          onClick={isPending || isDelaying ? null : handleSignUp}
          textButton={isPending || isDelaying ? "Signing Up..." : "Sign Up"}
          size="lg"
          styleButton={{
            backgroundColor: "#000",
            border: "none",
            color: "white",
            borderRadius: "5px",
            padding: "10px 20px",
            width: "100%",
            cursor: isPending || isDelaying ? "not-allowed" : "pointer",
            marginTop: "1rem",
            opacity: isPending || isDelaying ? 0.5 : 1,
          }}
          styleTextButton={{
            color: "white",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        />

       <p className="mt-3 mb-2">
            <span
              className="WrapperTextLight"
              onClick={handleForgotPasswordPage}
              style={{ cursor: "pointer", color: "#007bff" }}
            >
              Forgot your password?
            </span>
          </p>
        <p style={{ fontSize: "20px" }}>
          Already have account?
          <span className="WrapperTextLight" onClick={handleNavigateSignIn}>
            {" "}
            Sign In now?
          </span>
        </p>
      </Col>

      <Col md={6} className="d-none d-md-block p-0">
        <Image
          src={Burger_14}
          alt="Burger-logo"
          fluid
          style={{
            width: "100%",
            height: "100vh",
            objectFit: "cover",
            borderRadius: "6px",
          }}
        />
      </Col>
    </Row>
  </Container>
);
}
export default SignUpPage;
