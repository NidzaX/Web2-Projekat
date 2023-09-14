import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const jwt = require('jsonwebtoken')

export const RegisterUser = async (data) => {
  return await axios.post(`${process.env.REACT_APP_API_URL}/api/users/register`, data,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
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

export const LoginUser = async (data, navigate, u) => {
  return await axios.post(`${process.env.REACT_APP_API_URL}/api/users/login`, data,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(function (response) {


      if (response.data) {
        const secretKey = process.env.REACT_APP_SECRET_KEY;
        const issuer = process.env.REACT_APP_ISSUER;

        try {

          const decodedToken = jwt.verify(response.data, secretKey, { issuer: issuer });


          const currentTime = Math.floor(Date.now / 100);
          if (decodedToken.exp && decodedToken.exp < currentTime) {
            throw new Error('Error: Expired token');
          }
          else {
            navigate("../home")
            localStorage.setItem('encodedToken', JSON.stringify(response.data));
            localStorage.setItem('token', JSON.stringify(decodedToken));
            localStorage.setItem('user', u);
            const t = 'false';
            localStorage.setItem('googleuser', t);
            return response;
          }
        }
        catch (err) {
          console.log(err);
          toast.error('Error:expired od invalid token');
          throw new Error('Error:expired od invalid token');
        }
      }
      else {
        toast.error('invalid data!');
        return response;
      }
    })
    .catch(function (error) {
      if (error.response.data)
        toast.error(error.response.data)
      else
        toast.error(error)
    });

}

export const GetUserData = async (data) => {
  return await axios.get(`${process.env.REACT_APP_API_URL}/api/users/getUserData`,
    {
      params:
      {
        username: data
      }
    })
}
export const EditProfile = async (data) => {
  return await axios.put(`${process.env.REACT_APP_API_URL}/api/users/updateProfile`, data).then(function (response) {
    return response;

  }).catch(function (error) {
    if (error.response.data)
      toast.error(error.response.data)
    else
      toast.error(error)
    return null;
  });
}

export const GetSellers = async () => {

  return await axios.get(`${process.env.REACT_APP_API_URL}/api/users/getSellers`
    ,
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

export const VerifySeller = async (username, v) => {

  return await axios.put(`${process.env.REACT_APP_API_URL}/api/users/verify/${username}/${v}`, [],
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

export const ChangeUserPassword = async (data) => {
  return await axios.put(`${process.env.REACT_APP_API_URL}/api/users/changePassword`, data,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
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
export const RegisterGoogle = async (data) => {
  return await axios.post(`${process.env.REACT_APP_API_URL}/api/users/registerGoogleUser`, data,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
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
export const LoginUserGoogle = async (data, navigate) => {
  return await axios.post(`${process.env.REACT_APP_API_URL}/api/users/loginGoogle`, data,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(function (response) {


      if (response.data) {
        const secretKey = process.env.REACT_APP_SECRET_KEY;
        const issuer = process.env.REACT_APP_ISSUER;

        try {

          const decodedToken = jwt.verify(response.data, secretKey, { issuer: issuer });


          const currentTime = Math.floor(Date.now / 100);
          if (decodedToken.exp && decodedToken.exp < currentTime) {
            throw new Error('Error: Expired token');
          }
          else {
            navigate("../home")
            localStorage.setItem('encodedToken', JSON.stringify(response.data));
            localStorage.setItem('token', JSON.stringify(decodedToken));
            localStorage.setItem('user', decodedToken.username);

            localStorage.setItem('googleuser', 'true');
            return response;
          }
        }
        catch (err) {
          console.log(err);
          toast.error('Error:expired od invalid token');
          throw new Error('Error:expired od invalid token');
        }
      }
      else {
        toast.error('invalid data!');
        return response;
      }
    })
    .catch(function (error) {
      if (error.response.data)
        toast.error(error.response.data)
      else
        toast.error(error)
    });

}
