import React, { useContext } from "react";
import "./SearchResultsDropdown.scss";
import User from "../../../user/pages/User";

import { useHistory,Link } from "react-router-dom/cjs/react-router-dom.min";
import { UsersContext } from "../../context/users-context";

const PlacesResultDropdown = (props) => {
  const usersContext = useContext(UsersContext);
  const history = useHistory();
  

  const handleClick = () => {
    props.closeSearchDropdown();
  };

  const seePlace = (event, id) => {
    event.preventDefault();
    // Here you can use the result data as needed
    props.setSearchTerm('');
    history.push(`/place/${id}`);
  };

  return (
    <React.Fragment>
      {props.results.length > 0 && (
        <div className="search-results-dropdown">
          <ul>
            {props.results.map((result, index) => (
              <li key={result.id} >
                <button onClick={(event) => seePlace(event,result.id)}>
                  <div className="result-info">
                    <img src={`http://localhost:5000/${result.placeImage}`} alt="" />
                    <span className="place-title">{result.title}</span>
                    <span className="extra-info">
                    <span class="dot" />
                    {result.address} <span class="dot" />{"-"}
                    {result.creator}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {props.results.length === 0 && (
        <div className="search-results-dropdown">
          <ul>
            <li>No results found.</li>
          </ul>
        </div>
      )}
    </React.Fragment>
  );
};

export default PlacesResultDropdown;
