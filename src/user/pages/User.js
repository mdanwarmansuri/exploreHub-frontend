import React, { useState, useContext, useEffect } from "react";
import { Link, useHistory,useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

import { useHttpClient } from "../../shared/hooks/http-hook";
import Avatar from "../../shared/components/UIElements/Avatar";

import 'react-toastify/dist/ReactToastify.css';

import { AuthContext } from "../../shared/context/auth-context";

import { UsersContext } from "../../shared/context/users-context";

import './User.scss';
import PlaceList from "../../places/components/PlaceList";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";



const User = (props) => {

  const auth = useContext(AuthContext);
  const { userId } = useParams();
  console.log(userId);
  const usersContext = useContext(UsersContext);
  // const user=usersContext.users[0];
  const [user,setUser] = useState();

  // console.log(auth.isLoggedIn);

  const [connectClicked, setConnectClicked] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [loadedPlaces,setLoadedPlaces] = useState([]);

  // console.log(props);

  const [reqSent, setReqSent] = useState(false);
  const [friend, setFriend] = useState(false);
  const [reqRecv, setReqRecv] = useState(false);
  // console.log(conContext.friends);

  // console.log(user);
  
  useEffect(() => {
    // console.log("inside use effect in user item", auth.isLoggedIn);

    const fetchUsers = async () => {
      try {
        console.log('inside user profile');
        const responseData = await sendRequest(`http://localhost:5000/api/users/profile/${userId}/${auth.userId}`);
        setUser(responseData.user);

        console.log(responseData);
        
      } catch (err) {}
    };

    fetchUsers();
  }, [sendRequest, userId, auth.userId]);

  useEffect(() => {

    const fetchPlaces = async () => {
      if(!user)
        return;
      try {
        const responseData1 = await sendRequest(
          `http://localhost:5000/api/users/connRequest/${auth.userId}/to/${user.id}`
        );
        const responseData2 = await sendRequest(
          `http://localhost:5000/api/users/connRequest/${user.id}/to/${auth.userId}`
        );
        const responseData3 = await sendRequest(
          `http://localhost:5000/api/users/friends/${auth.userId}/${user.id}`
        );

        setReqSent(responseData1.data.length > 0);
        setReqRecv(responseData2.data.length > 0);
        setFriend(responseData3.data.length > 0);
        const responseData = await sendRequest(
          `http://localhost:5000/api/places/user/${userId}`
        );
        setLoadedPlaces(responseData.places);
      } catch (err) {}
    };

    fetchPlaces();
  }, [sendRequest, user]);

  const connectClickHandler = async (event) => {
    event.stopPropagation();
    event.preventDefault();
    try {
      if (reqSent) {
        await sendRequest(
          "http://localhost:5000/api/users/cancelRequest",
          "POST",
          JSON.stringify({ senderId: auth.userId, receiverId: user.id }),
          { "Content-Type": "application/json" }
        );
        setReqSent(false);
      } else if (reqRecv) {
        await sendRequest(
          "http://localhost:5000/api/users/acceptRequest",
          "POST",
          JSON.stringify({ senderId: user.id, receiverId: auth.userId }),
          { "Content-Type": "application/json" }
        );
        setReqRecv(false);
        setFriend(true);
      } else {
        await sendRequest(
          "http://localhost:5000/api/users/connRequest",
          "POST",
          JSON.stringify({ senderId: auth.userId, receiverId: user.id }),
          { "Content-Type": "application/json" }
        );
        setReqSent(true);
      }
      setConnectClicked(false);
    } catch (err) {}
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <React.Fragment>
      {isLoading && <LoadingSpinner asOverlay />}
      <div className="user-item">
        <div className="user-item__image">
          <Avatar image={`http://localhost:5000/${user.image}`} alt={user.name} />
        </div>
        <div className="user-item__info">
          <h2>{user.name}</h2>
          <h3>{user.placeCount} {user.placeCount === 1 ? "Place" : "Places"}</h3>
          <h4>0 mutual connections</h4>
        </div>
        {user.id!==auth.userId &&  <div className="connect-button">
          {friend && (
            <div>
              <img src={"../friends.png"} alt="" />
              <span>{"Friends"}</span>
            </div>
          )}
          {!friend && (
            <button onClick={connectClickHandler}>
              <img
                src={
                  !auth.isLoggedIn
                    ? "../add-friend.png"
                    : reqSent
                    ? "../cancel.png"
                    : reqRecv
                    ? "../accept.png"
                    : "../add-friend.png"
                }
                alt=""
              />
              <span>
                {!auth.isLoggedIn
                  ? "Connect"
                  : reqSent
                  ? "Cancel"
                  : reqRecv
                  ? "Accept"
                  : "Connect"}
              </span>
            </button>
          )}
        </div>}
      </div>
      <div className="posts">
        <h3 className="center">Posts by {user.name}</h3>
        {!isLoading && <PlaceList items={loadedPlaces} />}
      </div>
    </React.Fragment>
  );
};

export default User;