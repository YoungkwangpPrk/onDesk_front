import React from "react";
import { Link } from "react-router-dom";
import "../assets/styles/HeaderFooter.css";

function Menus({ typeClass = "main" }) {
  return (
    <section className={`section-container ${typeClass}`}>
      <div className="fix-row">
        <div className="button-container">
          <Link to="/">
            <i className="las la-home"></i>
          </Link>
          <h2>홈</h2>
        </div>
        <div className="button-container">
          <Link to="/list">
            <i className="las la-list-alt"></i>
          </Link>
          <h2>이슈 목록</h2>
        </div>
      </div>
    </section>
  );
}

export default Menus;
