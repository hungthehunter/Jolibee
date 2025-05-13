import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Image } from "react-bootstrap";
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
    UserService.updateNewPasswordUser(data.id, data.formData, data.access_token)
  );

  const { data, isPending, isSuccess, isError } = mutation;

  const handleChangePassword = () => {
    const access_token = JSON.parse(localStorage.getItem("access_token"));
    if (!access_token) {
      Message.toastError("You must be logged in to change password.");
      return;
    }

    const decoded = jwtDecode(access_token);
    const id = decoded?.id;

    if (!id) {
      Message.toastError("Invalid token.");
      return;
    }

    if (password !== confirmPassword) {
      Message.toastError("Passwords do not match.");
      return;
    }
    
    mutation.mutate({
      id,
      formData: {
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      },
      access_token,
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
    <div className="WrapperContainer">
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100vh",
          borderRadius: "6px",
          backgroundColor: "#fff",
        }}
      >
        <div className="WrapperContainerLeft">
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              color: "#F27B01",
              paddingTop: "2rem",
            }}
          >
            Welcome to Tasty Burger 🍔
          </h1>
          <p
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "#FF6347",
              paddingTop: "2rem",
              marginBottom: "2rem",
            }}
          >
            Change your password 🔐
          </p>

          <InputForm
            type="text"
            size={500}
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

          <div style={{ position: "relative", marginTop: "1rem" }}>
            <InputForm
              type={isShowPassword ? "text" : "password"}
              placeholder="Enter your new password ..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              style={{
                zIndex: 10,
                position: "absolute",
                top: "8px",
                right: "10px",
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

          <div style={{ marginTop: "1rem" }}>
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

          <p style={{ fontSize: "16px", marginTop: "1rem" }}>
            Don't have an account?{" "}
            <span
              className="WrapperTextLight"
              onClick={handleNavigateSignUp}
              style={{ cursor: "pointer", color: "#007bff" }}
            >
              Sign up now
            </span>
          </p>
        </div>

        <div className="WrapperContainerRight">
          <Image
            src={Burger_14}
            alt="Burger-logo"
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "6px",
              objectFit: "cover",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default ForgotPage;
