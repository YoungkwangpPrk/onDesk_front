import React from "react";
import { Link } from "react-router-dom";
import "../assets/styles/HeaderFooter.css";

function Menus({ typeClass = "main" }) {
  return (
    <section className={`section-container ${typeClass}`}>
      <div className="fix-row">
        <div className="button-container">
          <Link to="/userlist">
            <i className="lab la-github-alt"></i>
          </Link>
          <h2>컴포인사용자</h2>
        </div>
        <div className="button-container">
          <Link to="/admin/CompanyList">
            <i className="las la-otter"></i>
          </Link>
          <h2>고객사</h2>
        </div>
        <div className="button-container">
          <Link to="/com4in/list">
            <i className="las la-rocket"></i>
          </Link>
          <h2>이슈</h2>
        </div>

        <div className="button-container">
          <Link to="/board">
            <i className="las la-chalkboard"></i>
          </Link>
          <h2>공지사항</h2>
        </div>
        <div className="button-container">
          <Link to="/admin/templateList">
            <i className="las la-hat-wizard"></i>
          </Link>
          <h2>메일 템플릿</h2>
        </div>
      </div>
    </section>
  );
}

export default Menus;
