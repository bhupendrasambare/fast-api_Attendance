import React, { useState } from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const NavigationBar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

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
        <div style={{ padding: "10px" }}>
          <Button variant="secondary" onClick={toggleSidebar} size="sm">
            {collapsed ? "»" : "«"}
          </Button>
        </div>
        <Nav className="flex-column p-2">
          <Nav.Link href="#home" style={{ color: "#fff" }}>
            Dashboard
          </Nav.Link>
          <Nav.Link href="#students" style={{ color: "#fff" }}>
            Students
          </Nav.Link>
          <Nav.Link href="#settings" style={{ color: "#fff" }}>
            Settings
          </Nav.Link>
        </Nav>
      </div>

      {/* Main content */}
      <div style={{ flex: 1 }}>
        {/* Navbar */}
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container fluid>
            <Navbar.Brand>My App</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse>
              <Nav className="ms-auto">
                <Nav.Link href="#profile">Profile</Nav.Link>
                <Nav.Link href="#logout">Logout</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {/* Page Content */}
        <div className="p-4">
          <h2>Welcome</h2>
          <p>This is your dashboard.</p>
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
