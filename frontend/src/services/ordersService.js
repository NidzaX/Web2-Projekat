import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const AddOrder = async (data) => {
    return await axios.post(`${process.env.REACT_APP_API_URL}/api/orders/addOrder`, data,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('encodedToken'))}`
        }
      }).then(function (response) {
          return response.data;
      })
      .catch(function (error) {
        if(error.response.data)
          toast.error(error.response.data)   
        else
          toast.error(error)
      });
  
  }
  export const GetAllOrders = async () => {
    return await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/getAllOrders`
      ,
      {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('encodedToken'))}`
        }
      }).then(function (response) {
  
        return response;
  
      })
      .catch(function (error) {
        if(error.response.data)
          toast.error(error.response.data)   
        else
          toast.error(error)
      });
  }
  export const GetAllOrdersBuyer = async (data) => {
    return await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/getAllOrdersBuyer`
      ,
      {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('encodedToken'))}`
        },
        params:
        {
          buyer: data
        }
      }).then(function (response) {
  
        return response;
  
      })
      .catch(function (error) {
        if(error.response.data)
          toast.error(error.response.data)   
        else
          toast.error(error)
      });
  }
  export const CancelOrder = async (orderId) => {
    return await axios.put(`${process.env.REACT_APP_API_URL}/api/orders/cancel/${orderId}`,[],
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('encodedToken'))}`
        }
      }).then(function (response) {
        return response;
  
      })
      .catch(function (error) {
        if(error.response.data)
          toast.error(error.response.data)   
        else
          toast.error(error)
      });
  }
  export const GetOrderDetails= async (orderId) => {
    return await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/getOrderDetailsAdmin/${orderId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('encodedToken'))}`
        }
      }).then(function (response) {

        return response;
  
      })
      .catch(function (error) {
        if(error.response.data)
          toast.error(error.response.data)   
        else
          toast.error(error)
      });
  }
  export const GetAllOrdersSeller= async (data) => {
    return await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/getAllOrdersSeller`
      ,
      {
        headers: {
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
      if(error.response.data)
        toast.error(error.response.data)   
      else
        toast.error(error)
      });
  }
  export const GetOrderDetailsSeller= async (orderId,seller) => {
    return await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/getOrderDetailsSeller/${orderId}/${seller}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('encodedToken'))}`
        }
      }).then(function (response) {

        return response;
  
      })
      .catch(function (error) {
        if(error.response.data)
          toast.error(error.response.data)   
        else
          toast.error(error)
      });
  }
  // export const GetOrderDetailsBuyer = async (orderId) => {
  //   return await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/getOrderDetailsBuyer/${orderId}`,
  //     {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${JSON.parse(localStorage.getItem('encodedToken'))}`
  //       }
  //     }).then(function (response) {

  //       return response;
  
  //     })
  //     .catch(function (error) {
  //       toast.error(error.data);
  //       return error;
  //     });
  // }
  