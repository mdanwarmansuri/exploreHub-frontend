import React, { useState, useContext, useEffect } from "react";

import { Link } from "react-router-dom";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import Map from "../../shared/components/UIElements/Map";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./PlaceItem.scss";

const PlaceItem = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [liked,setLiked] = useState(false);

  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  useEffect(() => {
    if (!auth.userId) return; // Only fetch data if userId is available

    if(liked)
      return;

    console.log("inside use effect", auth.userId);

    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/places/like/${auth.userId}/${props.id}`
        );

        if(responseData.data.length>0)
          setLiked(true);
      } catch (err) {
        // handle error if needed
      }
    };

    fetchUsers();
  }, [sendRequest, auth.userId,props.id]);

  const likeHandler = async() =>{
    try {
      if(!liked){
      const responseData = await sendRequest(
        "http://localhost:5000/api/places/like",
        "POST",
        JSON.stringify({
          postId:props.id,
          userId:auth.userId
        }),
        {
          "Content-Type": "application/json",
        }
      );
      setLiked(true);
    }
    else{
      const responseData = await sendRequest(
        "http://localhost:5000/api/places/unlike",
        "DELETE",
        JSON.stringify({
          postId:props.id,
          userId:auth.userId
        }),
        {
          "Content-Type": "application/json",
        }
      );
      setLiked(false);
    }
    
  }catch (err) {}
}

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `http://localhost:5000/api/places/${props.id}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      props.onDelete(props.id);
    } catch (err) {}
  };

  let hrs = props.hrs;
  let min = Math.floor(hrs * 60);
  hrs = Math.floor(hrs);
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16} />
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this place? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>
      <li className="place-item">
        <div className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          {/* <div className="place-item-image_map"> */}
          <Link to={`/user/${props.creatorId}`} className="creator-info">
            <div className="left">
              <img
                src={`http://localhost:5000/${props.userImage}`}
                alt="creator image"
              />
            </div>
            <div className="right">
              <span className="author-name">{props.creatorName}</span>
              <span>
                {props.connectionsCount}{" "}
                {props.connectionsCount > 1 ? "connections" : "connection"}
              </span>
              <span>
                <span className="time">
                  {min == 0
                    ? "now"
                    : min < 60
                    ? min > 1
                      ? `${min} mins`
                      : `${min} min`
                    : hrs < 24
                    ? hrs > 1
                      ? `${hrs} hrs`
                      : `${hrs} hr`
                    : Math.floor(hrs / 24) > 1
                    ? `${Math.floor(hrs / 24)} days`
                    : `${Math.floor(hrs / 24)} day`}
                </span>{" "}
                <span class="dot" />{" "}
                <img src="../public.png" alt="" height={20} width={20} />
              </span>
            </div>
          </Link>
          <p className="description">{props.description}</p>
          <div className="place-item__image">
            <img
              src={`http://localhost:5000/${props.image}`}
              alt={props.title}
            />
          </div>

          <div className="place-item__info">
            <h3>{props.title}</h3>
            <h4>{props.address}</h4>
          </div>
          <div className="place-item__actions">
            <button className="like" onClick={likeHandler}>
              <svg
                className="heart"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={liked ? 'red':'white'}
                stroke={liked ? 'red':'black'}
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill={liked ? 'red':'white'}
                />
              </svg>
            </button>

            <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button>
            {auth.userId === props.creatorId && (
              <Button to={`/places/${props.id}`}>EDIT</Button>
            )}

            {auth.userId === props.creatorId && (
              <Button danger onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            )}
          </div>
        </div>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
