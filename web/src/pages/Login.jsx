import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { FaCubes } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import useAuthStore from "../store/authStore";
import api from "../services/api";
import { toast } from 'react-toastify';
import LoginBg from "../assets/login-box.jpg"
import { AUTH_LOGIN, AUTH_REGISTER } from '../services/urls';

const Login = () => {
  const [showLogin, setShowLogin] = useState(true);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");

  

  const setToken = useAuthStore((state) => state.setToken);

  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (token) navigate("/dashboard");
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(AUTH_LOGIN, { "username_or_email":email, "password":password });
      setToken(response.data.access_token);
      toast.success("Logged in successfully!");
      navigate("/dashboard")
    } catch (err) {
      toast.error("Login failed");
    }
  };

  const handelRegister = async (e) =>{
    e.preventDefault();
    try {
      const response = await api.post(AUTH_REGISTER, 
        {
          "username": username,
          "email": email,
          "password": password,
          "first_name": firstName,
          "last_name": lastName,
          "role": "Admin"
        }
      );
      toast.success("Registration completed");
      setShowLogin(true)
    } catch (err) {
      toast.error("Login failed");
    }
  }

  return (
    <div className='login-body'>
      <Container className="py-5 justify-content-center d-flex">
        <Card style={{width:"85%"}}>
          <Row className="g-0">
            
            <Col md={6}>
              <Card.Body className="d-flex flex-column h-100 justify-content-center p-5">

                <div className="d-flex flex-row mt-2 mb-3 align-items-center">
                  <FaCubes size={40} className="me-3" style={{ color: '#ff6219' }} />
                  <span className="h1 fw-bold mb-0">Logo</span>
                </div>

                <h5 className="fw-normal mb-3" style={{ letterSpacing: '1px' }}>
                  {(showLogin == true)?"Sign into your account" : "Register new account"}
                </h5>


          {(showLogin == true)? 
            <>
                <Form onSubmit={handleLogin}>
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Username or Email address</Form.Label>
                    <Form.Control placeholder="Enter email or username"  onChange={(e) => setEmail(e.target.value)} />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter password"  onChange={(e) => setPassword(e.target.value)} />
                  </Form.Group>

                  <Button className="mb-3 px-5" variant="dark" type="submit">
                    Login
                  </Button>
                </Form>

                <a className="small text-muted mb-3" href="#!">
                  Forgot password?
                </a>
                <p onClick={()=>setShowLogin(false)} className="mb-5 pb-lg-2 cursor-pointer" style={{ color: '#393f81' }}>
                  Don't have an account?{' '}
                  <a style={{ color: '#393f81' }}>
                    Register here
                  </a>
                </p>

                <div className="d-flex flex-row justify-content-start">
                  <a href="#!" className="small text-muted me-2">
                    Terms of use.
                  </a>
                  <a href="#!" className="small text-muted">
                    Privacy policy
                  </a>
                </div>
            </>:<>
            <Form onSubmit={handelRegister}>

                  <Form.Group className="mb-3" controlId="forFirstName">
                    <Form.Label>FirstName</Form.Label>
                    <Form.Control placeholder="Enter first name"  onChange={(e) => setFirstName(e.target.value)} />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="forLastName">
                    <Form.Label>LastName</Form.Label>
                    <Form.Control placeholder="Enter last name"  onChange={(e) => setLastName(e.target.value)} />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="forUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control placeholder="Enter username"  onChange={(e) => setUsername(e.target.value)} />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="forEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type='email' placeholder="Enter email"  onChange={(e) => setEmail(e.target.value)} />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter password"  onChange={(e) => setPassword(e.target.value)} />
                  </Form.Group>

                  <Button className="mb-3 px-5" variant="dark" type="submit">
                    Register
                  </Button>
                </Form>

                <a className="small text-muted mb-3" href="#!">
                  Forgot password?
                </a>
                <p onClick={()=>setShowLogin(true)} className="pb-lg-2 cursor-pointer" style={{ color: '#393f81' }}>
                  Already have an account?{' '}
                  <a style={{ color: '#393f81' }}>
                    Login
                  </a>
                </p>

                <div className="d-flex flex-row justify-content-start">
                  <a href="#!" className="small text-muted me-2">
                    Terms of use.
                  </a>
                  <a href="#!" className="small text-muted">
                    Privacy policy
                  </a>
                </div>
            </>
          }

              </Card.Body>
            </Col>
              
            <Col md={6} className="disappear-after-small">
              <Card.Img
                src={LoginBg}
                alt="login form"
                className="rounded-lg object-fit-cover h-100"
              />
            </Col>

          </Row>
        </Card>
      </Container>
    </div>
  );
}

export default Login
