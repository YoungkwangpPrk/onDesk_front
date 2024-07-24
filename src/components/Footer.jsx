import React from "react";

import Logo from "../assets/Image/com4in-footer-logo.svg";

import "../assets/styles/HeaderFooter.css";

function Footer() {
  return (
    window.location.pathname !== "/login" &&
    window.location.pathname !== "/detail" &&
    window.location.pathname !== "/board/new" &&
    window.location.pathname !== "/com4in/detail" &&
    window.location.pathname !== "/admin/mailTemplate" &&
    window.location.pathname !== "/admin/companyMember" && (
      <footer>
        <div>
          <img src={Logo} alt={Logo} />
        </div>
        <div className="wing">
          <div>
            <div>
              <p className="wing-title">BUSINESS</p>
              <p>SI/Consulting</p>
              <p>Outsourcing</p>
            </div>
            <div>
              <p className="wing-title">CONTACT</p>
              <div className="wing-border"></div>
              <p>10FL Hankook SGI Bldg, 49, Daehar-ro,</p>
              <p>Jongro-gu, Seoul, Korea</p>
              <p className="contact-email">sales@com4in.com</p>
            </div>
          </div>
        </div>
      </footer>
    )
  );
}

export default Footer;
