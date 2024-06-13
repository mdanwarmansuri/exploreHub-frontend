import { useState, useCallback, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../context/auth-context';

let logoutTimer;

export const useAuth = () => {
  const auth = useContext(AuthContext);
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState();
  const [image,setImage] = useState();

  const login = useCallback((uid, token,image, expirationDate) => {
    auth.setEmailVerified(false);
    setToken(token);
    setUserId(uid);
    setImage(image);
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        token: token,
        image:image,
        expiration: tokenExpirationDate.toISOString()
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    localStorage.clear();
    console.log("hi from logout");
    console.log("Before in logout", auth.emailVerified);
    auth.setEmailVerified(false);
    auth.setLoginMode(true);
    console.log("After in logout", auth.emailVerified);
   
  }, [auth]);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(storedData.userId, storedData.token,storedData.image, new Date(storedData.expiration));
    }
  }, [login]);

  return { token, login, logout, userId,image };
};
