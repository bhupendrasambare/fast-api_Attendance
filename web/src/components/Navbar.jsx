import { useState } from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaHome, FaUserFriends } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import useAuthStore from "../store/authStore";
import { FaRegUserCircle } from "react-icons/fa";
import { IoMdExit } from "react-icons/io";

const NavigationBar = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const logout = () =>{
        useAuthStore.getState().clearToken();
    }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: collapsed ? "60px" : "220px",
          background: "#343a40",
          color: "#fff",
          transition: "width 0.3s ease",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "10px" }} className="d-flex w-100 justify-content-end">
          <Button variant="secondary" onClick={toggleSidebar} size="lg">
            {collapsed ? "»" : "«"}
          </Button>
        </div>
        <Nav className="flex-column p-2 justify-content-center">
          <Nav.Link onClick={()=>navigate("/dashboard")} style={{ color: "#fff" }} className="my-2">
            <FaHome size={26} className="me-2"/>{collapsed? "":"Dashboard" }
          </Nav.Link>
          <Nav.Link onClick={()=>navigate("/students")} style={{ color: "#fff" }} className="my-2">
            <FaUserFriends size={26} className="me-2"/>{collapsed? "":"Students" }
          </Nav.Link>
          <Nav.Link onClick={()=>navigate("/settings")} style={{ color: "#fff" }} className="my-2">
            <IoSettings size={26} className="me-2"/>{collapsed? "":"Settings" }
          </Nav.Link>
        </Nav>
      </div>

      {/* Main content */}
      <div style={{ flex: 1 }}>
        {/* Navbar */}
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand>My App</Navbar.Brand>
              <Nav className="ms-auto">
                <div className="d-flex justify-content-around align-items-center">
                    <Nav.Link onClick={()=>navigate("/profile")}><FaRegUserCircle size={22} className="me-2" title="Profile"/></Nav.Link>
                    <Nav.Link onClick={()=>logout()}><IoMdExit size={24} className="me-2" title="Logout"/></Nav.Link>
                </div>
              </Nav>
          </Container>
        </Navbar>

        {/* Page Content */}
        <Container className="mt-3">{children}</Container>
      </div>
    </div>
  );
};

export default NavigationBar;
