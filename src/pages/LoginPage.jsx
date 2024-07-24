import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

import PasswordDialog from "../components/PasswordDialog";
import Logo from "../assets/Image/com4in-logo-b.svg";
import Itsm from "../assets/Image/itsm.png";
import Loading from "../components/Loading";

//css
import "../assets/styles/LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });
  const [userDto, setUserDto] = useState({});
  const [openModal, SetOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function inputHandler(e) {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  }

  const keyDown = (e) => {
    if (e.key === "Enter") loginHandler();
  };

  async function loginHandler() {
    setIsLoading(true);
    const result = await api.login(userInfo);
    if (result) {
      if (result.data.resultCode === "310") {
        setUserDto(result.data.detail);
        SetOpenModal(true);
      } else if (result.data.resultCode === "320") {
        alert(result.data.message);
      } else {
        sessionStorage.setItem("token", result.data.detail.token);
        sessionStorage.setItem("refreshToken", result.data.detail.refreshToken);
        sessionStorage.setItem("userEmail", userInfo.email);
        sessionStorage.setItem("expirationTime", result.data.detail.expirationTime);
        sessionStorage.setItem(
          "company_account",
          result.data.detail.userInfo.company_account
        );
        sessionStorage.setItem(
          "company_name",
          result.data.detail.userInfo.company_name
        );
        sessionStorage.setItem("userName", result.data.detail.userInfo.name);
        sessionStorage.setItem(
          "comforin_manager",
          result.data.detail.userInfo.comforin_manager
        );
        if (sessionStorage.company_account === "com4in") {
          navigate("/com4in/main");
        } else {
          navigate("/main");
        }
      }
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }

  function closeModal(data) {
    SetOpenModal(data);
    userInfo.password = "";
  }

  return (
    <div className="login-page login">
      <img src={Logo} alt={Logo} className="com4in-ci" />

      {/*  */}
      {isLoading === true && <Loading />}
      {/*  */}
      <div className="login-form">
        <div className="logo-container">
          <div className="itsm-ci">
            <img src={Itsm} alt={Itsm} />
            <p>Com4in IT Service Management.</p>
          </div>
        </div>
        <input
          type="text"
          name="email"
          placeholder="email"
          value={userInfo.email}
          onChange={inputHandler}
        />
        <input
          type="password"
          placeholder="password"
          name="password"
          value={userInfo.password}
          onChange={inputHandler}
          onKeyDown={keyDown}
        />
        <button className="login-button" onClick={loginHandler}>
          Login
        </button>
        {userDto !== null && (
          <PasswordDialog
            show={openModal}
            close={closeModal}
            userInfo={userDto}
          />
        )}
      </div>
    </div>
  );
}

export default LoginPage;
