import React, { useEffect, useState } from "react";

import {
  Input,
  Icon,
  Table,
  TableColumn,
  Label,
  TableRow,
  TableCell,
  Select,
  Option,
} from "@ui5/webcomponents-react";
import "@ui5/webcomponents-icons/dist/AllIcons.js";
import { v4 } from "uuid";
import PageInfo from "../../components/PageInfo";
import Loading from "../../components/Loading";

//utils
import {
  comforinUserValidation,
  emailValidattion,
  nameValidation,
} from "../../utils/validation";
import api from "../../utils/api";

import "../../assets/styles/Common.css";
import "../../assets/styles/UserList.css";

const rootObj = {
  deleteRow: null,
};

function Rows({ rows, update, updatePassword, modules, validationCheck }) {
  return rows.map((rowsData, index) => {
    const {
      status,
      uuid,
      name,
      company_account,
      email,
      password,
      emailErr,
      nameErr,
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
            value={name}
            name="name"
            type="Text"
            onChange={(event) => update(index, event)}
            onInput={(event) => validationCheck(index, event)}
          />
          {(nameErr !== undefined || emailErr !== undefined) && (
            <>
              <div className="error-message">{nameErr}</div>
            </>
          )}
        </TableCell>
        <TableCell>
          <Input
            className="table-input"
            value={company_account}
            name="company_account"
            type="Text"
            onChange={(event) => update(index, event)}
          />
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
              <div className="error-message">{emailErr}</div>
            </>
          )}
        </TableCell>
        <TableCell>
          <Input
            className="table-input"
            value={password.toString().substring(0, 4)}
            name="password"
            type="Password"
            disabled={true}
            onChange={(event) => update(index, event)}
          />
        </TableCell>
        <TableCell className="reset-button" style={{verticalAlign: 'middle'}}>
          <i style={{fontSize: '28px'}} onClick={(event) => updatePassword(index)} className="las la-unlock-alt"></i>
          {/* <Button onClick={(event) => updatePassword(index)}>초기화</Button> */}
        </TableCell>
        <TableCell>
          <Select hidden={true} onChange={(event) => update(index, event)}>
            {modules.map((item, i) => (
              <Option key={i} data-id={item}>
                {item}
              </Option>
            ))}
          </Select>
        </TableCell>
      </TableRow>
    );
  });
}

function UserList() {
  const [array, setArray] = useState([]);
  const userUuid = v4();
  const [moduletypes, setModuletypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    //목록 조회
    getUserList();
    //모듈코드 조회
    getModuleList();

    async function getUserList() {
      const result = await api.getUserList("com4in");
      if (result) {
        for (let i = 0; i < result.length; i++) {
          result[i].status = "normal";
        }
        setArray(Array.from(result));
      }
      setIsLoading(false);
    }

    async function getModuleList() {
      const result = await api.commonCode();
      if (result) {
        let temp = [];
        for (let i = 0; i < result.length; i++) {
          if (result[i].main_code === "A05") {
            temp.push(result[i].label);
          }
        }
        setModuletypes(temp);
      }
    }
  }, []);

  function validationCheck(i, e) {
    const data = [...array];
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

  const update = (i, event) => {
    console.log(i, event);
    const { name, value } = event.target;
    const data = [...array];
    data[i].status = data[i].status !== "create" ? "edit" : "create";
    data[i][name] = value;
    data[i].session_id = sessionStorage.userEmail;
    data[i].password = "Init@1234";
    setArray(data);
  };

  const updatePassword = async (i) => {
    const data = [...array];
    data[i].password = "Init@1234";
    const result = await api.resetPassword(data[i]);
    if (result) {
      alert("비밀번호가 초기화 되었습니다");
    }
  };

  function addRow() {
    const table = document.getElementsByClassName("table-box")[0];
    table.scrollTo({ top: 0, behavior: "smooth" });
    setArray([
      {
        status: "create",
        uuid: userUuid,
        name: "",
        company_account: "com4in",
        email: "",
        password: "Init@1234",
        session_id: sessionStorage.userEmail,
      },
      ...array,
    ]);
  }

  function deleteRow() {
    const dele = Array.from(array);
    if (rootObj.deleteRow.status === "create") {
      dele.splice(dele.indexOf(rootObj.deleteRow), 1);
    } else {
      dele[dele.indexOf(rootObj.deleteRow)].status = "delete";
    }
    setArray(dele);
    rootObj.deleteRow = null;
  }

  async function saveUserList() {
    const result = comforinUserValidation(array);
    const count = result[0];
    const userList = result[1];

    if (count === array.length) {
      const result = await api.saveCompanyMember(userList);
      if (result) {
        window.location.reload();
      }
    } else {
      alert("데이터를 형식에 맞게 입력해 주세요");
    }
  }

  return (
    <div className="full-box">
      {isLoading && <Loading />}
      <div className="fix">
        <div className="page-header">
          <PageInfo main="컴포인사용자" />
          <div className="wing">
            <button onClick={addRow} className="button">
              행추가
              <i className="las la-angle-right"></i>
            </button>
            <button onClick={deleteRow} className="button">
              행삭제
              <i className="las la-angle-right"></i>
            </button>
            <button onClick={saveUserList} className="button">
              저장
              <i className="las la-angle-right"></i>
            </button>
          </div>
        </div>
        {/* <PageInfo main='컴포인사용자' /> */}
        {isLoading === false &&<div className="table-box">
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
                  <Label>이름</Label>
                </TableColumn>
                <TableColumn>
                  <Label className="table-label">회사</Label>
                </TableColumn>
                <TableColumn>
                  <Label>회사메일</Label>
                </TableColumn>
                <TableColumn>
                  <Label className="table-label">패스워드</Label>
                </TableColumn>
                <TableColumn>
                  <Label className="table-label">패스워드 초기화</Label>
                </TableColumn>
                <TableColumn>
                  <Label hidden={true}>담당모듈</Label>
                </TableColumn>
              </>
            }
          >
            <Rows
              rows={array}
              update={update}
              updatePassword={updatePassword}
              modules={moduletypes}
              validationCheck={validationCheck}
            />
          </Table>
        </div>}
      </div>
    </div>
  );
}

export default UserList;
