import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DefaultComponent from "./components/DefaultComponent/DefaultComponent";
import { updateUser } from "./redux/slices/userSlice";
import { routes } from "./routes/index";
import * as UserService from "./services/UserService";
import { isJsonString } from "./utils";

function App() {
  const dispatch = useDispatch();
  const [isPending, setIsPending] = useState(false);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    setIsPending(true);
    const { storageData, decoded } = handleDecoded();
    if (decoded?.id) {
      handleGetDetailUser(decoded?.id, storageData);
    }
  }, []);

  // Handle decoded token and extract user data
  const handleDecoded = () => {
    let storageData = localStorage.getItem("access_token");
    let decoded = {};
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData);
      decoded = jwtDecode(storageData); // Decode the token
    }
    return { decoded, storageData };
  };

  // Interceptor to add refresh token if the current token is expired
  UserService.axiosJWT.interceptors.request.use(
    async (config) => {
      const currentTime = new Date();
      const { decoded } = handleDecoded();
      console.log("Decoded Token: ", decoded);  // Log decoded token to verify

      // Check if token is expired
      if (decoded?.exp < currentTime.getTime() / 1000) {
        console.log("Token expired, refreshing...");

        // Call refreshToken if expired
        const data = await UserService.refreshToken();

        // Log the new token to verify refresh
        console.log("New Access Token: ", data?.access_token);

        // Update the config headers with the new token
        config.headers["token"] = `Bearer ${data?.access_token}`;
        
        // Optionally, update the localStorage with the new token
        localStorage.setItem("access_token", JSON.stringify(data?.access_token));
      } else {
        console.log("Token is valid, using current token.");
      }

      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  // Get detailed user information
  const handleGetDetailUser = async (id, access_token) => {
    const res = await UserService.getDetailUser(id, access_token);
    dispatch(updateUser({ ...res?.data, access_token: access_token }));
    setIsPending(false);
  };

  return (
    <>
      <Router>
        <Routes>
          {routes.map((route) => {
            const Page = route.page;
            const Layout = route.isShowHeader
              ? DefaultComponent
              : React.Fragment;
            const isCheckAuth = !route?.isPrivate || user?.isAdmin;
            if (!isCheckAuth) return null;
            return (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </Router>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </>
  );
}

export default App;
