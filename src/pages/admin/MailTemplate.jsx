import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "@ui5/webcomponents-react";

import PageInfo from "../../components/PageInfo";
import FloatingBar from "../../components/FloatingBar";
import TicketElement from "../../components/TicketElements";

import api from "../../utils/api";

import "../../assets/styles/Common.css";
import "../../assets/styles/Details.css";

function MailTemplate() {
  const navigate = useNavigate();
  const location = useLocation();
  const uuid = location.state?.uuid;
  const [isEdit, setIsEdit] = useState(false);
  const [statusCode, setStatusCode] = useState([]);
  const [template, setTemplate] = useState({
    uuid: uuid,
    title: "",
    content: "",
    status_code: "",
  });

  // useEffect(() => {
  //   setTimeout(() => {
  //     setTemplate({ ...template, status_code: "1111" });
  //   }, 1000);
  // }, []);

  useEffect(() => {
    const asyncFunction = async () => {
      const codeResult = await api.commonCode();
      const tempMap = new Map();
      for (let i = 0; i < codeResult.length; i++) {
        const item = codeResult[i];
        if (item.main_code === "A01") {
          tempMap.set(item.sub_code, codeResult[i].label);
        }
      }

      const [_template] = await api.readTemplate(uuid);
      const status_code = tempMap.get(_template.status_code);
      setTemplate({ ...template, ..._template, status_code });

      // template.status_code = status_code;
      // if(result) {
      //   let temp = [];
      //   for (let i = 0; i < result.length; i++) {
      //     if (result[i].main_code === "A01") {
      //       temp.push({
      //         email: result[i].sub_code,
      //         name: result[i].label,
      //       });
      //     }
      //   }
      //   setStatusCode(temp)
      // }
    };
    asyncFunction();

    // // 상태코드조회
    // getCode();
    // // 템플릿 내용조회
    // if (uuid !== undefined) {
    //   readTemplate();
    // }
  }, []);

  // async function readTemplate() {
  //   const result = await api.readTemplate(uuid);
  //   // await new Promise((resolve) =>
  //   // {
  //   //   setTimeout(() => {resolve('true')}, 2000)
  //   // })

  //   if (result) {
  //     setTemplate(result[0]);
  //     for (let key in statusCode) {
  //       if (result[0].status_code === statusCode[key].email) {
  //         console.log(statusCode);
  //         setTemplate({ ...template, status_code: statusCode[key].name });
  //         return;
  //       }
  //     }
  //   }
  // }

  // async function getCode() {
  //   const result = await api.commonCode();
  //   if (result) {
  //     let temp = [];
  //     for (let i = 0; i < result.length; i++) {
  //       if (result[i].main_code === "A01") {
  //         temp.push({
  //           email: result[i].sub_code,
  //           name: result[i].label,
  //         });
  //       }
  //     }
  //     setStatusCode(temp);
  //   }
  // }

  function editTemplate() {
    setIsEdit(!isEdit);
  }

  //인풋박스 값 변경
  const inputHandler = (e) => {
    setTemplate({ ...template, [e.target.name]: e.target.value });
  };

  //상태코드변환
  function statusCodes(data) {
    setTemplate({
      ...template,
      status_code: data.detail.selectedOption.dataset.id,
    });
  }

  async function updateTemplate() {
    const result = await api.updateTemplate(template);
    if (result) {
      alert("저장되었습니다.");
      navigate("/admin/templateList");
    }
  }

  return (
    <div className="full-box">
      <FloatingBar
        CancelBtn={() => {
          navigate(-1);
        }}
        EditBtn={uuid !== undefined && isEdit === false && editTemplate}
        SaveBtn={isEdit === true && updateTemplate}
      />
      <div className="fix">
        <div className="page-header">
          <PageInfo main="메일 템플릿" sub="상세" path="/admin/templateList" />
        </div>
        {isEdit === true ? (
          <div className="form-box">
            <TicketElement
              type="select"
              title="상태"
              name="statusCode"
              content={template.status_code}
              item={statusCode}
              func={statusCodes}
              finish={isEdit === false && true}
            />
          </div>
        ) : (
          <div className="form-box">
            <label>
              <span>상태</span>
              <span>{template.status_code} </span>
            </label>
          </div>
        )}
        <div className="editor-box">
          <div className="box">
            <label>제목</label>
            <div className="input-box">
              <Input
                className="input"
                placeholder="제목"
                maxlength="40"
                value={template.title}
                disabled={
                  uuid === undefined ? false : isEdit === true ? false : true
                }
                name="title"
                onChange={inputHandler}
              />
            </div>
          </div>
          <div className="box">
            <label>내용</label>
            <div className="input-box">
              <textarea
                className="input"
                name="content"
                disabled={
                  uuid === undefined ? false : isEdit === true ? false : true
                }
                value={template.content}
                onChange={inputHandler}
              />
            </div>
          </div>
        </div>
      </div>

      {/*  */}
      {/* <PageInfo main="메일 템플릿" sub="상세" path="/admin/templateList" />
      <div className="content">
        <TicketElement
          type="select"
          title="상태"
          name="statusCode"
          content={template.status_code}
          item={statusCode}
          func={statusCodes}
          finish={isEdit === false && true}
        />
        <div className="main-section">
          <span className="title">제목</span>
          <Input
            className="input"
            placeholder="제목"
            maxlength="40"
            value={template.title}
            disabled={
              uuid === undefined ? false : isEdit === true ? false : true
            }
            name="title"
            onChange={inputHandler}
          />
          <span className="title">내용</span>
          <textarea
            className="input"
            style={{ height: "300px" }}
            name="content"
            disabled={
              uuid === undefined ? false : isEdit === true ? false : true
            }
            value={template.content}
            onChange={inputHandler}
          />
        </div>
      </div> */}
    </div>
  );
}

export default MailTemplate;
