import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 } from "uuid";

//ui5
import { Input } from "@ui5/webcomponents-react";
import "@ui5/webcomponents/dist/features/InputElementsFormSupport.js";

//commponents
import TicketElement from "../../components/TicketElements";
import TicketComment from "../../components/TicketComment";
import FloatingBar from "../../components/FloatingBar";
import FileManager from "../../components/FileManager";
import { FileDBUpdate } from "../../components/FileManager";
import { emailValidattion, issueValidation } from "../../utils/validation";
import Loading from "../../components/Loading";

//css
import "../../assets/styles/Common.css";
import "../../assets/styles/Details.css";
import { inactiveStore } from "../../InactiveStore";
import PageInfo from "../../components/PageInfo";
import ToastEditor from "../../components/ToastEditor";
import api from "../../utils/api";

export function Detail() {
  const date = new Date();
  const Uuid = v4();
  const navigate = useNavigate();
  const location = useLocation();
  const issueKey = location.state?.uuid;
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validMsg, setValidMsg] = useState();
  const [issue, setIssue] = useState({
    uuid: Uuid,
    title: "", //제목
    company_name: sessionStorage?.company_name, //고객사명
    company_account: sessionStorage?.company_account, //고객사계정
    req_type: "", //요청유형
    inquirer: sessionStorage?.userName, //문의자
    inquirer_email: sessionStorage?.userEmail,
    manager: "", //담당자이메일
    manager_name: "", //담당자 이름
    status: "", //진행상태
    create_date: null, //요청일
    comp_req_date: null, //완료요청일
    comp_date: null, //완료일
    module: "", //관련모듈
    main_content: "", //문의내용
    req_level: "", //요청레벨
    status_code: "", //상태코드
    time_taken: "",
    session_id: sessionStorage.userEmail,
  });

  //타입별 리스트 저장
  const [moduletypes, setModuletypes] = useState([]);
  const [worktypes, setWorktypes] = useState([]);
  const [requestlevels, setRequestlevels] = useState([]);
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    const path = window.location.pathname.split("/detail/", ) 

    console.log('path', path, 'issueKey', issueKey)

    setIsLoading(true)
    if ((issueKey || path) !== undefined) {
      getIssueDetail();
    }
    getCommonCode();

    //담당자정보
    getComforinList();
    async function getIssueDetail() {
      const result = await api.getIssueDetail(issueKey ? issueKey : path[1]);
      if (result) {
        setIsEdit(true);
        setIssue({
          uuid: result[0].uuid,
          company_account: result[0].company_account, //요청사
          company_name: result[0].company_name, //고객사명
          inquirer: result[0].inquirer, //문의자
          inquirer_email: result[0].inquirer_email, //이메일
          manager: result[0].manager, //담당자이메일
          manager_name:
            result[0].manager_name != null ? result[0].manager_name : "", //담당자이름
          req_type: result[0].req_type, //처리유형
          module: result[0].module, //관련모듈
          status: result[0].status, //진행상태
          req_level: result[0].req_level, //요청레벨
          comp_req_date:
            result[0].comp_req_date != null ? result[0].comp_req_date : null, //완료요청일
          create_date: result[0].create_date, //요청일
          comp_date: result[0].comp_date != null ? result[0].comp_date : null, //완료일
          title: result[0].title, //제목
          main_content:
            result[0].main_content != null ? result[0].main_content : "", //문의내용
          status_code:
            result[0].status_code != null ? result[0].status_code : "", //요청코드
          time_taken:
            result[0].time_taken != null ? result[0].time_taken : null, //소요시간
          session_id: sessionStorage.userEmail,
        });
      }
      setIsLoading(false);
    }
    async function getCommonCode() {
      const result = await api.commonCode();
      if (result) {
        let temp = [];
        for (let i = 0; i < result.length; i++) {
          if (result[i].main_code === "A05") {
            temp.push(result[i].label);
            if (isEdit === false) {
              issue.module = temp[0];
            }
          }
        }
        setModuletypes(temp);
        temp = [];
        for (let i = 0; i < result.length; i++) {
          if (result[i].main_code === "A03") {
            temp.push(result[i].label);
            if (isEdit === false) {
              issue.req_type = temp[0];
            }
          }
        }
        setWorktypes(temp);
        temp = [];
        for (let i = 0; i < result.length; i++) {
          if (result[i].main_code === "A02") {
            temp.push(result[i].label);
            if (isEdit === false) {
              issue.req_level = temp[0];
              issue.comp_req_date = calculateWorkDoneDate(5);
            }
          }
        }
        setRequestlevels(temp);
      }
      setIsLoading(false);
    }

    async function getComforinList() {
      const result = await api.getUserList("com4in");
      if (result) {
        const com_accountInfo = sessionStorage.company_account;
        if (
          com_accountInfo !== "com4in" &&
          com_accountInfo !== null &&
          com_accountInfo !== ""
        ) {
          if (sessionStorage.comforin_manager === ("null" || "" || null)) {
            issue.manager = "suhee.lee@com4in.com";
          } else {
            issue.manager = sessionStorage.comforin_manager;
          }
        }
        setManagers(Array.from(result));
      }
    }
  }, [issueKey]);

  //인풋박스 값 변경
  const inputHandler = (e) => {
    // if (e.target.name === "inquirer_email") {
    //   const result = emailValidattion(e.target.value);
    //   setValidMsg(result);
    //   console.log(validMsg);
    // }
    setIssue({ ...issue, [e.target.name]: e.target.value });
  };

  //담당자변경
  function getManager(data) {
    setIssue({ ...issue, manager: data.detail.selectedOption.dataset.id });
  }

  //처리유형
  function requestType(data) {
    setIssue({ ...issue, req_type: data.detail.selectedOption.innerText });
  }

  //모듈타입
  function moduleType(data) {
    setIssue({ ...issue, module: data.detail.selectedOption.innerText });
  }

  //요청level에 따른 날짜변화
  function requestLevel(data) {
    if (data.detail.selectedOption.innerText === requestlevels[0]) {
      setIssue({
        ...issue,
        req_level: data.detail.selectedOption.innerText,
        comp_req_date: calculateWorkDoneDate(5),
      });
    } else if (data.detail.selectedOption.innerText === requestlevels[1]) {
      setIssue({
        ...issue,
        req_level: data.detail.selectedOption.innerText,
        comp_req_date: calculateWorkDoneDate(3),
      });
    } else if (data.detail.selectedOption.innerText === requestlevels[2]) {
      setIssue({
        ...issue,
        req_level: data.detail.selectedOption.innerText,
        comp_req_date: calculateWorkDoneDate(1),
      });
    }
  }

  function calculateWorkDoneDate(days) {
    // Get the current date
    let workDoneDate = new Date();
    let remainingDays = days;

    // Add weekdays to the current date until we reach the desired work done date
    while (remainingDays > 0) {
      workDoneDate.setDate(workDoneDate.getDate() + 1);
      // If the current day is a weekend day (Saturday or Sunday), skip it
      if (workDoneDate.getDay() === 0 || workDoneDate.getDay() === 6) {
        continue;
      }
      remainingDays--;
    }
    // Format the date as a string in ISO format (YYYY-MM-DD)
    const workDoneDateString = workDoneDate.toISOString().slice(0, 10);

    // Return the formatted date string
    return workDoneDateString;
  }

  //날짜수정
  function requestDate(data) {
    setIssue({ ...issue, comp_req_date: data.detail.value });
  }

  //이슈 생성
  async function createIssue() {
    const isContentEmpty = inactiveStore.editorEmpty;
    console.log(isContentEmpty);
    const result = issueValidation({
      inquirer_email: issue.inquirer_email,
      manager: issue.manager,
      title: issue.title,
      isContentEmpty: isContentEmpty,
    });
    if (result === true) {
      issue.status_code = "10";
      const attachedFiles = FileDBUpdate();
      console.log(
        "🚀 ~ file: Detail.jsx:247 ~ createIssue ~ attachedFiles:",
        attachedFiles
      );
      issue.file_info = attachedFiles;
      issue.main_content = inactiveStore.editor;
      console.log(
        "🚀 ~ file: Detail.jsx:249 ~ createIssue ~ issue.file_info:",
        issue.file_info
      );
      const result = await api.createIssue(issue);
      if (result) {
        navigate("/list");
      }
    }
  }

  //저장
  async function updateIssue() {
    const isContentEmpty = inactiveStore.editorEmpty;
    const result = issueValidation({
      inquirer_email: issue.inquirer_email,
      manager: issue.manager,
      title: issue.title,
      isContentEmpty: isContentEmpty,
    });
    if (result === true) {
      const attachedFiles = FileDBUpdate();
      issue.main_content = inactiveStore.editor;
      console.log(
        "🚀 ~ file: Detail.jsx:260 ~ updateIssue ~ attachedFiles:",
        attachedFiles
      );
      issue.file_info = attachedFiles;
      const result = await api.updateIssue(issue);
      if (result) {
        navigate("/list");
      }
    }
  }

  //삭제
  // async function deleteIssue() {
  //   if(window.confirm('삭제 후 복구할 수 없습니다. 이슈를 삭제하시겠습니까?'))
  //   {
  //     const result = api.deleteIssue(issueKey)
  //  if(result) {
  //   navigate('/list')
  //  }
  //   }
  // }

  //상태업데이트
  function updateStatus(data) {
    console.log(data);
    if (data === 40) {
      if (
        window.confirm("접수된 이슈를 취소하시겠습니까?")
      ) {
        issue.status_code = "40";
        update();
      } else {
        return;
      }
    } else if (data === 20) {
      issue.status_code = "20";
      update();
    } else if (data === 50) {
      issue.status_code = "50";
      issue.comp_date = date.toISOString().split("T")[0];
      update();
    } else if (data === 60) {
      issue.status_code = "60";
      if (
        window.confirm("삭제 후 복구할 수 없습니다. 이슈를 삭제하시겠습니까?")
      ) {
        update();
      } else {
        return;
      }
    }
  }

  async function update() {
    issue.file_info = [];
    const result = await api.updateStatus(issue.status_code, issue);
    if (result) {
      navigate("/list");
    }
  }

  function statusStyle(code) {
    if(issue.status_code === code)
      return "status"
    else return null;
  }

  return (
    <div className="full-box">
      {isLoading && <Loading />}
      <FloatingBar
        SubmitBtn={issue.status_code === "" ? createIssue : null}
        DeleteBtn={issue.status_code === "10" ? () => updateStatus(60) : null}
        SaveBtn={issue.status_code === "10" ? updateIssue : null}
        CancelBtn={issue.status_code === "20" ? () => updateStatus(40) : null}
        ReSubmitBtn={issue.status_code === "30" ? () => updateStatus(20) : null}
        ApproveBtn={issue.status_code === "30" ? () => updateStatus(50) : null}
      />
      <div className="fix">
        <div className="page-header">
          <PageInfo main="이슈" sub="등록/상세" path="/list" />
        </div>

        <div className="page-header">
          <div className="status-bar">
            <div className={statusStyle('10')}><span>등록</span></div>
            <div className={statusStyle('20')}><span>진행중</span></div>
            <div className={statusStyle('30')}><span>진행완료</span></div>
            <div className={statusStyle('50')}><span>처리완료</span></div>
          </div>
        </div>

        {/* <div className="label-box">
          <label>
            <span>고객사</span>
            <span>{issue.company_name}</span>
          </label>
          <label>
            <span>접수자</span>
            <span>{issue.inquirer}</span>
          </label>
          <label>
            <span>등록일</span>
            <span>
              {isEdit === false
                ? date.toISOString().split("T")[0]
                : issue.create_date}
            </span>
          </label>
          {!!issue.time_taken &&
            (issue.status_code === "30" || issue.status_code === "50") && (
              <label>
                <span>소요시간</span>
                <span>{issue.time_taken}</span>
              </label>
            )}
        </div> */}

        {!!isEdit === true ? (
          <div className="form-box">
            <label>
              <span>고객사</span>
              <span>{issue.company_name}</span>
            </label>
            <label>
              <span>접수자</span>
              <span>{issue.inquirer}</span>
            </label>
            <label>
              <span>등록일</span>
              <span>
                {isEdit === false
                  ? date.toISOString().split("T")[0]
                  : issue.create_date}
              </span>
            </label>

            <label>
              <span>이메일</span>
              <span>{issue.inquirer_email}</span>
            </label>
            <label>
              <span>모듈</span>
              <span>{issue.module}</span>
            </label>
            <label>
              <span>처리유형</span>
              <span>{issue.req_type}</span>
            </label>
            <label>
              <span>담당자</span>
              <span>{issue.manager}</span>
            </label>
            <label>
              <span>요청Level</span>
              <span>{issue.req_level}</span>
            </label>
            <label>
              <span>완료요청일</span>
              <span>{issue.comp_req_date}</span>
            </label>
            {!!issue.time_taken &&
              (issue.status_code === "30" || issue.status_code === "50") && (
                <label>
                  <span>소요시간</span>
                  <span>{issue.time_taken}</span>
                </label>
              )}
          </div>
        ) : (
          <div className="form-box">
            <label>
              <span>고객사</span>
              <span>{issue.company_name}</span>
            </label>
            <label>
              <span>접수자</span>
              <span>{issue.inquirer}</span>
            </label>
            <label>
              <span>등록일</span>
              <span>
                {isEdit === false
                  ? date.toISOString().split("T")[0]
                  : issue.create_date}
              </span>
            </label>
            {!!issue.time_taken &&
              (issue.status_code === "30" || issue.status_code === "50") && (
                <label>
                  <span>소요시간</span>
                  <span>{issue.time_taken}</span>
                </label>
              )}
            <hr />
            <TicketElement
              type="input"
              inputType="Email"
              title="이메일"
              valid={validMsg}
              required={true}
              name="inquirer_email"
              content={issue.inquirer_email}
              onChange={inputHandler}
              finish={isEdit && true}
            />
            <TicketElement
              type="select"
              title="모듈"
              name="module"
              content={issue.module}
              item={moduletypes}
              func={moduleType}
              finish={isEdit && true}
            />
            <TicketElement
              type="select"
              title="처리유형"
              name="req_type"
              content={issue.req_type}
              item={worktypes}
              func={requestType}
              finish={isEdit && true}
            />
            <TicketElement
              type="select"
              title="담당자"
              required={true}
              name="manager"
              content={issue.manager}
              item={managers}
              func={getManager}
              finish={isEdit && true}
            />
            <TicketElement
              type="select"
              title="요청Level"
              required={true}
              name="req_level"
              content={issue.req_level}
              item={requestlevels}
              func={requestLevel}
              finish={isEdit && true}
            />
            <TicketElement
              id="comp_req_date"
              type="datepicker"
              title="완료요청일"
              name="comp_req_date"
              content={issue.comp_req_date}
              func={requestDate}
              finish={isEdit && true}
            />
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
                value={issue.title}
                name="title"
                disabled={
                  issue.status_code !== "10" && issue.status_code !== "" && true
                }
                onChange={inputHandler}
              />
            </div>
          </div>
          <div className="box">
            <label>문의내용</label>
            <div className="input-box">
              <ToastEditor
                html={issue.main_content}
                readMode={
                  issue.status_code !== "10" && issue.status_code !== "" && true
                }
              />
            </div>
          </div>
          {issue.status_code !== "50" && issue.status_code !== "40" && (
            <div className="box">
              <label>파일 업로드</label>
              <div className="input-box">
                <FileManager
                  Iuuid={issueKey ? issueKey : issue.uuid}
                  edit={
                    (issue.status_code === "10" || issue.status_code === "") &&
                    true
                  }
                />
              </div>
            </div>
          )}
          {isEdit && (
            <TicketComment
              uuid={issue.uuid}
              finish={issue.status_code}
            />
          )}
        </div>
      </div>
    </div>
  );
}
