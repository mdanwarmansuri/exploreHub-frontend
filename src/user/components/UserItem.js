import React, { useState, useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

import { useHttpClient } from "../../shared/hooks/http-hook";
import Avatar from "../../shared/components/UIElements/Avatar";
import Card from "../../shared/components/UIElements/Card";
import 'react-toastify/dist/ReactToastify.css';

import { ConnectionContext } from "../../shared/context/connection-context";

import { AuthContext } from "../../shared/context/auth-context";
// import "./UserItem.scss";

const UserItem = (props) => {
  const history = useHistory();

  const conContext = useContext(ConnectionContext);

  const auth = useContext(AuthContext);

  // console.log(auth.isLoggedIn);

  const [connectClicked, setConnectClicked] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  // console.log(props);

  const [reqSent, setReqSent] = useState(false);
  const [friend, setFriend] = useState(false);
  const [reqRecv, setReqRecv] = useState(false);
  // console.log(conContext.friends);

  useEffect(() => {
    console.log("inside use effect in user item", auth.isLoggedIn);

    const fetchUsers = async () => {
      try {
        const responseData1 = await sendRequest(
          `http://localhost:5000/api/users/connRequest/${auth.userId}/to/${props.id}`
        );
        const responseData2 = await sendRequest(
          `http://localhost:5000/api/users/connRequest/${props.id}/to/${auth.userId}`
        );

        const responseData3 = await sendRequest(
          `http://localhost:5000/api/users/friends/${auth.userId}/${props.id}`
        );
        setReqSent(responseData1.data.length > 0);
        setReqRecv(responseData2.data.length > 0);
        setFriend(responseData3.data.length > 0);
      } catch (err) {}
    };

    if (auth.isLoggedIn) fetchUsers();
  }, [sendRequest]);

  // console.log(props.id,reqSent);

  const connectClickHandler = async (event) => {
    if (!auth.isLoggedIn) {
      
      history.push("/auth");
      toast.error('Please login or register first!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored"
        });
    }
    event.stopPropagation();
    event.preventDefault();
    try {
      if (reqSent) {
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/cancelRequest",
          "POST",
          JSON.stringify({
            senderId: auth.userId,
            receiverId: props.id,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        setReqSent(false);
      }
      else if(reqRecv){
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/acceptRequest",
          "POST",
          JSON.stringify({
            senderId: props.id,
            receiverId: auth.userId,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        setReqRecv(false);
        setFriend(true);
      }
      else{
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/connRequest",
          "POST",
          JSON.stringify({
            senderId: auth.userId,
            receiverId: props.id,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        setReqSent(true);
      }
      
      setConnectClicked(false);
    } catch (err) {}
  };

  return (
    // <div className="user-item">
    <Link to={`/user/${props.id}`} className="u-item">
      <div className="user-item__image">
        <Avatar
          image={`http://localhost:5000/${props.image}`}
          alt={props.name}
        />
      </div>
      <div className="user-item__info">
        <h2>{props.name}</h2>
        <h3>
          {props.placeCount} {props.placeCount === 1 ? "Place" : "Places"}
        </h3>
        <h4>0 mutual connections</h4>
      </div>
      <div className="connect-button">
        {friend && (
          <div>
            <img src={"./friends.png"} alt="" />
            <span>{"Friends"}</span>
          </div>
        )}
        {!friend && (
          <button onClick={connectClickHandler}>
            <img
              src={
                !auth.isLoggedIn
                  ? "./add-friend.png"
                  : reqSent
                  ? "./cancel.png"
                  : reqRecv
                  ? "./accept.png"
                  : "./add-friend.png"
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
      </div>
    </Link>
    // </div>
  );
};

export default UserItem;
