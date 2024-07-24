/* eslint-disable jsx-a11y/alt-text */
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import "@ui5/webcomponents-icons/dist/AllIcons";

//common, board
import AuthPage from "./Auth";
import LoginPage from "./LoginPage";
import Board from "./common/Board";
import CreateNotice from "./common/CreateNotice";
import Header from "../components/Header";
import Footer from "../components/Footer";

//client page
import Dashboard from "./Dashboard";
import IssueList from "./client/IssueList";
import { Detail } from "./client/Detail";

//com4inPages
import ComIssueList from "./com4in/ComIssueList";
import { ComDetail } from "./com4in/ComDetail";
import ComDashboard from "./com4in/ComDashboard";
import UserList from "./admin/UserList";
import CompanyList from "./admin/CompanyList";
import CompanyMemberList from "./admin/CompanyMember";
import MailTemplateList from "./admin/MailTemplateList";
import MailTemplate from "./admin/MailTemplate";

//https://sap.github.io/ui5-webcomponents-react/?path=/docs/getting-started--docs

function AnalyticBoard() {
  const navigate = useNavigate();
  return (
    <div className="full-box">
      <Header navigate={navigate} />
      <div className="container-flex">
        <div className="container-flex-2">
          <Routes>
            <Route path="*" element={<AuthPage />} />
            <Route path="/login" element={<LoginPage />} />
            {sessionStorage.token && (
              <>
                <Route path="/main" element={<Dashboard />} />
                <Route path="/main_old" element={<Dashboard />} />
                <Route path="/list" element={<IssueList />} />
                <Route path="/detail/:id" element={<Detail />} />
                <Route path="/userlist" element={<UserList />} />
                <Route path="/com4in/main" element={<ComDashboard />} />
                <Route path="/com4in/list" element={<ComIssueList />} />
                <Route path="/com4in/detail/:id" element={<ComDetail />} />
                <Route path="/admin/companylist" element={<CompanyList />} />
                <Route
                  path="/admin/companyMember"
                  element={<CompanyMemberList />}
                />
                <Route
                  path="/admin/templateList"
                  element={<MailTemplateList />}
                />
                <Route path="/admin/mailTemplate" element={<MailTemplate />} />
                <Route path="/board" element={<Board />} />
                <Route path="/board/new" element={<CreateNotice />} />
              </>
            )}
            <Route
              path="*"
              element={
                sessionStorage.key("token") === null ? (
                  <Navigate replace to="/login" />
                ) : (
                  <Navigate replace to="/" />
                )
              }
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default AnalyticBoard;
