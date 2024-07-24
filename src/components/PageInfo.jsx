import React from "react";
import { useNavigate } from "react-router-dom";

import "../assets/styles/Common.css";

function PageInfo({ main, sub, path }) {
  const navigate = useNavigate();
  return (
    <div className="page-info">
      <a onClick={() => navigate(path)}>{main}</a>
      {sub && (
        <h2>
          {" "}
          {<i className="las la-angle-right"></i>} {sub}
        </h2>
      )}
    </div>
  );
}

export default PageInfo;
