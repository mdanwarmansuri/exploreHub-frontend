import React, { useState, useContext, useEffect } from "react";

import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import { ToastContainer, toast } from "react-toastify";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

import ReCAPTCHA from "react-google-recaptcha";

import "./Auth.scss";

const Auth = () => {
  const auth = useContext(AuthContext);

  console.log(auth.email);

  const history = useHistory();

  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const toastStyle = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  };

  // useEffect(() => {
  //   console.log("Auth.js - emailVerified:", auth.emailVerified);
  //   console.log("Auth.js - loginMode:", auth.loginMode);
  // }, [auth.emailVerified, auth.loginMode]);

  const emailVerified = auth.emailVerified;

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!auth.loginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        false
      );
    } else {
      if (!emailVerified) {
        setFormData(
          {
            ...formState.inputs,
            name: undefined,
            image: undefined,
            password: undefined,
          },
          formState.inputs.email.isValid
        );
      } else {
        setFormData(
          {
            ...formState.inputs,
            name: {
              value: "",
              isValid: false,
            },
            image: {
              value: null,
              isValid: false,
            },
          },
          false
        );
      }
    }
    // console.log(auth.loginMode);
    if (auth.loginMode) auth.setLoginMode(false);
    else auth.setLoginMode(true);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    if (!recaptchaToken) {
      toast.warning("Please complete the reCAPTCHA.", toastStyle);
      return;
    }

    if (auth.loginMode) {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
            recaptchaToken: recaptchaToken,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        console.log(responseData.image);
        console.log(responseData, "from login");
        auth.login(responseData.userId, responseData.token, responseData.image);

        history.push("/");
        toast.success("Logged in successfully!", toastStyle);
      } catch (err) {}
    } else {
      try {
        if (emailVerified) {
          const formData = new FormData();
          formData.append("email", formState.inputs.email.value);
          formData.append("name", formState.inputs.name.value);
          formData.append("password", formState.inputs.password.value);
          formData.append("image", formState.inputs.image.value);

          const responseData = await sendRequest(
            "http://localhost:5000/api/users/signup",
            "POST",
            formData
          );
          auth.login(
            responseData.userId,
            responseData.token,
            responseData.image
          );
          toast.success("Registered successfully!", toastStyle);
        } else {
          localStorage.setItem("email", formState.inputs.email.value);
          const responseData = await sendRequest(
            "http://localhost:5000/api/users/verifyEmail",
            "POST",
            JSON.stringify({
              email: formState.inputs.email.value,
            }),
            {
              "Content-Type": "application/json",
            }
          );
          toast.success(
            "Verification mail sent successfully, please check your mail",
            toastStyle
          );
        }
      } catch (err) {}
    }
  };

  return (
    <React.Fragment>
      { (auth.loginMode || !emailVerified) && <div className="container">
        <ErrorModal error={error} onClear={clearError} />
       
        <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
          <h2>{auth.loginMode ? "Login Required" : "Sign Up"}</h2>
          <hr />
          <form onSubmit={authSubmitHandler}>

            
              {<Input
                element="input"
                id="email"
                type="email"
                label="E-Mail"
                validators={[VALIDATOR_EMAIL()]}
                errorText="Please enter a valid email address."
                onInput={inputHandler}
              />}
            

            {auth.loginMode  && (
              <Input
                element="input"
                id="password"
                type="password"
                label="Password"
                validators={[VALIDATOR_MINLENGTH(6)]}
                errorText="Please enter a valid password, at least 6 characters."
                onInput={inputHandler}
              />
            )}
            <div>
              <ReCAPTCHA
                sitekey="6LfRkvQpAAAAAMGzZqR2ie3Q1HcH6MMWbi4MD7-J"
                onChange={(token) => setRecaptchaToken(token)}
              />
            </div>
            <div className="center">
              <Button
                type="submit"
                className="abc"
                disabled={!formState.isValid}
              >
                {auth.loginMode ? "LOGIN" : emailVerified ? "SIGNUP" : "VERIFY"}
              </Button>
            </div>
          </form>
          <div className="center">
            {auth.loginMode
              ? "Don't have an account?"
              : "Already have an account?"}
            <button
              className="switch-button"
              inverse
              onClick={switchModeHandler}
            >
              {auth.loginMode ? "Sign Up" : "Login"}
            </button>
          </div>
        </Card>
        {<div className="side-image"></div>}
      </div>}

      {/* //full sign up */}

      {emailVerified &&  !auth.loginMode && (
        <div className="signup-container">
          <ErrorModal error={error} onClear={clearError} />
          <Card className="signup-authentication">
            {isLoading && <LoadingSpinner asOverlay />}
            <h2>Sign Up</h2>
            <hr />
            <form onSubmit={authSubmitHandler}>
              <Input
                element="input"
                id="name"
                type="text"
                label="Your Name"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a name."
                onInput={inputHandler}
              />

              <ImageUpload
                center
                id="image"
                onInput={inputHandler}
                errorText="Please provide an image."
              />

              <Input
                element="input"
                id="email"
                type="email"
                label="E-Mail"
                initialValue={auth.email}
                initialValid={true}
                disabled={true}
                validators={[VALIDATOR_EMAIL()]}
                errorText="Please enter a valid email address."
                onInput={inputHandler}
              />

              <Input
                element="input"
                id="password"
                type="password"
                label="Password"
                validators={[VALIDATOR_MINLENGTH(6)]}
                errorText="Please enter a valid password, at least 6 characters."
                onInput={inputHandler}
              />

              <div className="recaptcha">
                <ReCAPTCHA
                  sitekey="6LfRkvQpAAAAAMGzZqR2ie3Q1HcH6MMWbi4MD7-J"
                  onChange={(token) => setRecaptchaToken(token)}
                />
              </div>
              <div className="center">
                <Button
                  type="submit"
                  className="abc"
                  disabled={!formState.isValid}
                >
                  SIGNUP
                </Button>
              </div>
            </form>
            <div className="center">
              Already have an account?
              <button
                className="switch-button"
                inverse
                onClick={switchModeHandler}
              >
                Login
              </button>
            </div>
          </Card>
        </div>
      )}
    </React.Fragment>
  );
};

export default Auth;
