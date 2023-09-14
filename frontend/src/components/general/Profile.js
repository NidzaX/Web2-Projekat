import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GetUserData,EditProfile } from "../../services/userService";
import { Form, Button } from 'react-bootstrap';
import User from "../model/User";
function Profile()
{
    const [errorMessages, setErrorMessages] = useState({});
    const [file, setFile] = useState(null);
    const [image, setImage] = useState(null);
    const [name,setName] = useState('');
    const [username,setUsername] = useState('');
    const [lastname,setLastname] = useState('');
    const [email,setEmail] = useState('');
    const [date,setDate]  = useState('');
    const [address,setAddress] = useState('');
    const [user,setUser] = useState({});
    const[formData,setFormData]=useState('');
    const [isGoogleUser,setIsGoogleUser] = useState('');
    const nav = useNavigate();
    useEffect(()=>{
        const u = localStorage.getItem('user');
        const t = localStorage.getItem('googleuser');
        console.log(t);
        setIsGoogleUser(t);
        const getUser = async()=>
        {
            const resp = await GetUserData(u);
            const userData = new User(
              resp.data.username,
              resp.data.name,
              resp.data.lastname,
              resp.data.email,
              resp.data.birthday,
              resp.data.address,
              resp.data.picture
            );
            setUser(userData);
            setName(userData.name);
            setUsername(userData.username);
            setAddress(userData.address);
            var birthday = userData.birthday.substring(0,10);
            setDate(birthday);
            setLastname(userData.lastname);
            setEmail(userData.email);
            var arr = userData.picture;
            const imageUrl = `data:image/png;base64,${arr}`;
            setImage(imageUrl);
        }
        getUser();

    },[])
    const renderErrorMessage = (name) =>
        name === errorMessages.name && (
            <div style={{ color: 'red', fontSize: '15px' }}>{errorMessages.message}</div>
        );

    function validate(event) {
        var valid = true;
        const username = event.target.username.value;
        const email = event.target.email.value;
        const name = event.target.name.value;
        const lastname = event.target.lastname.value;
        const date = event.target.date.value;
        const address = event.target.address.value;

        if (username.trim() === "") {
            setErrorMessages({ name: "username", message: "Username is required!" });
            valid = false;
        }
        if (email.trim() === "") {
            setErrorMessages({ name: "email", message: "Email is required!" });
            valid = false;
        }
        if (name.trim() === "") {
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
        return valid;


    }
    function handleSubmit(event) {
        event.preventDefault();
        setErrorMessages({ name: "username", message: "" })
        setErrorMessages({ name: "email", message: "" })
        setErrorMessages({ name: "name", message: "" })
        setErrorMessages({ name: "lastname", message: "" })
        setErrorMessages({ name: "date", message: "" })
        setErrorMessages({ name: "address", message: "" })
        if (validate(event)) {
            const formData = new FormData();
            formData.append('username', event.target.username.value);
            formData.append('name', event.target.name.value);
            formData.append('lastname', event.target.lastname.value);
            formData.append('birthday', event.target.date.value);
            formData.append('email', event.target.email.value);
            formData.append('address', event.target.address.value);
            formData.append('file', file);
            const resp = EditProfile(formData);
            if(resp===null)
            {
              console.log('error');

            }
            else {
            toast.success('succesful edit of profile!');
            nav('/home');
            }
        }
    }
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        let value = URL.createObjectURL(event.target.files[0]);
        setImage(value);
    };
    const handleNameChange = (event) => {
        setName(event.target.value);
    };
    const handleLastNameChange = (event) => {
        setLastname(event.target.value);
    };
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };
    const handleDateChange = (event) => {
        setDate(event.target.value);
    };
    const handleAddressChange = (event) => {
        setAddress(event.target.value);
    };
    return(
        <Form onSubmit={handleSubmit} id="form">
        <div className="d-flex justify-content-center align-items-center mt-2">
          <div className="d-flex flex-column border border-gray rounded p-3 w-400px m-200px bg-light">
            <div className="m-2">
              <Form.Label>Username</Form.Label>
              <Form.Control readOnly type="text" name="username" defaultValue={username} />
              {renderErrorMessage("username")}
            </div>
            <div className="m-2">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" defaultValue={name} onChange={handleNameChange} />
              {renderErrorMessage("name")}
            </div>
            <div className="m-2">
              <Form.Label>Lastname</Form.Label>
              <Form.Control type="text" name="lastname" defaultValue={lastname} onChange={handleLastNameChange} />
              {renderErrorMessage("lastname")}
            </div>
            <div className="m-2">
              <Form.Label>Email</Form.Label>
              {
              isGoogleUser==='false' &&
              <Form.Control type="email" name="email" defaultValue={email} onChange={handleEmailChange} />
              }
              {
              isGoogleUser==='true' &&
              <Form.Control type="email" name="email" defaultValue={email} onChange={handleEmailChange} disabled/>
              }
              {renderErrorMessage("email")}
            </div>
            <div className="m-2">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control type="date" name="date" defaultValue={date} onChange={handleDateChange} />
              {renderErrorMessage("date")}
            </div>
            <div className="m-2">
              <Form.Label>Address</Form.Label>
              <Form.Control type="text" name="address" defaultValue={address} onChange={handleAddressChange} />
              {renderErrorMessage("address")}
            </div>
            <div className="m-2">
              <img name="picture" src={image} width="50px" height="50px" alt="Profile" />
            </div>
            <div className="m-2">
              <Form.Label>Profile Picture</Form.Label>
              <Form.Control type="file" name="image" accept=".jpg,.jpeg,.png" onChange={handleFileChange} />
            </div>
            <div className="m-2">
              <Button variant="dark" type="submit" >Save</Button>
            </div>
          </div>
        </div>
      </Form>
    );
}
export default Profile;