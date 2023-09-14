import { useState } from "react";
import '../../style.css';
import { LoginUser, LoginUserGoogle } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Form, Button } from 'react-bootstrap';
import { GoogleLogin } from "@react-oauth/google";
import { toast } from 'react-toastify';
import jwt_decode from "jwt-decode";

function Login() {
    const [errorMessages, setErrorMessages] = useState({});
    const navigate = useNavigate();
    const renderErrorMessage = (name) =>
    name === errorMessages.name && (
        <div style={{ color: 'red', fontSize: '15px' }}>{errorMessages.message}</div>
    );
    function validate(event)
    {
        var valid = true;
        if(event.target.username.value.trim()==="")
        {
            valid = false;
            setErrorMessages({ name: "username", message: "Username is required!" });
        }
        if(event.target.password.value.trim()==="")
        {
            valid = false;
            setErrorMessages({ name: "password", message: "Password is required!" });
        }
        return valid;
    }
    const login = async(data,u) =>
    {
        const r = await LoginUser(data,navigate,u);
        console.log(r);
    }
    const handleSubmit = (event) =>
    {
        event.preventDefault();
        setErrorMessages({ name: "username", message: "" })
        setErrorMessages({ name: "password", message: "" })
        if(validate(event))
        {
            var formData = new FormData();
            const u = event.target.username.value;
            formData.append("username",u);
            formData.append("password",event.target.password.value);
            login(formData,u);

        }
    }
    const googleLoginHandle = async(response)=>
    {
      const token = response.credential;
      const t = jwt_decode(token);
      var fd = new FormData();
      fd.append('email',t.email);
      fd.append('token',token);
      const r = await LoginUserGoogle(fd,navigate);
    }
    function googleLoginErrorHandle()
    {
        toast.error('Google login error');
    }
    return (
        <div className="container mt-5 ">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <Form onSubmit={handleSubmit} className="bg-light border border-gray rounded">
              <div className="card">
                <div className="card-body">
                  <h3 className="card-title">Login</h3>
                  <Form.Group controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" name="username"/>
                    {renderErrorMessage("username")}
                  </Form.Group>
                  <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name="password"/>
                    {renderErrorMessage("password")}
                  </Form.Group>
                  <Form.Group>
                    <Button variant="dark" type="submit" className="mt-2">
                      Login
                    </Button>
                  </Form.Group>
                  <div>
                    Don't have an account? Go to{" "}
                    <a href="/register" className="link-dark">
                      Registration
                    </a>
                  </div>
                  <br/>
                  <p>Or login with google:</p>
                <GoogleLogin onSuccess={googleLoginHandle} onError={googleLoginErrorHandle}/>
                </div>

              </div>
            </Form>
          </div>
        </div>
      </div>
    )
}

export default Login;