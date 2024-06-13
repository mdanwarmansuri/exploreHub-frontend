import React,{useContext,useState} from "react";
import { AuthContext } from "../../context/auth-context";
import { useHistory } from "react-router-dom";
import UserDropDown from "./UserDropDown";

import './UserProfile.scss'

const UserProfile = () => {
  const auth = useContext(AuthContext);

  console.log(auth.image);
  const history = useHistory();
  const [showDropDown, setShowDropDown] = useState(false);

  const toggleDropDown = () => {
    setShowDropDown((prevShowDropDown) => !prevShowDropDown);
  };

  const logOutHandler = () => {
    auth.logout();
    
  };

  const imageUrl = `http://localhost:5000/${auth.image}`;
  return (
    <div className="user-profile">
      <img
        src={imageUrl}
        alt="My Profile"
        height={30}
        width={30}
        onClick={toggleDropDown}
      />
      {showDropDown && (
        <UserDropDown
          userId={auth.userId}
          onLogout={logOutHandler}
          onOptionClick={toggleDropDown}
        />
      )}
    </div>
  );
};

export default UserProfile;
