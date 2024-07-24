import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Menus from "../components/Menus";
import MenusCustomer from "../components/MenusCustomer";
import "@ui5/webcomponents-icons/dist/AllIcons";
import api from "../utils/api";

//image
// import Logo from "../assets/Image/com4in-CI.png";
import Logo from "../assets/Image/com4in-logo-b.svg";
import Itsm from "../assets/Image/itsm.png";
import Clock from "../assets/Image/clock.png";

//css
import "../assets/styles/HeaderFooter.css";

function UserProfile({ onClick }) {
  return (
    <>
      <button className="button logout" onClick={onClick}>
        <span className="username">{sessionStorage.userName}님</span>
        <span>logout</span>
        <i className="las la-angle-right"></i>
      </button>
      {/* <Icon
        name="journey-arrive"
        interactive={true}
        className="header-icon"
        onClick={onClick}
      /> */}
    </>
  );
}

function ExtendLogin() {
  const navigate = useNavigate();
  const [remain, setRemain] = useState(sessionStorage.remain);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if(remain < 2) { console.log('expire'); setIsExpired(true); return;}
    const timer =
      setInterval(() =>{
        sessionStorage.setItem("expirationTime", (sessionStorage.getItem("expirationTime") - 1));
        setRemain(sessionStorage.expirationTime);
      }, 1000);
    return () => clearInterval(timer);
  }, [remain]);

  

  const extend = async() => {
    const result = await api.extendSession()
    if(result) {
      sessionStorage.setItem("expirationTime", result.data.detail.expirationTime);
      setRemain(sessionStorage.expirationTime);
      setIsExpired(false);
    } else { logOut(); return; };
  }

  const logOut = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const expiryToMMSS = () => {
    if(!remain) return "00:00";
    let HH = Math.trunc(remain / 60);
    let SS = Math.trunc(remain % 60);

    HH = HH < 10 ? "0" + HH : HH;
    SS = SS < 10 ? "0" + SS : SS;

    return HH + ":" + SS;
  }

  return (
    <>
      <div style={{alignItems: 'center', fontWeight: 'bold'}}>
        <li className="row-box">
          <img src={Clock} alt="clock" width={20} height={20} />
          <div>{expiryToMMSS()}</div>
        </li>
        <button className="button extend" onClick={extend}>연장</button>
      </div>
      {isExpired && 
        <div className="expired">
          <div className="msg">
            <li className="row-box">
              <img src={Clock} alt="clock" width={60} height={60} />
            </li>
            <h5>세션이 만료되었습니다.</h5>
            <li className="row-box">
              <button className="button extend" onClick={extend}>접속유지</button>
              <button className="button logout" onClick={logOut}>로그아웃</button>
            </li>
          </div>
        </div>
      }
    </>
  )
};

// function Menus() {
//   return (
//     <>
//       <Link to="/userlist">컴포인사용자</Link>
//       <Link to="/admin/CompanyList">고객사</Link>
//       <Link to="/com4in/list">이슈</Link>
//       <Link to="/board">공지사항</Link>
//       <Link to="/admin/templateList">메일</Link>
//     </>
//   );
// }

function Header({ navigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const handleLogoClick = () => {
    if (sessionStorage.key("token") !== null)
      if (sessionStorage.company_account === "com4in") navigate("/com4in/main");
      else navigate("/main");
    else navigate("/");
  };

  const logOut = () => {
    sessionStorage.clear();
    setIsOpen(false);
    navigate("/");
  };

  

  return (
    sessionStorage.getItem("token") !== null &&
    window.location.pathname !== "/login" && (
      <>
        <header>
          <div className="header-content">
            {/*  */}
            <div className="logo-box" onClick={handleLogoClick}>
              <div className="itsm-ci">
                <img src={Itsm} alt={Itsm} />
                <div className="wing">
                  <img src={Logo} alt={Logo} />
                  <p>IT Service Management.</p>
                </div>
              </div>
            </div>

            {/* <span className='header-title'>ITSM</span> */}
            {/* {sessionStorage.company_account === "com4in" && (
              <div className="header-menu">
                <Menus />
              </div>
            )} */}
            {/* <Icon
              name={isOpen ? "decline" : "menu2"}
              className="header-icon small-header-wing"
              interactive={true}
              onClick={() => setIsOpen(!isOpen)}
            /> */}
            <div className="wing">
              <ExtendLogin />
              <p>{sessionStorage.company_account}</p>
              <UserProfile onClick={logOut} />
            </div>
          </div>
        </header>
        {sessionStorage.company_account !== "com4in" &&
          window.location.pathname !== "/main" && (
            <MenusCustomer typeClass="header" />
          )}
        {/*  */}
        {sessionStorage.company_account === "com4in" &&
          window.location.pathname !== "/com4in/main" && (
            <Menus typeClass="header" />
          )}
        {/* {isOpen === true && (
          <div className="small-header">
            <header>
              <UserProfile onClick={logOut} />
              <Icon
                name={"decline"}
                className="header-icon small-header-wing"
                interactive={true}
                onClick={() => setIsOpen(!isOpen)}
              />
            </header>
            <div className="header-menu2" onClick={() => setIsOpen(!isOpen)}>
              {sessionStorage.company_account === "com4in" ? (
                <Menus />
              ) : (
                <>
                  <Link to="/board">공지사항</Link>
                  <Link to="/com4in/list">이슈목록</Link>
                </>
              )}
            </div>
          </div>
        )} */}
      </>
    )
  );
}

export default Header;
