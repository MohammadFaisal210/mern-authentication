import React from "react"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import axios from "axios";
export default function Header() {
    const auth = useSelector(state => state.auth)
    const { isLogged, user } = auth;

    const handleLoggedout=async()=>{
        try {
           await axios.get("/user/logout") 
           localStorage.removeItem("firstLogin")
           window.location.href = "/"
        } catch (err) {
            window.location.href = "/"
        }
    }
    const userLink = () => {
        return <li className="drop-nav">
            <Link to="#" className="avatar">
                <img src={user.avatar} alt="" /> {user.name} <i className="fa-solid fa-angle-down"></i>
            </Link>
            <ul className="dropdown">
                <li><Link to="/profile">Profile</Link></li>
                <li><Link onClick={handleLoggedout} to="/">Logout</Link></li>
            </ul>
        </li>
    }

    const transForm = {
        transform: isLogged ? "translateY(-5px)" : 0
    }
    return (
        <>
            <header>
                <div className="logo">
                    <h1><Link to="/">Dream shop</Link></h1>
                </div>

                <ul style={transForm}>
                    <li><Link to="/" ><i className="fa-solid fa-cart-plus"></i>Cart</Link></li>
                    {
                        isLogged ? userLink()
                            : <li><Link to="/login" ><i className="fa-solid fa-user"></i>Sign in</Link></li>
                    }
                </ul>
            </header>
        </>
    )
}