// UserDropDown.js
import React from 'react';
import {NavLink, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import './UserDropDown.scss';

const UserDropDown = (props) => {
  const history = useHistory();

  const logOutHandler = (event) => {
    event.preventDefault();
    props.onOptionClick();
    props.onLogout();
    history.push('/auth');
    
  };

  return (
    <div className="user-dropdown">
      <NavLink to="/myProfile" onClick={props.onOptionClick}>Profile</NavLink>
      <NavLink to={`/${props.userId}/places`} onClick={props.onOptionClick}>Places</NavLink>
      {/* <hr /> */}
      <button onClick={logOutHandler}>Logout</button>
      {/* You can add more items here */}
    </div>
  );
};

export default UserDropDown;
