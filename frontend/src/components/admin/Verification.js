import { useEffect, useState } from "react";
import { GetSellers, VerifySeller } from "../../services/userService";
import { toast } from "react-toastify";
import {  Button } from 'react-bootstrap';
import Seller from "../model/Seller";
function Verification() {
    const [sellers, setSellers] = useState([]);
    const [sortConfig, setSortConfig] = useState(null);

    useEffect(() => {
        const getSellers = async () => {
            const resp = await GetSellers();
            const sellerData = resp.data.map(seller => new Seller(seller));
            setSellers(sellerData);
          }
          getSellers();

    }, [])
    async function verifySeller(username, v) {
        const resp = await VerifySeller(username, v);
        if (resp.data === true) {
            toast.success('succesful verification!');
            const updatedSellers = Array.from(sellers).map(seller => {
                if (seller.username === username) {
                    return { ...seller, verified: v };
                }
                return seller;
            });
            setSellers(updatedSellers);
        }
        else {
            toast.error('error');
        }
    }
    function getDate(birthday) {
        const date1 = new Date(birthday);
        const year = date1.getFullYear();
        const month = date1.getMonth() + 1;
        const day = date1.getDate();
        return `${day}/${month}/${year}`;
    }
    function ShowSeller(props) {
        const seller = props.user;
        const imgUrl = `data:image/png;base64,${seller.picture}`;
        const formattedDate = getDate(seller.birthday);
    
        return (
          <tr key={seller.username}>
            <td>{seller.username}</td>
            <td>{seller.name}</td>
            <td>{seller.lastname}</td>
            <td>{seller.email}</td>
            <td>{formattedDate}</td>
            <td>{seller.address}</td>
            <td><img width='40' height='40' src={imgUrl} alt="" /></td>
            <ShowButtons verified={seller.verified} username={seller.username} />
          </tr>
        );
    }
    function ShowButtons(props) {
        const verified = props.verified;
        if (verified != null) {
            if (verified === true) {
                return <td><Button variant="outline-dark" disabled>Verified</Button></td>
            }
            else {
                return <td><Button variant="outline-dark" disabled>Dennied</Button></td>
            }
        }
        else {
            return (<>
                <td><Button variant="outline-dark" onClick={() => verifySeller(props.username, true)}>Verify</Button>
                    <Button variant="outline-dark" onClick={() => verifySeller(props.username, false)} className="mx-3">Denny</Button>
                    </td>
            </>);
        }
    }
    function handleThClick(column) {
        let direction = 'asc';
        if (sortConfig && sortConfig.column === column && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ column, direction });
    }
    return (
        <div className="d-flex justify-content-center align-items-center container">
            <table className="table mt-1 table-striped container centered-table2" >
                <thead>
                    <tr>
                        <th>
                            Username</th>
                        <th onClick={() => handleThClick('name')}>
                            Name</th>
                        <th onClick={() => handleThClick('lastname')}>
                            Lastname</th>
                        <th onClick={() => handleThClick('email')}>
                            Email</th>
                        <th onClick={() => handleThClick('birthday')}>
                            Birthday</th>
                        <th onClick={() => handleThClick('address')}>
                            Address</th>
                        <th>Picture</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from(sellers).map(seller => (
                        <ShowSeller user={seller} key={seller.username} />

                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Verification;