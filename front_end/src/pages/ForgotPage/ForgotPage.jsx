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

function ForgotPage() {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const mutation = useMutationHook((data) =>
    UserService.updateNewPasswordUser(data.formData)
  );

  const { data, isPending, isSuccess, isError } = mutation;

  const handleChangePassword = () => {
    if (password !== confirmPassword) {
      Message.toastError("Passwords do not match.");
      return;
    }

    mutation.mutate({
      formData: {
        email,
        password,
        confirmPassword,
      },
    });
  };

  useEffect(() => {
    if (isSuccess) {
      if (data?.status === "OK") {
        Message.toastSuccess("Password changed successfully");
        setTimeout(() => navigate("/sign-in"), 2000);
      } else {
        Message.toastError(data?.message || "Failed to update password.");
      }
    } else if (isError) {
      Message.toastError("Failed to update password.");
    }
  }, [isSuccess, isError, data, navigate]);

  const handleNavigateSignUp = () => {
    navigate("/sign-up");
  };

  return (
    <Container fluid className="min-vh-100 d-flex align-items-center bg-white">
      <Row className="w-100">
        {/* Left section */}
        <Col
          xs={12}
          md={6}
          className="d-flex flex-column justify-content-center p-4"
        >
          <h1 className="text-warning fw-bold mb-3">
            Welcome to Tasty Burger 🍔
          </h1>
          <p className="text-danger fs-5 fw-bold mb-4">
            Change your password 🔐
          </p>

          <InputForm
            type="text"
            placeholder="Enter your email ..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            styleInput={{
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "10px",
              width: "100%",
            }}
          />

          <div className="position-relative mt-3">
            <InputForm
              type={isShowPassword ? "text" : "password"}
              placeholder="Enter your new password ..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="position-absolute top-50 end-0 translate-middle-y me-3"
              style={{ cursor: "pointer", zIndex: 10 }}
              onClick={() => setIsShowPassword(!isShowPassword)}
            >
              {isShowPassword ? (
                <i className="bi bi-eye fs-5"></i>
              ) : (
                <i className="bi bi-eye-slash fs-5"></i>
              )}
            </span>
          </div>

          <div className="mt-3">
            <InputForm
              type={isShowPassword ? "text" : "password"}
              placeholder="Confirm your new password ..."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <LoadingComponent isPending={isPending} />

          <ButtonComponent
            disable={!email || !password || !confirmPassword || isPending}
            onClick={handleChangePassword}
            textButton={isPending ? "Updating..." : "Update Password"}
            size="lg"
            styleButton={{
              backgroundColor: "#000",
              border: "none",
              color: "white",
              borderRadius: "5px",
              padding: "10px 20px",
              cursor: isPending ? "not-allowed" : "pointer",
              width: "100%",
              marginTop: "1rem",
              opacity: isPending ? 0.5 : 1,
            }}
            styleTextButton={{
              color: "white",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          />

          <p className="mt-3 fs-6">
            Don't have an account?{" "}
            <span
              className="text-primary"
              onClick={handleNavigateSignUp}
              style={{ cursor: "pointer" }}
            >
              Sign up now
            </span>
          </p>
        </Col>

        {/* Right section */}
        <Col xs={12} md={6} className="d-none d-md-block p-0">
          <Image
            src={Burger_14}
            alt="Burger-logo"
            fluid
            className="h-100 w-100 object-fit-cover rounded-0"
          />
        </Col>
      </Row>
    </Container>
  );
}

export default ForgotPage;
