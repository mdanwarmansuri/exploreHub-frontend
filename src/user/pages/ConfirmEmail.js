import React, { useEffect, useState, useContext } from "react";

import { useParams } from "react-router-dom";

import { useHttpClient } from "../../shared/hooks/http-hook";

import { AuthContext } from "../../shared/context/auth-context";

import { useHistory } from "react-router-dom";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

function ConfirmEmail() {
  const { token } = useParams();

  const auth = useContext(AuthContext);

  const history = useHistory();

  console.log(token);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        console.log("sending request");
        const response = await sendRequest(
          `http://localhost:5000/api/users/confirm/${token}`
        );

        auth.setEmailVerified(true);
        console.log(response.email);
        auth.setEmail(response.email);
        const verified="true";
        localStorage.setItem("emailVerified",verified);
        console.log(localStorage.getItem('emailVerified'));
        auth.setLoginMode(false);

        history.push("/auth");
      } catch (error) {
        console.log(error);
      }
    };

    confirmEmail();
  }, [token]);

  return (
    <React.Fragment>
      {isLoading && <LoadingSpinner asOverlay />}
      <ErrorModal error={error} onClear={clearError} />
    </React.Fragment>
  );
}

export default ConfirmEmail;
