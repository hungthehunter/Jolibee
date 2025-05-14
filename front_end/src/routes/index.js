import AdminPage from "../pages/AdminPage/AdminPage";
import ForgotPage from "../pages/ForgotPage/ForgotPage";
import HomePage from "../pages/HomePage/HomePage";
import MenuPage from "../pages/MenuPage/MenuPage";
import MyOrderPage from "../pages/MyOrderPage/MyOrderPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import OrderDetail from "../pages/OrderDetail/OrderDetail";
import OrderPage from "../pages/OrderPage/OrderPage";
import OrderSuccess from "../pages/OrderSuccess/OrderSuccess";
import ProductsPage from "../pages/ProductsPage/ProductsPage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import SignInPage from "../pages/SignInPage/SignInPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import TypeProductPage from "../pages/TypeProductPage/TypeProductPage";

export const routes = [
  {
    path: "/",
    page: HomePage,
    isShowHeader: false,
  },
  {
    path: "/order",
    page: OrderPage,
    isShowHeader: true,
  },
  {
    path: "/order-success",
    page: OrderSuccess,
    isShowHeader: true,
  },
  {
    path: "/product",
    page: ProductsPage,
    isShowHeader: true,
  },
  {
    path: "/menu",
    page: MenuPage,
    isShowHeader: false,
  },
  {
    path: "/my-order",
    page: MyOrderPage,
    isShowHeader: true,
  },

  {
    path: "/order-detail/:id",
    page: OrderDetail,
    isShowHeader: true,
  },
  {
    path: "/sign-in",
    page: SignInPage,
    isShowHeader: false,
  },
  {
    path: "/sign-up",
    page: SignUpPage,
    isShowHeader: false,
  },
  {
    path: "/forgot-password",
    page: ForgotPage,
    isShowHeader: false,
  },
  {
    path: "/profile",
    page: ProfilePage,
    isShowHeader: true,
  },
  {
    path: "/system/admin",
    page: AdminPage,
    isShowHeader: false,
    isPrivate: true,
  },
  {
    path: "/menu/:type",
    page: TypeProductPage,
    isShowHeader: true,
  },
  {
    path: "*",
    page: NotFoundPage,
  },
];
