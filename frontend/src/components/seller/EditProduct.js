import { useLocation } from "react-router-dom";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { EditProductSeller } from "../../services/productService";
import { Form, Button } from 'react-bootstrap';

function EditProduct(props)
{
    const [name,setName] = useState('');
    const [price,setPrice] = useState('');
    const [quantity,setQuantity] = useState('');
    const [description,setDescription] = useState('');
    


    const location = useLocation();
    const product = location.state;
    const [errorMessages, setErrorMessages] = useState({});
    const [file, setFile] = useState(null);
    const [image, setImage] = useState(null);
    const nav = useNavigate();
    useEffect(()=>{
        setName(product.name);
        setPrice(product.price);
        setQuantity(product.quantity);
        setDescription(product.description);
        const imageUrl = `data:image/png;base64,${product.picture}`;
        setImage(imageUrl);

    },[]);
    const renderErrorMessage = (name) =>
    name === errorMessages.name && (
        <div style={{ color: 'red', fontSize: '15px' }}>{errorMessages.message}</div>
    );
    function validate(event) {
        var valid = true;
        const name = event.target.name.value;
        const quantity = event.target.quantity.value;
        const price = event.target.price.value;
        const description = event.target.description.value;


        if (name.trim() === "") {
            setErrorMessages({ name: "name", message: "Name is required!" });
            valid = false;
        }
        if (quantity<=0) {
            setErrorMessages({ name: "quantity", message: "Quantity is invalid!" });
            valid = false;
        }
        if (price<=0) {
            setErrorMessages({ name: "price", message: "price is required!" });
            valid = false;
        }
        if (description.trim() === "") {
            setErrorMessages({ name: "description", message: "description is required!" });
            valid = false;
        }
        return valid;


    }
    const edit = async(data) =>
    {
        const r = await EditProductSeller(data);
        if(r)
        {
            toast.success('editing product was succesfull!');
            nav('../allproducts');
        }
        else 
        {
            toast.error('ERROR!');
        }
    }
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        let value = URL.createObjectURL(event.target.files[0]);
        setImage(value);
    };
    function handleSubmit(event) {
        event.preventDefault();

        setErrorMessages({ name: "name", message: "" })
        setErrorMessages({ name: "price", message: "" })
        setErrorMessages({ name: "quantity", message: "" })
        setErrorMessages({ name: "description", message: "" })
        setErrorMessages({ name: "picture", message: "" });
        if (validate(event)) {
            const formData = new FormData();
            formData.append('id',product.id);
            formData.append('name', event.target.name.value);
            formData.append('price', event.target.price.value);
            formData.append('quantity', event.target.quantity.value);
            formData.append('description', event.target.description.value);
            formData.append('file', file);
            edit(formData);
        }
    }
    return(
        <Form onSubmit={handleSubmit}>
        <div className="d-flex justify-content-center align-items-center">
          <div className="d-flex flex-column border border-gray rounded p-3 w-400px m-200px bg-light">
            <div className="m-2">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" defaultValue={name} />
              {renderErrorMessage("name")}
            </div>
            <div className="m-2">
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" name="price" defaultValue={price} />
              {renderErrorMessage("price")}
            </div>
            <div className="m-2">
              <Form.Label>Quantity</Form.Label>
              <Form.Control type="number" name="quantity" defaultValue={quantity} />
              {renderErrorMessage("quantity")}
            </div>
            <div className="m-2">
              <Form.Label>Description</Form.Label>
              <Form.Control type="text" name="description" defaultValue={description} />
              {renderErrorMessage("description")}
            </div>
            <div className="m-2">
              <img name="picture" src={image} width="50px" height="50px" alt="Product" />
            </div>
            <div className="m-2">
              <Form.Label>Product Picture</Form.Label>
              <Form.Control type="file" name="image" accept=".jpg,.jpeg,.png" onChange={handleFileChange} />
              {renderErrorMessage("picture")}
            </div>
            <div className="m-2">
              <Button variant="outline-dark" type="submit">Edit Product</Button>
            </div>
          </div>
        </div>
      </Form>
    );
}
export default EditProduct;