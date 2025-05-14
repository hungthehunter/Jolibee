import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Burger_14 from "../../assets/menu/burger-14.jpg";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent/ButtonComponent";
import InputForm from "../../components/InputForm/InputForm";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import * as Message from "../../components/MessageComponent/MessageComponent";
import { useMutationHook } from "../../hooks/useMutationHook";
import { updateUser } from "../../redux/slices/userSlice";
import * as UserService from "../../services/UserService";
import "../../styles/SignInStyle.css";
function SignInPage() {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDelaying, setIsDelaying] = useState(false);

  const mutation = useMutationHook((data) => UserService.loginUser(data));

  const { data, isPending, isSuccess, isError } = mutation;

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };



  const handleSignIn = () => {
    mutation.mutate({
      email: email,
      password: password,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      const { status, access_token , refresh_token } = data || {};
      if (status === "ERR") {
        Message.toastError(
          "Login failed, please check password and email again!"
        );
      } else if (access_token) {
        Message.toastSuccess("Login successfully");
        localStorage.setItem("access_token", JSON.stringify(access_token));
        localStorage.setItem("refresh_token", JSON.stringify(refresh_token));

        const decoded = jwtDecode(access_token);
        if (decoded?.id) {
          handleGetDetailUser(decoded?.id, access_token);
        }
        setIsDelaying(true);
        const timer = setTimeout(() => {
          setIsDelaying(false);
          handleNavigateHome();
        }, 2000);
        return () => clearTimeout(timer);
      }
    } else if (isError) {
      Message.toastError("Login failed");
    }
  }, [isSuccess, isError, data]);

  const handleGetDetailUser = async (id, token) => {
    const storage = localStorage.getItem('refresh_token');
    const refreshToken = JSON.parse(storage);
    console.log('access_token',token)
    console.log('refreshToken',refreshToken)
    const res = await UserService.getDetailUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token, refreshToken }));
  };

  const handleNavigateSignUp = () => {
    navigate("/sign-up");
  };

  const handleForgotPasswordPage = () => {
    navigate("/forgot-password");
  };

  const handleNavigateHome = () => {
    navigate("/");
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
          <LoadingComponent isPending={isPending || isDelaying} />
          <ButtonComponent
            disable={
              !email.length || !password.length || isPending || isDelaying
            }
            onClick={isPending || isDelaying ? null : handleSignIn}
            textButton={isPending || isDelaying ? "Signing In..." : "Sign In"}
            size="lg"
            styleButton={{
              backgroundColor: "#000",
              border: "none",
              color: "white",
              borderRadius: "5px",
              padding: "10px 20px",
              cursor: isPending || isDelaying ? "not-allowed" : "pointer",
              width: "100%",
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
            <span className="WrapperTextLight" onClick={()=>handleForgotPasswordPage()}>Forgot your password?</span>{" "}
          </p>
          <p style={{ fontSize: "20px" }}>
            Doesn't have account yet?
            <span className="WrapperTextLight" onClick={handleNavigateSignUp}>
              {" "}
              Sign up now?
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
export default SignInPage;
