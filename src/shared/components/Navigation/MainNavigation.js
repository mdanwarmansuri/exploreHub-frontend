import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { useHttpClient } from "../../hooks/http-hook";
import SearchBar from "../FormElements/SearchBar";
import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import Backdrop from "../UIElements/Backdrop";
import { UsersContext } from "../../context/users-context";
import "./MainNavigation.scss";
import { useLocation} from "react-router-dom";
import { PlacesContext } from "../../context/places-context";
import UserProfile from "./UserProfile";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { AuthContext } from "../../context/auth-context";


const MainNavigation = (props) => {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const auth = useContext(AuthContext);

  const usersContext = useContext(UsersContext);
  const placesContext = useContext(PlacesContext);

  const history= useHistory();

  const openDrawerHandler = () => {
    setDrawerIsOpen(true);
  };

  const closeDrawerHandler = () => {
    setDrawerIsOpen(false);
  };
  const location = useLocation();
  const path = location.pathname;

  const regex = /^\/\d+\/places$/;
  const isPlaces = regex.test(path);

  const searchHandler = async (searchTerm) => {
    usersContext.setIsLoading(true);
    try {
      console.log(searchTerm);
      if (!isPlaces) {
        const responseData = await sendRequest(
          `http://localhost:5000/api/users/search/${searchTerm}`
        );
        usersContext.setUsers(responseData.users);
        usersContext.setIsLoading(false);
        
        history.push('/usersSearchResult');
      }
      else{
        const postCreator = path.split("/")[1];
        const responseData = await sendRequest(
          `http://localhost:5000/api/places/search/${postCreator}/${searchTerm}`
        );
        usersContext.setIsLoading(false);
        placesContext.setPlaces(responseData.places);
        console.log(responseData.places);
      }
    } catch (err) {}
  };

  return (
    <React.Fragment>
      {drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}
      <SideDrawer show={drawerIsOpen} onClick={closeDrawerHandler}>
        <nav className="main-navigation__drawer-nav">
          <NavLinks />
        </nav>
      </SideDrawer>

      <MainHeader>
        <button
          className="main-navigation__menu-btn"
          onClick={openDrawerHandler}
        >
          <span />
          <span />
          <span />
        </button>
        <div className="main-navigation__title">
          <Link to="/"><div className="logo-container"><img src="./location.png" alt="" height="30" width="30"/> <h3>ExploreHub</h3></div></Link>
        </div>

       {auth.isLoggedIn && <SearchBar searchHandler={searchHandler} />}

        <nav className="main-navigation__header-nav">
          <NavLinks />
        </nav>
        <div className="user_profile_">
         {auth.isLoggedIn &&  <UserProfile/>}
        </div>
      </MainHeader>
    </React.Fragment>
  );
};

export default MainNavigation;
