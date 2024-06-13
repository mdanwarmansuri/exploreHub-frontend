import React, {useContext } from "react";

import UsersList from "../components/UsersList";

import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import { UsersContext } from "../../shared/context/users-context";
// import

const UsersSearchResult = () => {
  
  const usersContext = useContext(UsersContext);

  return (

    <React.Fragment>
      {usersContext.isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!usersContext.isLoading && usersContext.users && (
        <UsersList items={usersContext.users} />
      )}
    </React.Fragment>
  );
};

export default UsersSearchResult;
