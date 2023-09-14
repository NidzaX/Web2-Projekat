import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const AddProduct = async (data) => {
  return await axios.post(`${process.env.REACT_APP_API_URL}/api/products/addProduct`, data,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('encodedToken'))}`
      }
    }).then(function (response) {
      return response;

    })
    .catch(function (error) {
      // if (error.response.data)
      //   toast.error(error.response.data)
      // else
        //toast.error(error)
        //return null;
    });

}
export const GetProductsBySeller = async (data) => {
  return await axios.get(`${process.env.REACT_APP_API_URL}/api/products/getProductsBySeller`
    ,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('encodedToken'))}`
      },
      params:
      {
        seller: data
      }
    }).then(function (response) {

      return response;

    })
    .catch(function (error) {
      if (error.response.data)
        toast.error(error.response.data)
      else
        toast.error(error)
    });
}
export const EditProductSeller = async (data) => {
  return await axios.put(`${process.env.REACT_APP_API_URL}/api/products/editProduct`, data,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('encodedToken'))}`
      }
    }).then(function (response) {
      return response;

    })
    .catch(function (error) {
      if (error.response.data)
        toast.error(error.response.data)
      else
        toast.error(error)
      return null;
    });
}
export const DeleteProduct = async (data) => {
  const sendData = { id: data };
  console.log(sendData);
  return await axios.delete(`${process.env.REACT_APP_API_URL}/api/products/deleteProduct/${data}`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('encodedToken'))}`
      }
    }).then(function (response) {
      return response;

    })
    .catch(function (error) {
      if (error.response.data)
        toast.error(error.response.data)
      else
        toast.error(error)
    });
}
export const GetAllProducts = async (data) => {
  return await axios.get(`${process.env.REACT_APP_API_URL}/api/products/getAllProducts`
    ,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('encodedToken'))}`
      },
      params:
      {
        seller: data
      }
    }).then(function (response) {

      return response;

    })
    .catch(function (error) {
      if (error.response.data)
        toast.error(error.response.data)
      else
        toast.error(error)
    });
}