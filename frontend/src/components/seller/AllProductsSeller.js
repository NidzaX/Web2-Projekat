import { useEffect, useState } from "react";
import { DeleteProduct, GetProductsBySeller } from "../../services/productService";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import '../../style.css'
function AllProductsSeller()
{
    const nav = useNavigate();
    const [products,setProducts] = useState([]);
    async function deleteProduct(id)
    {
        const resp = await DeleteProduct(id);
        if(resp)
        {
            toast.success('successfull deleting!');
            const updatedList = products.filter((item) => item.id !== id);
            setProducts(updatedList);
        }
        else 
        {
            toast.error('error');
        }
    }
    function EditProduct(param)
    {
        nav('../editproduct',{state:param});
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
                <td>{product.description}</td>
                <td><img width='40' height='40' src={imgUrl} alt="" /></td>
                <td><button className="btn btn-outline-dark" onClick={() => EditProduct(product)}>Edit</button>&nbsp;
                <button className="btn btn-dark" onClick={() => deleteProduct(product.id)}>Delete</button></td>
            </tr>
        );
    }
    useEffect(()=>{
        const u = localStorage.getItem('user');
        const getProducts = async()=>
        {
            const resp = await GetProductsBySeller(u);
            setProducts(resp.data);

        }
        getProducts();
    },[]);

    return(
        <div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="container"> 
            <table className="table table-striped centered-table2">
                <thead>
                    <tr>
                    <th>
                            Name
                        </th>
                        <th>
                            Price
                            </th>
                            <th >
                            In stock
                        </th>
                        <th >
                            Description
                            </th>

                        <th>Picture</th>
                    <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                {Array.from(products).map(product => (
                        <ShowProduct product = {product} key={product.id}/>
                       
                ))}
                </tbody>
            </table>
            
        </div>
        <div className="container">
        <Link to='../addproduct'  className="link-dark" >Add product</Link>
        </div>
        </div>
    );
}
export default AllProductsSeller;