import { useEffect, useState } from "react";
import { CancelOrder, GetAllOrdersBuyer } from "../../services/ordersService";
import OrderPopupBuyer from "./OrderPopupBuyer";
import { toast } from "react-toastify";
import OrderBuyer from "../model/OrderBuyer";
function AllOrdersBuyer() {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    function onClose() {
        setSelectedOrder(null);
    }
    function handleOrderClick(order) {
        setSelectedOrder(order);
    }
    useEffect(() => {
        const getOrders = async () => {
            const resp = await GetAllOrdersBuyer(localStorage.getItem('user'));
            const mappedOrders = resp.data.map((orderData) => new OrderBuyer(orderData));

            setOrders(mappedOrders);

        }
        getOrders();

    }, [])
    function CompareDates(date1) {
        const Date1 = new Date(date1);
        const Date2 = new Date();
        if (Date1 > Date2) {
            return true;
        }
        else {
            return false;
        }
    }
    function CompareDates2(date1) {
        const Date1 = new Date(new Date(date1).getTime() + + 60 * 60 * 1000);
        const Date2 = new Date();
        if (Date1 < Date2) {
            return true;
        }
        else {
            return false;
        }
    }
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

    async function handleClickCancel(orderId) {
        const resp = await CancelOrder(orderId);
        if (resp.data === true) {
            toast.success('Succesfull cancelation of order!');
            const updatedList = orders.filter((item) => item.id !== orderId);
            setOrders(updatedList);
        }
        else toast.error('There is some problem');
    }
    function getOrderStatus(order) {
        if (CompareDates(order.timeOfArrival) && CompareDates2(order.timeOfOrder)) {
            order.status = 'In progress';
            return <>
                <td>In progress</td>
                <td><button className="btn btn-dark" onClick={() => handleClickCancel(order.id)}>Cancel</button></td>
            </>;
        }
        else if (CompareDates(order.timeOfArrival) && !CompareDates2(order.timeOfOrder)) {
            order.status = 'In progress';
            return <>
                <td>In progress</td>
                <td ><button disabled className="btn btn-dark">Cancel</button></td>
            </>;
        }
        else if (!CompareDates(order.timeOfArrival)) {
            order.status = 'Delivered';
            return <>
                <td>Delivered</td>
                <td><button disabled className="btn btn-dark">Cancel</button></td>
            </>
        }
    }
    function ShowOrder(props) {
        const order = props.order;
        const [countdown, setCountdown] = useState(null);
      
        useEffect(() => {
          if (order.status === 'In progress') {
            const intervalId = setInterval(() => {
              const currentTime = new Date();
              const timeOfArrival = new Date(order.timeOfArrival);
              const remainingTime = Math.max(0, timeOfArrival - currentTime);
              setCountdown(remainingTime);
            }, 1000);
      
            return () => {
              clearInterval(intervalId);
            };
          }
        }, [order]);
      
        function formatTime(time) {
          const hours = Math.floor(time / 3600000);
          const minutes = Math.floor((time % 3600000) / 60000);
          const seconds = Math.floor((time % 60000) / 1000);
      
          return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
      
        return (
          <tr>
            <td>{getDateTime(order.timeOfOrder)}</td>
            <td>{order.timeForDelivery}</td>
            <td>{getDateTime(order.timeOfArrival)}</td>
            <td>{order.address}</td>
            <td>{order.comment}</td>
            <td>{order.totalPrice}</td>
            {getOrderStatus(order)}
            {order.status === 'In progress' && (
              <td>
                {countdown ? (
                  <span>{formatTime(countdown)}</span>
                ) : (
                  <span>Calculating...</span>
                )}
              </td>
            )}
            {order.status !== 'In progress' && <td></td>}
            <td>
              <button onClick={() => handleOrderClick(order)} className="btn btn-outline-dark">
                View Details
              </button>
            </td>
          </tr>
        );
    }
    return (
        <div>
            <div className="d-flex justify-content-center align-items-center mt-1">
            <table border={1} className="table mt-1 table-striped container centered-table2">
                <thead>
                    <tr>
                        <th >Time of order
                        </th>
                        <th >
                            Delivery time(hours)
                        </th>
                        <th >Time of arrival
                        </th>
                        <th>
                            Address
                        </th>
                        <th>
                            Comment
                        </th >
                        <th > Total price
                        </th>
                        <th>Status
                        </th>
                        <th>Actions</th>
                        <th>Countdown</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from(orders).map(order => (
                        <ShowOrder order={order} key={order.id} />
                    ))}
                </tbody>
            </table>
            </div>
            {selectedOrder && <OrderPopupBuyer order={selectedOrder} onClose={onClose} />}
        </div>
    );
}
export default AllOrdersBuyer;