import '../../style.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { GetUserRole } from '../../services/userService';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
function Header() {
    const nav = useNavigate();
    const [userRole, setUserRole] = useState(null);
    const [verified, setVerified] = useState(null);
    const [isGoogleUser,setIsGoogleUser] = useState('');

    const location = useLocation();
    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('encodedtoken');
        localStorage.removeItem('googleuser');
        setUserRole('');
        nav('/');
    }
    useEffect(() => {
        setUserRole('');
        const t = localStorage.getItem('googleuser');
        console.log(t);
        setIsGoogleUser(t);
        var token = localStorage.getItem('token');
        if (token) {
            const w = JSON.parse(token);
            const r = w['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            if (r == 'seller') {
                setVerified(w.verified.toLowerCase());
            }
            setUserRole(r);
        }

    }, [])
    return (
        <div style={{ backgroundColor: '#0074D9' }}>
            <Nav style={{ borderBottom: '3px solid #b0b0b0' }} >

                {userRole === 'admin' && (
                    <Nav.Item>

                        <Link to='verification' className={`nav-link  ${location.pathname === '/home/verification' ? 'bg-light link-dark' : 'link-light'}`}>
                            Verifications
                        </Link>
                    </Nav.Item>

                )}

                {userRole === 'buyer' && (
                    <Nav.Item>
                        <Link to='neworder' className={`nav-link  ${location.pathname === '/home/neworder' ? 'bg-light link-dark' : 'link-light'}`}>
                            New order
                        </Link>
                    </Nav.Item>

                )}
                {userRole === 'admin' && (
                    <Nav.Item>

                        <Link to='allorders' className={` nav-link  ${location.pathname === '/home/allorders' ? 'bg-light link-dark' : 'link-light'}`}>
                            Orders
                        </Link>
                    </Nav.Item>

                )}
                {userRole === 'buyer' && (
                    <Nav.Item>

                        <Link to='allordersbuyer' className={`nav-link  ${location.pathname === '/home/allordersbuyer' ? 'bg-light link-dark' : 'link-light'}`}>
                            Previous orders
                        </Link>
                    </Nav.Item>

                )}

                {userRole === 'seller' && verified === 'false' && (
                    <Nav.Item className='ms-auto'>
                        <Link className="nav-link disable-link" style={{ color: 'red' }}>Account not verified!</Link>
                    </Nav.Item>

                )}
                {userRole === 'seller' && verified === 'true' && (
                    <Nav.Item>

                        <Link to='allordersseller' className={`nav-link  ${location.pathname === '/home/allordersseller' ? 'bg-light link-dark' : 'link-light'}`}>
                            Orders
                        </Link>
                    </Nav.Item>

                )}
                {userRole === 'seller' && verified === '' && (
                    <Nav.Item className='ms-auto'>
                        <Link className="nav-link disable-link" style={{ color: 'yellow' }}>Verification pending!</Link>
                    </Nav.Item>
                )}
                {userRole === 'seller' && verified === 'true' && (
                    <>
                        <Nav.Item>
                            <Link to='allproducts' className={`nav-link  ${location.pathname === '/home/allproducts' ? 'bg-light link-dark' : 'link-light'}`}>Add product</Link>
                        </Nav.Item>
                        <Nav.Item className='ms-auto'>
                            <Link className="nav-link disable-link" style={{ color: 'green' }}>Account verified!</Link>
                        </Nav.Item>
                    </>
                )}
                {userRole && (
                    <Nav.Item className={`${userRole === 'seller' ? '' : 'ms-auto'}`}>
                        <Link to='profile' className={`nav-link  ${location.pathname === '/home/profile' ? 'bg-light link-dark' : 'link-light'}`}>
                            Edit profile
                        </Link>
                    </Nav.Item>
                )}
                {userRole && isGoogleUser==='false' && (
                    <Nav.Item>
                        <Link to='changePassword' className={`nav-link  ${location.pathname === '/home/changePassword' ? 'bg-light link-dark' : 'link-light'}`}>
                            Change password
                        </Link>
                    </Nav.Item>

                )}
                {userRole && (
                    <Nav.Item >
                        <Button variant="outline-dark" onClick={logout} className='btn btn-link link-light text-decoration-none'>
                            Log out
                        </Button>
                    </Nav.Item>

                )}
            </Nav>
        </div>
    )
}
export default Header;