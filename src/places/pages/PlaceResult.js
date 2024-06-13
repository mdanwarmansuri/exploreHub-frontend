import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useHttpClient } from "../../shared/hooks/http-hook";
import PlaceItem from "../components/PlaceItem";
import './PlaceResult.scss';

const PlaceResult = () => {
  const { placeId } = useParams();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [place, setPlace] = useState();

  console.log("Component mounted or updated");
  console.log("PlaceId:", placeId);

  useEffect(() => {
    console.log('useEffect triggered');
    const fetchPlace = async () => {
      console.log('Fetching place...');
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/places/${placeId}`
        );
        setPlace(responseData.place);
        console.log('Place fetched:', responseData.place);
      } catch (err) {
        console.log('Error fetching place:', err);
      }
    };
    fetchPlace();
  }, [sendRequest, placeId]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }


  return place ? (
    <div className="place-result">
    <PlaceItem className="place-item"
      key={place.id}
      id={place.id}
      image={place.image}
      title={place.title}
      description={place.description}
      address={place.address}
      creatorId={place.creator}
      coordinates={{ lat: place.lat, lng: place.lng }}
      creatorName={place.creatorName}
      connectionsCount={place.connectionsCount}
      userImage={place.userImage}
      hrs={place.hrs}
    />
    </div>
  ) : (
    <p>No place found</p>
  );
};

export default PlaceResult;
