import React, { useState } from "react";

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import Users from "./user/pages/Users";
import Feed from "./places/pages/Feed";
import NewPlace from "./places/pages/NewPlace";
import UserPlaces from "./places/pages/UserPlaces";
import UpdatePlace from "./places/pages/UpdatePlace";
import UsersSearchResult from "./user/pages/UsersSearchResult";
import Auth from "./user/pages/Auth";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import { AuthContext } from "./shared/context/auth-context";
import { UsersContext } from "./shared/context/users-context";
import { useAuth } from "./shared/hooks/auth-hook";
import { PlacesContext } from "./shared/context/places-context";
import { ConnectionContext } from "./shared/context/connection-context";
import Connections from "./user/pages/Connections";
import Requests from "./user/pages/Requests";
import ConfirmEmail from "./user/pages/ConfirmEmail";
import "react-toastify/dist/ReactToastify.css";
import User from "./user/pages/User";
import PlaceResult from "./places/pages/PlaceResult";
import SideBar from "./shared/components/Navigation/SideBar";
import RightBar from "./shared/components/Navigation/RightBar";
import './App.scss';

const App = () => {
  const [users, setUsers] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [places, setPlaces] = useState();
  const [emailVerified, setEmailVerified] = useState(false);
  const [email,setEmail] = useState('');
  const [loginMode, setLoginMode] = useState(true);

  const [friends, setFriends] = useState([]);
  const [requestsSent, setRequestsSent] = useState([]);
  const [requestsReceived, setRequestsReceived] = useState([]);

  const { token, login, logout, userId,image } = useAuth();

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Feed />
        </Route>
        <Route path="/user/:userId" exact>
          <User/>
        </Route>
        <Route path="/connections" exact>
          <Connections/>
        </Route>
        <Route path="/requests" exact>
          <Requests/>
        </Route>
        <Route path="/usersSearchResult" exact>
          <UsersSearchResult />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        <Route path="/place/:placeId" exact>
          <PlaceResult/>
        </Route>
        <Route path="/places/:placeId">
          <UpdatePlace />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Auth />
        </Route>
        <Route path="/usersSearchResult" exact>
          <UsersSearchResult />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/confirm/:token" exact>
          <ConfirmEmail />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  }

  return (
    <React.Fragment>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Same as */}
      <ToastContainer />
      <AuthContext.Provider
        value={{
          isLoggedIn: !!token,
          token: token,
          userId: userId,
          login: login,
          logout: logout,
          loginMode: loginMode,
          setLoginMode: setLoginMode,
          emailVerified: emailVerified,
          setEmailVerified: setEmailVerified,
          email:email,
          setEmail:setEmail,
          image: image
        }}
      >
        <UsersContext.Provider
          value={{
            users: users,
            setUsers: setUsers,
            isLoading: isLoading,
            setIsLoading: setIsLoading,
          }}
        >
          <PlacesContext.Provider
            value={{
              places: places,
              setPlaces: setPlaces,
              isLoading: isLoading,
              setIsLoading: setIsLoading,
            }}
          >
            <ConnectionContext.Provider
              value={{
                friends: friends,
                setFriends: setFriends,
                requestsSent: requestsSent,
                setRequestsSent: setRequestsSent,
                requestsReceived: requestsReceived,
                setRequestsReceived: setRequestsReceived,
              }}
            >
              <Router>
                <MainNavigation />
                <main>
                  {token && <div className="sidebar">
                    <SideBar/>
                  </div>}
                  <div className="routes">
                  {routes}
                  </div>
                 {token &&  <div className="rightbar">
                    <RightBar/>
                  </div>}
                  </main>
              </Router>
            </ConnectionContext.Provider>
          </PlacesContext.Provider>
        </UsersContext.Provider>
      </AuthContext.Provider>
    </React.Fragment>
  );
};

export default App;
