
import Header from "../components/general/Header";
import { Outlet } from "react-router-dom";

function HomePage(){
    return (
    <>
        <Header/>
        <Outlet/>
    </>

    )
}
export default HomePage;