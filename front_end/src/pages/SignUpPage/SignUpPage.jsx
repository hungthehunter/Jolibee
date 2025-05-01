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
              alignSelf: "flex-start",
              paddingTop: "2rem",
              uppercase: "uppercase",
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
              uppercase: "uppercase",
            }}
          >
            Sign in to get more discount 💸
          </p>
          <div style={{ position: "relative" }}>
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
                uppercase: "uppercase",
              }}
            />
          </div>
          <div style={{ position: "relative" }}>
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
                uppercase: "uppercase",
              }}
            />
          </div>
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
          <LoadingComponent isPending={isPending || isDelaying}/>
          <ButtonComponent
            disable={
              !email.length ||
              !phone.length ||
              !name.length ||
              !password.length ||
              !confirmPassword.length ||
              isPending||
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

          <p style={{ margin: "10px 0" }}>
            <span className="WrapperTextLight">Forgot your password?</span>{" "}
          </p>
          <p style={{ fontSize: "20px" }}>
            Already have account?
            <span className="WrapperTextLight" onClick={handleNavigateSignIn}>
              {" "}
              Sign In now?
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
              border: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
}
export default SignUpPage;
