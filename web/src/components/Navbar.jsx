import { useState } from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaHome, FaUserFriends } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { Link } from 'react-router-dom';
import useAuthStore from "../store/authStore";
import { FaRegUserCircle } from "react-icons/fa";
import { IoMdExit } from "react-icons/io";

const NavigationBar = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const logout = () =>{
        useAuthStore.getState().clearToken();
    }

  return (

    <div className="">
        <Navbar  bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto">
                   <Link to="/dashboard" style={{ color: "#fff" }} className="my-2 mx-2 text-decoration-none">
                     {/* <FaHome size={26} className="me-2"/> */}Dashboard
                   </Link>
                   <Link to="/students" style={{ color: "#fff" }} className="my-2 mx-2 text-decoration-none">
                     {/* <FaUserFriends size={26} className="me-2"/> */}Students
                   </Link>
                   <Link to="/settings" style={{ color: "#fff" }} className="my-2 mx-2 text-decoration-none">
                     {/* <IoSettings size={26} className="me-2"/> */}Settings
                   </Link>
                   <div onClick={()=>logout()} style={{ color: "#fff" }} className="my-2 mx-2 text-decoration-none">
                     {/* <IoSettings size={26} className="me-2"/> */}Logout
                   </div>
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>

        <div className="mt-3 container">{children}</div>

        </div>
  );
};

export default NavigationBar;
