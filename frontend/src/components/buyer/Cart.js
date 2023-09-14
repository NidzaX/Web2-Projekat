import { useEffect, useState } from "react";
import { AddOrder } from "../../services/ordersService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import '../../style.css';

function Cart({ items, onClearCart, onClose, removeItem }) {
    const nav = useNavigate();
    const [list, setList] = useState([])
    const [sum, setSum] = useState(0)
    const [quantityCheck, setQuantityCheck] = useState(true)
    useEffect(() => {
        setList(items);
        const total = items.reduce((accumulator, currentItem) => {
            return accumulator + currentItem.product.price * currentItem.orderQuantity;
        }, 0);
        setSum(total);
    }, [items]);
    function findIndex(itemId) {
        const index = list.findIndex(item => item.product.id === itemId);
        return index;
    }
    function updateSum(updatedList) {
        let total = 0;
        for (let i = 0; i < updatedList.length; i++) {
            const item = updatedList[i];
            total += item.product.price * item.orderQuantity;
        }
        setSum(total);
    }
    function handleQuantityChange(itemId, event) {
        const index = findIndex(itemId);
        const updatedList = [...list];
        const q = parseInt(event.target.value)
        if (q < 0 || q > list[index].product.quantity) {
            setQuantityCheck(false);
        }
        else setQuantityCheck(true);
        updatedList[index].orderQuantity = q;
        setList(updatedList);
        const total = updatedList.reduce((accumulator, currentItem) => {
            return accumulator + currentItem.product.price * currentItem.orderQuantity;
        }, 0);
        setSum(total);
    }
    function remove(itemId) {
        const updatedList = list.filter((item) => item.product.id !== itemId);
        setList(updatedList);
        updateSum(updatedList);
    }
    async function order(data) {
        const resp = await AddOrder(data);
        toast.success('Your order will be delivered in ' + resp + ' hours.');
        nav('../');
    }
    const countUniqueOwnerIds = (arr) => {
        const uniqueOwnerIds = new Set(arr.map(obj => obj.product.ownerId));
        console.log(uniqueOwnerIds);
        return uniqueOwnerIds.size;
      };
    function handleClick(event) {
        event.preventDefault();
        var dataList = [];
        list.forEach(element => {
            dataList.push({ "productId": element.product.id, "orderQuantity": element.orderQuantity });
        });
        var data = { "products": dataList, "comment": event.target.comment.value, "address": event.target.address.value,"totalPrice":sum + countUniqueOwnerIds(list)*300 ,"buyerUsername":localStorage.getItem("user") };
        order(data);
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
            <h4>Your Cart</h4>
            <button onClick={onClearCart} className="btn btn-outline-dark">Clear Cart</button>
            &nbsp;
            <button onClick={onClose} className="btn btn-dark">Close Cart</button>
            <form onSubmit={(event) => handleClick(event)}>
                <table className="table table-striped centered-table2">
                    <thead>
                        <tr>
                            <th>Picture</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    {list.map((item) => (
                        <tr key={item.product.id}>
                            <td><img width='40' height='40' src={`data:image/png;base64,${item.product.picture}`} alt="" /></td>
                        <td >
                            {item.product.name}</td> 
                        <td >

                         {item.product.price} </td> 
                        <td > <input type="number" max={item.product.quantity} defaultValue={item.orderQuantity} onChange={(event) => handleQuantityChange(item.product.id, event)} style={{ width: '75px' }}/> </td><td><button onClick={() => { remove(item.product.id); removeItem(item.product.id) }} className="btn btn-outline-dark">Remove</button></td> 
                        </tr>
                    ))}
</tbody>
                </table>
                <table className="table"> 
                    <tbody>
                    <tr><td><b>Sum:</b></td><td> {sum}</td></tr>
                    <tr><td><b>Delivery Costs:</b></td><td>{countUniqueOwnerIds(list) * 300}</td></tr>
                    <tr><td><b>Total: </b></td><td> {sum + countUniqueOwnerIds(list) * 300}</td></tr>
                    </tbody>
                </table>
                <br />

                    {sum > 0 && quantityCheck &&<>
                    <p><b>Address:&nbsp;&nbsp;&nbsp;&nbsp;</b><input type="text" name="address" /></p>
                    <p><b>Comment:&nbsp;</b><input type="text" name="comment" /></p>
                        <input type="submit" value={"Order"} className="btn btn-dark"/>
                        </>
                    }
                    {((sum<=0)|| !quantityCheck) &&
                        <p>Invalid quantity</p>
                    }

            </form>
        </div>
    );
}

export default Cart;