import React, { useContext, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

import { AuthContext } from '../../context/auth-context';
import './NavLinks.scss';
import UserProfile from './UserProfile';


const NavLinks = (props) => {
  const auth = useContext(AuthContext);
  return (
    <ul className="nav-links">
      {/* {auth.isLoggedIn && <li>
        <NavLink to="/" exact>
          HOME
        </NavLink>
      </li>} */}
      {/* {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${auth.userId}/places`}>MY PLACES</NavLink>
        </li>
      )} */}
      {/* {auth.isLoggedIn && (
        <li>
          <NavLink to="/places/new">ADD PLACE</NavLink>
        </li>
      )} */}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/">LOGIN</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li className="nav-item-dropdown">
          <UserProfile/>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
