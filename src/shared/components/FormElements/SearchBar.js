import React, { useContext, useState, useEffect } from "react";
import { UsersContext } from "../../context/users-context";
import "./SearchBar.scss";
import { useHttpClient } from "../../hooks/http-hook";
import { debounce } from "../../util/debounce";
import SearchResultsDropdown from "./SearchResultsDropdown";
import PlacesResultDropdown from "./PlacesResultDropdown";
import { AuthContext } from "../../context/auth-context";

const SearchBar = (props) => {
  const usersContext = useContext(UsersContext);
  const auth = useContext(AuthContext);
  const { sendRequest } = useHttpClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [openSearchDropdown, setOpenSearchDropdown] = useState(false);

  const [peopleSearch, setPeopleSearch] = useState(true);

  const closeSearchDropdown = () => {
    setOpenSearchDropdown(false);
  };

  const fetchSearchResults = async (query) => {
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }
    console.log(peopleSearch);
    setOpenSearchDropdown(true);
    if (peopleSearch) {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/users/search/${auth.userId}/${query}`
        );
        setSearchResults(responseData.users);
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log('inside places search');
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/places/search/${query}`
        );
        setSearchResults(responseData.places);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const debouncedFetchSearchResults = debounce(fetchSearchResults, 300);

  useEffect(() => {
    debouncedFetchSearchResults(searchTerm);
  }, [searchTerm]);

  const inputHandler = (event) => {
    event.preventDefault();
    setSearchTerm(event.target.value);
  };

  const selectHandler = (event) => {
    event.preventDefault();
    if(event.target.value ==='people'){
      setPeopleSearch(true);
    }
    else{
      setPeopleSearch(false);
    }
    setSearchTerm('');
  };

  return (
    <div className="search">
      <select name="searchBy" id="searchBy" onChange={selectHandler}>
        <option value='people'>People</option>
        <option value='places'>Places</option>
      </select>
      <div className="search-bar">
        <div className="search-form">
          <input
            className="search-input"
            type="text"
            id="searchTerm"
            placeholder="Search..."
            value={searchTerm}
            onInput={inputHandler}
            autoComplete="off"
          />
          <button type="button" className="btn btn-primary" disabled>
            <img
              src="https://img.icons8.com/ios-filled/50/000000/search.png"
              alt="Search Icon"
            />
          </button>
        </div>
        {searchTerm && peopleSearch && (
          <SearchResultsDropdown
            results={searchResults}
            setSearchTerm={setSearchTerm}
          />
        )}

        {searchTerm && !peopleSearch && (
          <PlacesResultDropdown
            results={searchResults}
            setSearchTerm={setSearchTerm}
            closeSearchDropdown={closeSearchDropdown}
          />
        )}
      </div>
    </div>
  );
};

export default SearchBar;
