import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Icon } from "@ui5/webcomponents-react";

import Menus from "../../components/Menus";
import ComIssueList from "./ComIssueList";
import Board from "../common/Board";

//css
import "../../assets/styles/Dashboard.css";

function ComDashboard() {
  const navigate = useNavigate();
  return (
    <div className="dashboard">
      <div className="fix">
        {/*  */}
        <div className="banner-background"></div>
        <div className="main-banner">
          <div className="left">
            <div className="ci-container">
              <div className="top"></div>
              <div className="middle"></div>
              <div className="bottom">
                <span className="ci">ITSM</span>
              </div>
            </div>
            <div className="comment-container">
              <span>
                <i>IT</i>
              </span>
              <span>
                <i>S</i>ervice
              </span>
              <span>
                <i>M</i>anagement
              </span>
            </div>
          </div>
        </div>
        {/*  */}
        {sessionStorage.company_account === "com4in" && <Menus />}
        <section className="section-container">
          <div className="fix-row">
            <div className="board-container">
              <div className="icon">
                <i className="las la-map-signs"></i>
                <span>공지 사항</span>
              </div>
              <Board main={true} />
            </div>
            <div className="wrap">
              <div className="button-container">
                <button
                  onClick={() => {
                    navigate("/com4in/detail/:id");
                  }}
                >
                  {/*  */}+<i className="las la-file-invoice"></i>
                </button>
                <h2>이슈 등록</h2>
              </div>

              <div className="button-container">
                <button
                  className="list"
                  onClick={() => {
                    navigate("/com4in/list");
                  }}
                >
                  <i className="las la-file"></i>
                  <i className="las la-file"></i>
                </button>
                <h2>이슈 목록</h2>
              </div>
            </div>
          </div>
        </section>
        <section className="section-container">
          <h2>나의 이슈 목록</h2>
          <ComIssueList main={true} />
        </section>
      </div>
    </div>
  );
}

export default ComDashboard;
