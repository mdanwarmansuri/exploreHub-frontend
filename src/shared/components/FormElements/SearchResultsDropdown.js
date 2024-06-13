import React,{useContext} from "react";
import './SearchResultsDropdown.scss';
import User from "../../../user/pages/User";

import { useHistory,Link } from "react-router-dom/cjs/react-router-dom.min";
import { UsersContext } from "../../context/users-context";

const SearchResultsDropdown = (props) => {
  const usersContext = useContext(UsersContext)
  const history = useHistory();
  const seeUser = (event, id) => {
    event.preventDefault();
    // Here you can use the result data as needed
    props.setSearchTerm('');

    history.push(`/user/${id}`);
  };

  return (
    <React.Fragment>
      {props.results.length > 0 && (
        <div className="search-results-dropdown">
          <ul>
            {props.results.map((result, index) => (
              <li key={result.id}>
                <button onClick={(event) => seeUser(event,result.id)}>
                  <div className="result-info">{result.name} <span class="dot"/> <span className="extra-info">{result.mutual} mutual connections</span>  <span class="dot"/><span  className="extra-info">{result.placeCount} {result.placeCount>1? 'places':'place'}</span></div> <img src={`http://localhost:5000/${result.image}`} alt="" />
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

export default SearchResultsDropdown;
