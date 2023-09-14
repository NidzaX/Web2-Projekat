import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { GetOrderDetailsSeller } from "../../services/ordersService";
import ProductSeller from "../model/ProductSeller";
function OrderPopupSeller(props) {
    const [orderProducts, setorderProducts] = useState([]);
    useEffect(() => {
        const getOrderProducts = async () => {
            const username = localStorage.getItem('user')
            const resp = await GetOrderDetailsSeller(props.order.id,username);
            if(!resp.data){
                toast.error('error');
            }
            const mappedProducts = resp.data.map(product => new ProductSeller(product));
            console.log(mappedProducts);
            setorderProducts(resp.data);

        }
        getOrderProducts();
        var a = 0;
        orderProducts.forEach(product => {
             a += product.price * product.orderQuantity;
         });
    }, []);
    function getDateTime(date) {
        const date1 = new Date(date);
        const options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };
        return date1.toLocaleString('en-GB', options);
    }
    function CompareDates(date1)
    {
        const Date1 = new Date(date1);
        const Date2 = new Date();
        if(Date1>Date2)
        {
            return true;
        }
        else 
        {
            return false;
        }
    }
    function ShowProduct(props)
    {
        const product = props.product;
        const imgUrl = `data:image/png;base64,${product.picture}`;
        return(
            <tr>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.quantity}</td>
                <td>{product.orderQuantity}</td>
                <td>{product.description}</td>
                <td><img width='40' height='40' src={imgUrl} alt="" /></td>
            </tr>
        );
    }
    return (
        <div
            style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "#fff",
                padding: "20px",
                borderRadius: "5px",
                boxShadow: "0px 0px 10px 1px rgba(0, 0, 0, 0.2)",
                zIndex: "999",
            }}
        >
            

            <h4>Order details</h4>
            <table className="table table-striped">
                <tbody>
                <tr>
                    <td><b>Buyer:</b></td><td>{props.order.buyerUsername}</td>
                </tr>
                <tr>
                    <td><b>Order time:</b></td><td>{getDateTime(props.order.timeOfOrder)}</td>
                </tr>
                <tr>
                    <td><b>Time for delivery:</b></td><td>{props.order.timeForDelivery}</td>
                </tr>
                <tr>
                    <td><b>Time of arrival:</b></td><td>{getDateTime(props.order.timeOfArrival)}</td>
                </tr>
                <tr>
                    <td><b>Address:</b></td><td>{props.order.address}</td>
                </tr>
                <tr>
                    <td><b>Comment:</b></td><td>{props.order.comment}</td>
                </tr>
                <tr>
                    <td><b>Total price:</b></td><td>{props.order.totalPrice}</td>
                </tr>
                <tr>
                    {
                        props.order.cancelled &&
                        <>
                            <td><b>Status:</b></td><td>Cancelled</td></>
                    }
                    {
                        !props.order.cancelled && CompareDates(props.order.timeOfArrival) &&
                        <>
                            <td><b>Status:</b></td><td>In progres</td></>
                    }
                    {
                        !props.order.cancelled && !CompareDates(props.order.timeOfArrival) &&
                        <>
                            <td><b>Status:</b></td><td>Delivered</td></>
                    }
                </tr>
                </tbody>
            </table>
            <h4>Products</h4>
            <table border={1} className="table striped-table centered-table2">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>In stock</th>
                        <th>Order Quantity</th>
                        <th>Description</th>
                        <th>Picture</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from(orderProducts).map(product => (
                        <ShowProduct product={product} key={product.id} />

                    ))}
                </tbody>
            </table>
            <button onClick={props.onClose} className="btn btn-dark mt-2">Close Details </button>

        </div>
    );
}

export default OrderPopupSeller;