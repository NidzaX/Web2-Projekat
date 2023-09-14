import './App.css';
import {Routes, Route} from 'react-router-dom'
import HomePage from './pages/HomePage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Profile from './components/general/Profile';
import Login from './components/general/Login';
import Register from './components/general/Register';
import PrivateRoute from './components/general/PrivateRoute';
import Verification from './components/admin/Verification';
import Unauthorized from './components/general/Unathorized';
import ChangePassword from './components/general/ChangePassword';
import AllProductsSeller from './components/seller/AllProductsSeller';
import AddProductSeller from './components/seller/AddProductSeller';
import EditProduct from './components/seller/EditProduct';
import NewOrder from './components/buyer/NewOrder';
import AllOrders from './components/admin/AllOrders';
import AllOrdersBuyer from './components/buyer/AllOrdersBuyer';
import AllOrdersSeller from './components/seller/AllOrdersSeller';
import GoogleRegister from './components/general/GoogleRegister';
import PrivateRouteA from './components/general/PrivateRouteA';


function App() {
  return (
    <div>
        <ToastContainer position='top-right' autoClose={3000}/>

        <Routes>
        <Route path='/unauthorized' element={<Unauthorized/>}/>
        <Route path='/' element={<PrivateRouteA><Login/></PrivateRouteA>}/> 
        <Route path='/login' element={<PrivateRouteA><Login/></PrivateRouteA>}/>
        <Route path='/register' element={<PrivateRouteA><Register/></PrivateRouteA>}/>
        
        <Route path='/googleregister' element= {<PrivateRouteA><GoogleRegister/></PrivateRouteA>}/>
        <Route path='/home' element={<PrivateRoute allowedRoles={['admin','seller','buyer']}><HomePage/></PrivateRoute>}>
            <Route path='profile' element={<Profile/>} />
            <Route path='changePassword' element={<ChangePassword/>}/>
            <Route path='verification' element={<PrivateRoute allowedRoles={['admin']}><Verification/></PrivateRoute>}/>
            <Route path='allproducts' element={<PrivateRoute allowedRoles={['seller']}><AllProductsSeller/></PrivateRoute>}/>
            <Route path='editproduct' element={<PrivateRoute allowedRoles={['seller']}><EditProduct/></PrivateRoute>}/>
            <Route path='addproduct' element={<PrivateRoute allowedRoles={['seller']}><AddProductSeller/></PrivateRoute>}/>
            <Route path='neworder' element={<PrivateRoute allowedRoles={['buyer']}><NewOrder/></PrivateRoute>}/>
            <Route path='allorders' element={<PrivateRoute allowedRoles={['admin']}><AllOrders/></PrivateRoute>}/>
            <Route path='allordersbuyer' element={<PrivateRoute allowedRoles={['buyer']}><AllOrdersBuyer/></PrivateRoute>}/>
            <Route path='allordersseller' element={<PrivateRoute allowedRoles={['seller']}><AllOrdersSeller/></PrivateRoute>}/>

          </Route>
      </Routes>

    </div>
  );
}

export default App;
