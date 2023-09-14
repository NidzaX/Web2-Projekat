import { useEffect, useState } from "react";
import { GetAllOrdersSeller } from "../../services/ordersService";
import OrderPopupSeller from "./OrderPopupSeller";
import OrderSeller from "../model/OrderSeller";
function AllOrdersSeller() {
    const [sortConfig, setSortConfig] = useState(null);
    const [orders, setOrders] = useState([])
    const [selectedOrder, setSelectedOrder] = useState(null)
    useEffect(() => {
        const getOrders = async () => {
            const resp = await GetAllOrdersSeller(localStorage.getItem('user'));
            const mappedOrders = resp.data.map(order => new OrderSeller(order));
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
    function onClose() {
        setSelectedOrder(null);
    }
    function handleOrderClick(order) {
        setSelectedOrder(order);
    }
    function handleThClick(column) {
        let direction = 'asc';
        if (sortConfig && sortConfig.column === column && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ column, direction });
    }
    function getOrderStatus(order) {
        if (order.cancelled) {
            order.status = 'Cancelled';
            return 'Cancelled';
        }
        else if (!order.cancelled && CompareDates(order.timeOfArrival)) {
            order.status = 'In progress';
            return 'In progress';
        }
        else if (!order.cancelled && !CompareDates(order.timeOfArrival)) {
            order.status = 'Delivered';
            return 'Delivered';
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
                <td>{order.buyerUsername}</td>
                <td>{getDateTime(order.timeOfOrder)}</td>
                <td>{order.timeForDelivery}</td>
                <td>{getDateTime(order.timeOfArrival)}</td>
                <td>{order.address}</td>
                <td>{order.comment}</td>
                <td>{order.totalPrice}</td>
                <td>{getOrderStatus(order)}</td>
                {order.status === 'In progress' && (
              <td>
                {countdown ? (
                  <span>{formatTime(countdown)}</span>
                ) : (
                  <span>Calculating...</span>
                )}
              </td>
            )}
            {order.status === 'Cancelled' && <td></td>}
             {order.status === 'Delivered' && <td></td>}
                <td><button onClick={() => handleOrderClick(order)} className="btn btn-outline-dark">View Details</button></td>

            </tr>
        );
    }
    return (
        <div className="d-flex justify-content-center align-items-center">
            <table border={1} className="table mt-1 table-striped container centered-table2">
                <thead>
                    <tr>
                        <th>
                            Buyer</th>
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
                        <th> Total price
                        </th>
                        <th>Status
                        </th>
                        <th>Countdown</th>
                        <th>Actions</th> 
                    </tr>
                </thead>
                <tbody>
                    {Array.from(orders).map(order => (
                        <ShowOrder order={order} key={order.id + order.timeOfOrder} />
                    ))}
                </tbody>
            </table>
            {selectedOrder && <OrderPopupSeller order={selectedOrder} onClose={onClose} />}

        </div>
    );
}
export default AllOrdersSeller;