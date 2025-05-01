import React, { useEffect, useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/logo/logo.png";
import { resetUser } from "../../redux/slices/userSlice";
import * as UserService from "../../services/UserService";
import "../../styles/HeaderStyle.css";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import PopoverComponent from "../PopoverComponent/PopoverComponent";
const Header = () => {
  const [nav, setNav] = useState(false);
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(false);
  const [userName, setUserName] = useState("");
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const handleLogOut = async () => {
    setIsPending(true);
    await UserService.logoutUser();
    dispatch(resetUser());
    setIsPending(false);
  };

  useEffect(() => {
    setIsPending(true);
    setUserName(user?.name);
    setIsPending(false);
  }, [user?.name]);

  const handleDetailUser = () => {
    navigate("/profile");
  };

  const handleSystemAdmin = () => {
    navigate("/system/admin");
  };

  const handleOrderPage = () => {
    navigate("/order");
  };

  const handleMenuPage = () => {
    navigate("/menu");
  };

  const handleMyOrder=() =>{
    navigate('/my-order',{state:{
      id: user?.id,
      token: user?.access_token
    }})
  }


  const content = () => (
    <>
      <p onClick={handleLogOut} className="popover-content">
        Log out
      </p>
      <p className="popover-content" onClick={handleDetailUser}>
        User information
      </p>
      {user?.isAdmin && (
        <p className="popover-content" onClick={handleSystemAdmin}>
          Admin system information
        </p>
      )}
        <p className="popover-content" onClick={handleMyOrder}>
        My order
      </p>
    </>
  );

  const handleNavigateLogin = () => {
    navigate("/sign-in");
  };

  const handleToHome = () => {
    navigate("/")
  }
  // Scroll Navbar
  const changeValueOnScroll = () => {
    const scrollValue = document?.documentElement?.scrollTop;
    scrollValue > 100 ? setNav(true) : setNav(false);
  };

  window.addEventListener("scroll", changeValueOnScroll);

  return (
    <header>
      <Navbar
        collapseOnSelect
        expand="lg"
        className={`${nav === true ? "sticky" : ""}`}
      >
        <Container>
          <Navbar.Brand as={Link} onClick={handleToHome} href="#home" className="logo">
            <img src={Logo} alt="Logo" className="img-fluid" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link onClick={handleToHome} style={{ cursor: "pointer" }}>
                Home
              </Nav.Link>
              <LoadingComponent isPending={isPending} delay={200} />
              <div>
                {user?.access_token ? (
                  <PopoverComponent content={content}>
                    <Nav.Link style={{ cursor: "pointer" }}>
                      Welcome {userName.length ? userName : user?.email}
                    </Nav.Link>
                  </PopoverComponent>
                ) : (
                  <Nav.Link
                    onClick={handleNavigateLogin}
                    style={{ cursor: "pointer" }}
                  >
                    Login / Register
                  </Nav.Link>
                )}
              </div>

              <Nav.Link onClick={handleMenuPage} style={{ cursor: "pointer" }}>
                Our Menu
              </Nav.Link>

              <Nav.Link   style={{ cursor: "pointer" }}  onClick={handleOrderPage}>
                <div className="cart">
                  <i className="bi bi-bag fs-5"></i>
                  <em className="roundpoint">{order?.orderItems?.length}</em>
                </div>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
