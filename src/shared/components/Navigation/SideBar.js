import React, { useContext } from "react";

import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import { AuthContext } from "../../context/auth-context";

import './SideBar.css';
import Auth from "../../../user/pages/Auth";

const SideBar = () => {
    const auth = useContext(AuthContext);

    return (
        <div className="side-bar">
            <NavLink to='/' className="side-bar-item"><img src="../home-button.png" alt="" /> Home</NavLink>
            <NavLink to='/connections' className="side-bar-item"> <img src="../friend.png" alt="" />Connections</NavLink>
            <NavLink to='/requests' className="side-bar-item"><img src="../add-user.png" alt="" /> Requests</NavLink>
            <NavLink to='/places/new' className="side-bar-item"><img src="../add-point.png" alt="" /> Add Place</NavLink>
            <NavLink to={`/${auth.userId}/places`} className="side-bar-item"><img src="../places.png" alt="" /> My Places</NavLink>
            <NavLink to={`/user/${auth.userId}`} className="side-bar-item"><img src="../user.png" alt="" /> Profile</NavLink>
        </div>
    );
}

export default SideBar;
