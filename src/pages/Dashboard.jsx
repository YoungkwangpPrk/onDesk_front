import React from "react";
import { useNavigate } from "react-router-dom";

import { Icon } from "@ui5/webcomponents-react";
import IssueList from "./client/IssueList";
import Board from "./common/Board";
import Progress from "../components/ProgressChart";

//css
import "../assets/styles/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  return (
    <div className="dashboard">
      <div className="fix">
        <div></div>
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
                    navigate("/detail/:id");
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
                    navigate("/list");
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
          <IssueList main={true} />
        </section>
        <section className="section-container">
          <h2>접수 현황</h2>
          <Progress />
        </section>
      </div>

      {/**content */}
      <section>
        {/* <div className="board-container">
          <Board main={true} />
        </div> */}
        {/* <div className="chart-container">
          <Progress />
        </div> */}
        {/* <div className="issue-container">
          <IssueList main={true} />
        </div> */}
      </section>
    </div>
  );
}

export default Dashboard;
