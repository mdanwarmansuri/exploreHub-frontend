import React, { useEffect, useContext, useState } from "react";


import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { ConnectionContext } from "../../shared/context/connection-context";
import { AuthContext } from "../../shared/context/auth-context";
import UserItem from "../components/UserItem";

import './Connections.scss';
// import

const Requests = () => {

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  
  const [loadedUsers,setLoadedUsers] = useState([]);


  const conContext = useContext(ConnectionContext);
  const auth = useContext(AuthContext);
  

  const storedData = JSON.parse(localStorage.getItem('userData'));
  
  useEffect(() => {
    console.log("inside use effect",auth.isLoggedIn);

    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/users/requests/${auth.userId}`
        );

        setLoadedUsers(responseData.users);

      } catch (err) {}
    };

      fetchUsers();
  }, [sendRequest]);



  return (

    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading   && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}

    {!isLoading && (
      <div className="connections-list">
        {loadedUsers.length>0 && loadedUsers.map(user => (
          <UserItem
          key={user.id}
          id={user.id}
          image={user.image}
          name={user.name}
          placeCount={user.placeCount}
          />
        ))}

        {loadedUsers.length==0 && <h3>No requests found</h3>}
      </div>
    )}
    </React.Fragment>
  );
};

export default Requests;
