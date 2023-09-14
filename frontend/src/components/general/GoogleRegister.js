import { RegisterGoogle, RegisterUser } from "../../services/userService";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Form, Button } from 'react-bootstrap';
import jwt_decode from "jwt-decode";

function GoogleRegister() {
    const [errorMessages, setErrorMessages] = useState({});
    const [file, setFile] = useState(null);
    const [image, setImage] = useState(null);
    const [name,setName] = useState('');
    const [lastname,setLastname] = useState('');
    const location = useLocation();
    const token = location.state;
    const [email,setEmail] = useState();
    const nav = useNavigate();
    useEffect(()=>{
        //console.log(jwt_decode(token));
        var decToken = jwt_decode(token);
        setName(decToken.given_name);
        setLastname(decToken.family_name);
        setEmail(decToken.email);
    }
    );
    const renderErrorMessage = (name) =>
        name === errorMessages.name && (
            <div style={{ color: 'red', fontSize: '15px' }}>{errorMessages.message}</div>
        );

    function validate(event) {
        var valid = true;
        const username = event.target.username.value;
        const name1 = event.target.name.value;
        const lastname = event.target.lastname.value;
        const date = event.target.date.value;
        const address = event.target.address.value;

        if (username.trim() === "") {
            setErrorMessages({ name: "username", message: "Username is required!" });
            valid = false;
        }
        if (name1.trim() === "") {
            setErrorMessages({ name: "name", message: "Name is required!" });
            valid = false;
        }
        if (lastname.trim() === "") {
            setErrorMessages({ name: "lastname", message: "Lastname is required!" });
            valid = false;
        }
        if (address.trim() === "") {
            setErrorMessages({ name: "address", message: "Address is required!" });
            valid = false;
        }
        if (!date) {
            setErrorMessages({ name: "date", message: "Date of birth is required!" });
            valid = false;
        }
        const y = new Date(date).getFullYear();

        if (y > 2020 || y < 1900) {
            setErrorMessages({ name: "date", message: "Date is out of bounds!" });
            valid = false;
        }
        if (!file) {
            setErrorMessages({ name: "picture", message: "Picture is required!" });
            valid = false;
        }
        return valid;


    }
    const reg = async (data) => {
        const r = await RegisterGoogle(data);

        // if (r == true) {
        //     toast.success('successful registration!');
        //     nav('../login');
        // }
        // else {
        //     //toast.error('Invalid data!');
        //     console.log('error');
        // }

        toast.success('successful registration!');
        nav('../login');
    }

    function handleSubmit(event) {
        event.preventDefault();
        setErrorMessages({name:"username",message:""})
        setErrorMessages({ name: "name", message: "" })
        setErrorMessages({ name: "lastname", message: "" })
        setErrorMessages({ name: "date", message: "" })
        setErrorMessages({ name: "address", message: "" })
        setErrorMessages({ name: "picture", message: "" });
        if (validate(event)) {
            const formData = new FormData();
            formData.append('username', event.target.username.value);
            formData.append('name', event.target.name.value);
            formData.append('lastname', event.target.lastname.value);
            formData.append('birthday', event.target.date.value);
            formData.append('password','');
            formData.append('email', email);
            formData.append('address', event.target.address.value);
            formData.append('usertype', 'buyer');
            formData.append('file', file);
            formData.append('token',token);
            reg(formData);

        }
    }
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        let value = URL.createObjectURL(event.target.files[0]);
        setImage(value);
    };
    return (
        <>
            <Form onSubmit={handleSubmit}>
                <div className="d-flex justify-content-center align-items-center p20">
                    <div className="border border-secondary rounded p-4 w-400px" >
                        <Form.Group controlId="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" name="username" />
                            {renderErrorMessage("username")}
                        </Form.Group>
                        <Form.Group controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" name="name" defaultValue={name}/>
                            {renderErrorMessage("name")}
                        </Form.Group>

                        <Form.Group controlId="lastname">
                            <Form.Label>Lastname</Form.Label>
                            <Form.Control type="text" name="lastname" defaultValue={lastname}/>
                            {renderErrorMessage("lastname")}
                        </Form.Group>


                        <Form.Group controlId="date">
                            <Form.Label>Date of Birth</Form.Label>
                            <Form.Control type="date" name="date" />
                            {renderErrorMessage("date")}
                        </Form.Group>

                        <Form.Group controlId="address">
                            <Form.Label>Address</Form.Label>
                            <Form.Control type="text" name="address" />
                            {renderErrorMessage("address")}
                        </Form.Group>


                        <Form.Group controlId="picture">
                            <Form.Label>Profile Picture</Form.Label><br />
                            {image && <img src={image} alt="Preview" width="50px" height="50px" />}
                            <div className="mb-3">
                                <Form.Control type="file" name="image" accept=".jpg,.jpeg,.png" onChange={handleFileChange} />
                            </div>
                            {renderErrorMessage("picture")}
                        </Form.Group>

                        <Button variant="dark" type="submit" className="w-100">
                            Register
                        </Button>
                    </div>

                </div>

            </Form>

        </>
    );
}

export default GoogleRegister;