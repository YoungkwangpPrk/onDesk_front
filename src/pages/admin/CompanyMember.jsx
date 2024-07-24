import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 } from "uuid";

import {
  Input,
  Icon,
  Table,
  Text,
  TableColumn,
  Label,
  TableRow,
  TableCell,
  Select,
  Option,
  RadioButton,
} from "@ui5/webcomponents-react";
import "@ui5/webcomponents-icons/dist/AllIcons.js";

import TicketElement from "../../components/TicketElements";
import FloatingBar from "../../components/FloatingBar";
import PageInfo from "../../components/PageInfo";

import {
  emailValidattion,
  nameValidation,
  companyMemberValidation,
} from "../../utils/validation";
import api from "../../utils/api";

//css
import "../../assets/styles/Common.css";
import "../../assets/styles/UserList.css";

const rootObj = {
  deleteRow: null,
};

function Rows({ rows, update, validationCheck, manager }) {
  return rows.map((rowsData, index) => {
    const {
      status,
      user_id,
      uuid,
      name,
      email,
      comforin_manager,
      nameErr,
      emailErr,
    } = rowsData;
    return (
      <TableRow
        key={index}
        type="Active"
        onClick={() => {
          rootObj.deleteRow = rowsData;
        }}
      >
        <TableCell>
          {/* create, update, delete */}
          <Icon name={status} />
        </TableCell>
        <TableCell>
          <Label hidden={true} title={uuid}>
            {uuid}
          </Label>
        </TableCell>
        <TableCell>
          <Input
            className="table-input table-input-left"
            value={user_id}
            name="user_id"
            type="Text"
            onChange={(event) => update(index, event)}
          />
          {(nameErr !== undefined || emailErr !== undefined) && (
            <>
              <br />
              <Text style={{ fontSize: 10, color: "red", marginLeft: 10 }}>
                {" "}
              </Text>
            </>
          )}
        </TableCell>
        <TableCell>
          <Input
            className="table-input"
            value={name}
            name="name"
            type="Text"
            style={{ textAlign: "left" }}
            onChange={(event) => update(index, event)}
            onInput={(event) => validationCheck(index, event)}
          />
          {(nameErr !== undefined || emailErr !== undefined) && (
            <>
              <br />
              <Text style={{ fontSize: 10, color: "red", marginLeft: 10 }}>
                {nameErr}
              </Text>
            </>
          )}
        </TableCell>
        <TableCell>
          <Input
            className="table-input table-input-left"
            value={email}
            name="email"
            type="Email"
            onChange={(event) => update(index, event)}
            onInput={(event) => validationCheck(index, event)}
          />
          {(nameErr !== undefined || emailErr !== undefined) && (
            <>
              <br />
              <Text style={{ fontSize: 10, color: "red", marginLeft: 10 }}>
                {emailErr}
              </Text>
            </>
          )}
        </TableCell>
        <TableCell style={{ textAlign: "center" }}>
          <Select
            style={{ textAlign: "center" }}
            name="comforin_manager"
            onChange={(e) => update(index, e)}
          >
            {manager.map((i, item) => (
              <Option
                key={item}
                data-id={i.email}
                selected={i.email === comforin_manager && true}
              >
                {i.name}
              </Option>
            ))}
          </Select>
          {(nameErr !== undefined || emailErr !== undefined) && (
            <>
              <br />
              <Text style={{ fontSize: 10, color: "red", marginLeft: 10 }}>
                {" "}
              </Text>
            </>
          )}
        </TableCell>
      </TableRow>
    );
  });
}

function CompanyMemberList() {
  const location = useLocation();
  const navigate = useNavigate();
  const date = new Date();
  const comapayUuid = v4();
  const [member, setMember] = useState([]);
  const [managerList, setManagerList] = useState([]);
  const [company, setCompany] = useState({
    uuid: comapayUuid,
    company_name: "",
    company_account: "",
    mngmt_type: "dev",
    operation_start_date: date.toISOString().split("T")[0],
    operation_end_date:
      date.getFullYear() +
      10 +
      "-" +
      (date.getMonth() < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1) +
      "-" +
      date.getDate(),
    session_id: sessionStorage.userEmail,
  });
  const [companyList, setCompanyList] = useState([]);
  const company_account = location.state?.company_account;

  useEffect(() => {
    getCompanyList();

    //회사 정보 조회
    if (company_account !== undefined) {
      getCompanyInfo();

      //멤버조회
      getCompanyMember();
    }

    //컴포인유저조회
    getComforInUser();

    async function getCompanyList() {
      const result = await api.getCompanyList();
      if (result) {
        let temp = [];
        for (let i = 0; i < result.length; i++) {
          temp.push(result[i].company_account);
        }
        setCompanyList(temp);
      }
    }

    async function getCompanyInfo() {
      const result = await api.getCompanyInfo(company_account);
      if (result) {
        setCompany({
          uuid: result[0].uuid,
          company_name: result[0].company_name,
          company_account: result[0].company_account,
          mngmt_type: result[0].mngmt_type ? result[0].mngmt_type : "dev",
          operation_start_date: result[0].operation_start_date,
          operation_end_date: result[0].operation_end_date,
        });
      }
    }

    async function getCompanyMember() {
      const result = await api.getUserList(company_account);
      if (result) {
        console.log(result);
        for (let i = 0; i < result.length; i++) {
          result[i].status = "normal";
          if (result[i].user_id === null) {
            result[i].user_id = "";
          }
        }
        setMember(Array.from(result));
      }
    }

    async function getComforInUser() {
      const result = await api.getUserList("com4in");
      if (result) {
        const temp = [];
        for (let i = 0; i < result.length; i++) {
          temp.push({ name: result[i].name, email: result[i].email });
        }
        setManagerList(temp);
      }
    }
  }, [company_account]);

  //고객사 관련
  const inputHandler = (e) => {
    setCompany({ ...company, [e.target.name]: e.target.value });
  };

  function startDate(data) {
    setCompany({ ...company, operation_start_date: data.detail.value });
  }

  function completeDate(data) {
    setCompany({ ...company, operation_end_date: data.detail.value });
  }

  const radioHandler = (e) => {
    const type = e.target.text;
    if (type === "개발") {
      setCompany({ ...company, mngmt_type: "dev" });
      return;
    } else if (type === "운영") {
      setCompany({ ...company, mngmt_type: "prod" });
      return;
    }
  };

  //고객사 사원 관련
  function validationCheck(i, e) {
    const data = [...member];
    if (e.target.name === "email") {
      const result = emailValidattion(e.target.value);
      data[i].emailErr = result;
      return;
    }
    if (e.target.name === "name") {
      const result = nameValidation(e.target.value);
      data[i].nameErr = result;
      return;
    }
  }
  //정보 업데이트
  const update = (i, event) => {
    const { name, value } = event.target;
    const data = [...member];
    data[i].status = data[i].status !== "create" ? "edit" : "create";
    data[i][name] = value;
    data[i].session_id = sessionStorage.userEmail;
    if (data[i].status === "create") {
      data[i].password = "com4in!!";
    }
    if (name === "comforin_manager") {
      data[i].comforin_manager = event.detail.selectedOption.dataset.id;
    }
    setMember(data);
  };

  //변경내용저장
  var member2 = [];
  async function saveCompanyData() {
    const result = companyMemberValidation(member);
    const count = result[0];
    member2 = result[1];
    if (
      company_account === undefined &&
      company.company_account !== "" &&
      count === member.length &&
      company.company_name !== ""
    ) {
      if (companyList.indexOf(company.company_account) !== -1) {
        alert("이미 등록된 회사 정보 입니다.");
        return;
      }
      const result = await api.addCompany(company);
      if (result) {
        saveMemberData();
        navigate("/admin/companylist");
      }
    } else if (company.company_account !== "" && count === member.length) {
      const result = await api.updateCompany(company);
      if (result) {
        saveMemberData();
        navigate("/admin/companylist");
      }
    } else {
      alert("정보를 모두 입력해주세요");
    }
  }

  async function saveMemberData() {
    console.log("mememememe", member2);
    const result = await api.saveCompanyMember(member2);
    if (result) {
      console.log("완료");
      return;
    }
  }

  //행추가
  function addRow() {
    const table = document.getElementsByClassName("table-box")[0];
    table.scrollTo({ top: 0, behavior: "smooth" });
    setMember([
      {
        status: "create",
        uuid: comapayUuid,
        session_id: sessionStorage.userEmail,
        user_id: "",
        name: "",
        email: "",
        comforin_manager: "suhee.lee@com4in.com",
        company_account: company.company_account,
      },
      ...member,
    ]);
  }

  //행삭제
  function deleteRow() {
    const dele = Array.from(member);
    if (rootObj.deleteRow !== null) {
      if (rootObj.deleteRow.status === "create") {
        dele.splice(dele.indexOf(rootObj.deleteRow), 1);
      } else {
        dele[dele.indexOf(rootObj.deleteRow)].status = "delete";
      }
      setMember(dele);
      rootObj.deleteRow = null;
    } else {
      alert("행을 선택해 주세요");
    }
  }

  //고객사 삭제
  async function deleteCompany() {
    if (window.confirm("삭제 후 복구할 수 없습니다. 삭제하시겠습니까?")) {
      const result = await api.deleteCompany(company_account);
      if (result) {
        console.log(result);
        alert("삭제되었습니다.");
        navigate("/admin/CompanyList");
      }
    }
  }

  return (
    <div className="full-box">
      <FloatingBar DeleteBtn={deleteCompany} SaveBtn={saveCompanyData} />
      <div className="fix">
        <div className="page-header">
          <PageInfo main="고객사" sub="등록/수정" path="/admin/CompanyList" />
          <div className="wing">
            {/* <button className="button">
              엑셀업로드
              <i className="las la-angle-right"></i>
            </button> */}
            <button onClick={addRow} className="button">
              행추가
              <i className="las la-angle-right"></i>
            </button>
            <button onClick={deleteRow} className="button">
              행삭제
              <i className="las la-angle-right"></i>
            </button>
          </div>
        </div>
        {/* {!company_account === false && (
          <div className="label-box">
            <label>
              <span>고객사명 -</span>
              <span>{company.company_name}</span>
            </label>
            <label>
              <span>고객사계정 -</span>
              <span>{company.company_account}</span>
            </label>
          </div>
        )} */}

        <div className="form-box">
          {!company_account === false && (
            <>
              <label>
                <span>고객사명</span>
                <span>{company.company_name}</span>
              </label>
              <label>
                <span>고객사계정</span>
                <span>{company.company_account}</span>
              </label>
              <hr className="hidden" />
            </>
          )}
          <div className="radio-box">
            <RadioButton
              name="구분"
              text="개발"
              onChange={radioHandler}
              checked={company.mngmt_type === "dev" && true}
            />
            <RadioButton
              name="구분"
              text="운영"
              onChange={radioHandler}
              checked={company.mngmt_type === "prod" && true}
            />
          </div>

          {!company_account === true && (
            <>
              <hr />
              <TicketElement
                type="input"
                title="고객사명"
                required={true}
                name="company_name"
                content={company.company_name}
                onChange={inputHandler}
                finish={company_account !== undefined && true}
              />
              <TicketElement
                type="input"
                title="고객사계정"
                required={true}
                name="company_account"
                content={company.company_account}
                onChange={inputHandler}
                finish={company_account !== undefined && true}
              />
            </>
          )}
          <TicketElement
            id="operation_start_date"
            title="운영시작일"
            required={true}
            admin
            name="operation_start_date"
            content={company.operation_start_date}
            func={startDate}
          />
          <TicketElement
            id="operation_end_date"
            type="datepicker"
            title="운영종료일"
            name="operation_end_date"
            content={company.operation_end_date}
            func={completeDate}
          />
        </div>
        <div className="table-box">
          <Table
            mode="SingleSelect"
            stickyColumnHeader
            columns={
              <>
                <TableColumn>
                  <Label className="table-label">상태</Label>
                </TableColumn>
                <TableColumn>
                  <Label hidden={true}>순번</Label>
                </TableColumn>
                <TableColumn>
                  <Label>UserID</Label>
                </TableColumn>
                <TableColumn>
                  <Label>이름</Label>
                </TableColumn>
                <TableColumn>
                  <Label>이메일</Label>
                </TableColumn>
                <TableColumn>
                  <Label className="table-label">컴포인 담당자</Label>
                </TableColumn>
              </>
            }
          >
            <Rows
              rows={member}
              update={update}
              manager={managerList}
              validationCheck={validationCheck}
            />
          </Table>
        </div>

        {/* <div className="content"> */}
        {/* <div className="table-layout" style={{ height: 400 }}></div> */}
        {/* </div> */}
      </div>
    </div>
  );
}

export default CompanyMemberList;
