import React, { useEffect, useContext, useState } from "react";

import PlaceList from "../components/PlaceList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { ConnectionContext } from "../../shared/context/connection-context";
import { AuthContext } from "../../shared/context/auth-context";
import SideBar from "../../shared/components/Navigation/SideBar";
import RightBar from "../../shared/components/Navigation/RightBar";
import './Feed.scss';

const Feed = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlaces, setLoadedPlaces] = useState([]);
  const auth = useContext(AuthContext);

  // const [userLoading,setUserLoading]= useState(true);

  useEffect(() => {
    if (!auth.userId) return; // Only fetch data if userId is available

    console.log("inside use effect", auth.userId);

    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/places/feed/${auth.userId}`
        );

        setLoadedPlaces(responseData.places);
      } catch (err) {
        // handle error if needed
      }
    };

    fetchUsers();
  }, [sendRequest, auth.userId]); // Add auth.userId as a dependency

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      
        
      <div className="places">
        {!isLoading && <PlaceList items={loadedPlaces} />}
      </div>
    </React.Fragment>
  );
};

export default Feed;
