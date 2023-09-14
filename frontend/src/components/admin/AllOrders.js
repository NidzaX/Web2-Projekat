import { useEffect, useState } from "react";
import { GetAllOrders } from "../../services/ordersService";
import OrderPopup from "./OrderPopup";
import Order from "../model/Order";

function AllOrders() {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
      const getOrders = async () => {
        const resp = await GetAllOrders();
        const orderObjects = resp.data.map(orderData => {
          return new Order(
            orderData.id,
            orderData.buyerUsername,
            orderData.timeOfOrder,
            orderData.timeForDelivery,
            orderData.timeOfArrival,
            orderData.address,
            orderData.comment,
            orderData.totalPrice,
            orderData.cancelled
          );
        });
        setOrders(orderObjects);
      };
      getOrders();
    }, []);

   

    function handleOrderClick(order) {
      setSelectedOrder(order);
    }

    function onClose() {
      setSelectedOrder(null);
    }

    function ShowOrder(props) {
      const order = props.order;
      return (
        <tr >
          <td>{order.buyerUsername}</td>
          <td>{order.getDateTime(order.timeOfOrder)}</td>
          <td>{order.timeForDelivery}</td>
          <td>{order.getDateTime(order.timeOfArrival)}</td>
          <td>{order.address}</td>
          <td>{order.comment}</td>
          <td>{order.totalPrice}</td>
          <td>{order.getOrderStatus()}</td>
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
        <div className="d-flex justify-content-center align-items-center container">
          <table className="table mt-1 table-striped container centered-table2" >
            <thead>
              <tr>
                <th >
                  Buyer
                </th>
                <th >Time of order
                        </th>
                        <th>
                            Delivery time(hours)
                        </th>
                        <th>Time of arrival
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
                        <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.from(orders).map(order => (
                <ShowOrder order={order} key={order.id + order.timeOfOrder} />
              ))}
            </tbody>
          </table>
        </div>
        {selectedOrder && <OrderPopup order={selectedOrder} onClose={onClose} />}
      </div>
    );
  }

  export default AllOrders;