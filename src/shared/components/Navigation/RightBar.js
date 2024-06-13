import React, { useEffect, useContext, useState } from "react";

import UsersList from "../../../user/components/UsersList";
import ErrorModal from "../UIElements/ErrorModal";
import LoadingSpinner from "../UIElements/LoadingSpinner";
import { useHttpClient } from "../../hooks/http-hook";
import { ConnectionContext } from "../../context/connection-context";
import { AuthContext } from "../../context/auth-context";
import { Link } from "react-router-dom";
import "./RightBar.scss";
import { event } from "jquery";
import SuggestionItem from "./SuggestionItem";

const RightBar = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [loadedUsers, setLoadedUsers] = useState([]);

  const conContext = useContext(ConnectionContext);
  const auth = useContext(AuthContext);

  const storedData = JSON.parse(localStorage.getItem("userData"));

  const [ids,setIds] = useState([]);

  useEffect(() => {
    console.log("inside use effect", auth.isLoggedIn);

    if(!auth.userId)
      return;

    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/users/suggestions/${auth.userId}`
        );

        setLoadedUsers(responseData.users);
      } catch (err) {}
    };

    fetchUsers();
  }, [sendRequest,auth.userId]);

  
  

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      <div className="right-bar">
        <p>Suggested for you</p>
        {loadedUsers.map((user) => (
          <SuggestionItem user={user}/>
        ))}
         <p className="footer">&copy; 2024 ExploreHub. All rights reserved.</p>
      </div>
    </React.Fragment>
  );
};

export default RightBar;
