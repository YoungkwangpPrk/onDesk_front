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
import ChangeManager from "../../components/ChangeManager";
import { commentLength } from "../../components/TicketComment";
import FileManager from "../../components/FileManager";
import { FileDBUpdate } from "../../components/FileManager";
import { inactiveStore, inactiveStoreResult } from "../../InactiveStore";
import PageInfo from "../../components/PageInfo";
import ToastEditor from "../../components/ToastEditor";
import { issueValidation } from "../../utils/validation";
import api from "../../utils/api";
import Loading from "../../components/Loading";

//css
import "../../assets/styles/Common.css";
import "../../assets/styles/Details.css";
import ToastEditorResult from "../../components/ToastEditorResult";

export function ComDetail() {
  const date = new Date();
  const Uuid = v4();
  const navigate = useNavigate();
  const location = useLocation();
  const issueKey = location.state?.uuid;
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [issue, setIssue] = useState({
    uuid: Uuid,
    title: "", //제목
    sap_incident_number: "",
    company_name: "", //고객사명
    company_account: "", //고객사계정
    req_type: "", //요청유형
    inquirer: "", //문의자
    inquirer_email: "", //문의자이메일
    manager: "", //담당자이메일
    manager_name: "", //담당자이름
    status: "", //진행상태
    result: "", //처리결과
    create_date: null, //요청일
    comp_req_date: null, //완료요청일
    comp_date: null, //완료일
    module: "", //관련모듈
    main_content: "", //문의내용
    result_content: "",
    req_level: "", //요청레벨
    status_code: "", //상태코드
    time_taken: "",
    cooperator:"",
    cooperator_name:"",
    create_id: "",
    session_id: sessionStorage.userEmail,
  });

  const [time, setTime] = useState("00");

  const [moduletypes, setModuletypes] = useState([]);

  const [worktypes, setWorktypes] = useState([]);

  const [requestlevels, setRequestlevels] = useState([]);

  const [managers, setManagers] = useState([]);

  const [companyList, setCompanyList] = useState([]);

  const timeTaken = ["00", "30"];
  
  
  useEffect(() => {

    const path = window.location.pathname.split("/com4in/detail/", );

    setIsLoading(true)
    
    if (issueKey !== undefined || path[1] !== ":id" ) {
      getIssueDetail();
    }
    getCommonCode();
    getComforinList();
    getCompanyList();

    async function getIssueDetail() {
      console.log(path)
      const result = await api.getIssueDetail(issueKey ? issueKey : path[1]);
      if (result) {
        console.log(result)
        setIsEdit(true);
        setIssue({
          uuid: result[0].uuid,
          sap_incident_number: result[0].sap_incident_number,
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
          result_content:
            result[0].result_content != null ? result[0].result_content : "",
          status_code:
            result[0].status_code != null ? result[0].status_code : "", //요청코드
          time_taken:
            result[0].time_taken != null ? result[0].time_taken : "00", //소요시간
          cooperator:
            result[0].cooperator ?? "", //협조자  
          cooperator_name:
            result[0].cooperator_name ?? "",
          session_id: sessionStorage.userEmail,
          create_id: result[0].create_id
        });
        setHour(result[0].time_taken?.substring(0, 2));
        if (result[0].time_taken?.substring(3) === "00") {
          setTime("00");
        } else if (result[0].time_taken?.substring(3, 5) !== "") {
          setTime(result[0].time_taken?.substring(3, 5));
        }
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
        const temp = [];
        isEdit === false && temp.push("");
        for (let i = 0; i < result.length; i++) {
          temp.push({ name: result[i].name, email: result[i].email });
        }
        setManagers(temp);
      }
    }

    async function getCompanyList() {
      const result = await api.getCompanyList();
      if (result) {
        let temp = [];
        temp.push({ name: " ", email: " " });
        for (let i = 0; i < result.length; i++) {
          temp.push({
            name: result[i].company_name,
            email: result[i].company_account,
          });
        }
        setCompanyList(temp);
      } 
    }

    
  }, [issueKey]);
  // const box = document.getElementsByClassName("container-flex")[0];
  //   box.scrollTo({top: 0, behavior: "instant"});

  const inputHandler = (e) => {
    setIssue({ ...issue, [e.target.name]: e.target.value });
  };

  //담당자변경
  function getManager(data) {
    setIssue({ ...issue, manager: data.detail.selectedOption.dataset.id });
  }

  //협조자변경
  function getCooperator(data) {
    setIssue({ ...issue, cooperator: data.detail.selectedOption.dataset.id });
  }

  //처리유형
  function requestType(data) {
    setIssue({ ...issue, req_type: data.detail.selectedOption.innerText });
  }

  //모듈타입
  function moduleType(data) {
    setIssue({ ...issue, module: data.detail.selectedOption.innerText });
  }

  //요청level
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

  //고객사 선택
  function setCompany(data) {
    setIssue({
      ...issue,
      company_account: data.detail.selectedOption.dataset.id,
    });
  }

  //소요시간 수정부분
  const [hour, setHour] = useState("00");
  //소요시간 Input
  function setTimeTaken(e) {
    if (e.target.value.length === 1) {
      setHour("0" + e.target.value);
    } else setHour(e.target.value);
  }
  //소요시간 Selector
  function getTimeTaken(data) {
    setTime(data.detail.selectedOption.innerText);
  }

  // function completeDate(data) {
  //   setIssue({ ...issue, comp_date: data.detail.value });
  // }

  //담당자 변경 모달 관련
  const [modalOpen, setModalOpen] = useState(false);

  function closeModal(data) {
    setModalOpen(data);
  }

  function showManager() {
    setModalOpen(true);
  }

  function selectedManager(data) {
    for (let i = 0; i < managers.length; i++) {
      if (data.detail.selectedItems[0].innerText === managers[i].email) {
        if (
          window.confirm(
            `담당자를 ${managers[i].name} 매니저로 변경하시겠습니까?`
          )
        ) {
          issue.manager = data.detail.selectedItems[0].innerText;
          updateIssue();
        }
      }
    }
  }

  //이슈 상태변화
  function TakeIssue() {
    issue.status_code = "20";
    updateIssue();
  }

  function CompleteIssue() {
    issue.time_taken = hour + ":" + time;
    console.log(issue.time_taken);
    if (
      issue.time_taken !== "00:00" &&
      issue.time_taken.length === 5 &&
      commentLength() !== "0"
    ) {
      issue.status_code = "30";
      updateIssue();
    } else {
      if (issue.time_taken.length !== 5 || issue.time_taken === "00:00") {
        alert("소요시간을 정확히 입력해 주세요");
        return;
      }
      if (commentLength() === "0") {
        alert("댓글을 등록해주세요");
        return;
      }
    }
  }

  function approveIssue() {
    issue.time_taken = hour + ":" + time;
    console.log(issue.time_taken);
    if (
      issue.time_taken !== "00:00" &&
      issue.time_taken.length === 5 &&
      commentLength() !== "0"
    ) {
      issue.status_code = "50";
      updateIssue();
    } else {
      if (issue.time_taken.length !== 5 || issue.time_taken === "00:00") {
        alert("소요시간을 정확히 입력해 주세요");
        return;
      }
      if (commentLength() === "0") {
        alert("댓글을 등록해주세요");
        return;
      }
    }
  }

  //이슈 생성
  async function createIssue() {
    const isContentEmpty = inactiveStore.editorEmpty;
    console.log(isContentEmpty);
    const result = issueValidation({
      company_account: issue.company_account,
      inquirer: issue.inquirer,
      inquirer_email: issue.inquirer_email,
      manager: issue.manager,
      title: issue.title,
      isContentEmpty: isContentEmpty,
    });
    if (result === true) {
      issue.status_code = "10";
      if(issue.inquirer.length > 20) {
        alert('접수자는 이름으로 작성해 주세요');
        return;
      };
      const attachedFiles = FileDBUpdate();
      console.log(
        "🚀 ~ file: Detail.jsx:247 ~ createIssue ~ attachedFiles:",
        attachedFiles
      );
      issue.file_info = attachedFiles;
      issue.main_content = inactiveStore.editor;
      issue.result_content = inactiveStoreResult.editor;
      console.log(
        "🚀 ~ file: Detail.jsx:249 ~ createIssue ~ issue.file_info:",
        issue.file_info
      );
      console.log(issue);
      const result = await api.createIssue(issue);
      if (result) {
        navigate("/com4in/list");
      }
    }
  }

  //이슈 업데이트
  async function updateIssue() {
    const isContentEmpty = inactiveStore.editorEmpty;    
    const result = issueValidation({
      company_account: issue.company_account,
      inquirer: issue.inquirer,
      inquirer_email: issue.inquirer_email,
      manager: issue.manager,
      title: issue.title,
      isContentEmpty: isContentEmpty
    });
    if (result === true) {
      const attachedFiles = FileDBUpdate();
      issue.main_content = inactiveStore.editor;
      issue.result_content = inactiveStoreResult.editor;
      console.log(
        "🚀 ~ file: Detail.jsx:260 ~ updateIssue ~ attachedFiles:",
        attachedFiles
      );
      issue.file_info = attachedFiles;
      const result = await api.updateIssue(issue);
      if (result) {
        navigate("/com4in/list");
      }
    }
  }

  //삭제
  async function deleteIssue() {
    if(window.confirm('삭제 후 복구할 수 없습니다. 이슈를 삭제하시겠습니까?'))
    {
      const result = api.deleteIssue(issueKey)
   if(result) {
    navigate('/com4in/list')
   }
    }
  }

  function statusStyle(code) {
    if(issue.status_code === code)
      return "status"
    else return null;
  }

  return (
    <div className="full-box">
      {isLoading === true && <Loading />}
      {issue.status_code !== "50" &&
        issue.status_code !== "30" &&
        issue.status_code !== "40" && (
          <FloatingBar
            DeleteBtn={
              (issue.status_code === "10" && issue.create_id === sessionStorage.userEmail) ? deleteIssue : null
            }
            SaveBtn={
              (issue.status_code === "10" && issue.create_id === sessionStorage.userEmail) ? updateIssue : null
            }
            ChangeManager={
              issue.status_code === "10" ? showManager : null
            }
            ReceiveBtn={
              issue.status_code === "10" &&
              issue.manager === sessionStorage.userEmail
                ? TakeIssue
                : null
            }
            CompleteBtn={
              issue.status_code !== "10" && issue.status_code !== ""
                ? CompleteIssue
                : null
            }
            ApproveBtn={
              issue.status_code !== "10" && issue.status_code !== ""
                ? approveIssue
                : null
            }
            SubmitBtn={issue.status_code === "" && createIssue}
          />
        )}
      <div className="fix">
        <div className="page-header">
          <PageInfo main="이슈" sub="등록/상세" path="/com4in/list" />
        </div>
        <div className="page-header">
          <div className="status-bar">
            <div className={statusStyle('10')}><span>등록</span></div>
            <div className={statusStyle('20')}><span>진행중</span></div>
            <div className={statusStyle('30')}><span>진행완료</span></div>
            <div className={statusStyle('50')}><span>처리완료</span></div>
          </div>
        </div>

        {isEdit === true ? (
          <>
            <div className="form-box">
              {/* <label>
                <span>고객사</span>
                <span>{issue.company_name}</span>
              </label>
              <label>
                <span>접수자</span>
                <span>{issue.inquirer}</span>
              </label>
              <label>
                <span>담당자</span>
                <span>{issue.manager_name}</span>
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
                <span>요청Level</span>
                <span>{issue.req_level}</span>
              </label>
              <label>
                <span>모듈</span>
                <span>{issue.module}</span>
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
                <span>완료 요청일</span>
                <span>{issue.comp_req_date}</span>
              </label> */}
              <TicketElement
              type="input"
              title="SAP Incident Number"
              required={true}
              name="sap_incident_number"
              content={issue.sap_incident_number}
              onChange={inputHandler}
              // finish={isEdit && true}
              finish={issue.status_code === '50' && true}
            />
              <TicketElement
              type="select"
              title="고객사"
              required={true}
              name="company_name"
              content={issue.company_account}
              item={companyList}
              func={setCompany}
              // finish={isEdit && true}
              finish={issue.status_code === '50' && true}
            />
            <TicketElement
              type="input"
              title="접수자"
              required={true}
              name="inquirer"
              content={issue.inquirer}
              onChange={inputHandler}
              // finish={isEdit && true}
              finish={issue.status_code === '50' && true}
            />
            <TicketElement
              type="input"
              title="이메일"
              required={true}
              name="inquirer_email"
              content={issue.inquirer_email}
              onChange={inputHandler}
              // finish={isEdit && true}
              finish={issue.status_code === '50' && true}
            />
            <TicketElement
              type="select"
              title="모듈"
              name="module"
              content={issue.module}
              item={moduletypes}
              func={moduleType}
              // finish={isEdit && true}
              finish={issue.status_code === '50' && true}
            />
            <TicketElement
              type="select"
              title="처리유형"
              name="req_type"
              content={issue.req_type}
              item={worktypes}
              func={requestType}
              // finish={isEdit && true}
              finish={issue.status_code === '50' && true}
            />
            <TicketElement
              type="select"
              title="요청Level"
              required={true}
              name="req_level"
              content={issue.req_level}
              item={requestlevels}
              func={requestLevel}
              // finish={isEdit && true}
              finish={issue.status_code === '50' && true}
            />
            <TicketElement
              type="select"
              title="담당자"
              required={true}
              name="manager"
              content={issue.manager}
              item={managers}
              func={getManager}
              // finish={isEdit && true}
              finish={issue.status_code === '50' && true}
            />
            <TicketElement
              id="comp_req_date"
              type="datepicker"
              title="완료요청일"
              name="comp_req_date"
              content={issue.comp_req_date}
              func={requestDate}
              // finish={isEdit && true}
              finish={issue.status_code === '50' && true}
            />
              {!!issue.time_taken && issue.status_code !== "20" && (
                <label>
                  <span>소요시간</span>
                  <span>{issue.time_taken}</span>
                </label>
              )}
              {!!issue.comp_date && (
                <label>
                  <span>완료일</span>
                  <span>{issue.comp_date}</span>
                </label>
              )}
              {issue.status_code === "20" && (
                <TicketElement
                  type="select"
                  title="소요시간"
                  name="time_taken"
                  content={issue.time_taken}
                  hours={hour}
                  item={timeTaken}
                  func={getTimeTaken}
                  onChange={setTimeTaken}
                  finish={issue.status_code !== "20" && true}
                />
              )}
              {issue.status_code === "20" &&  (
                <TicketElement
                  type="select"
                  title="협조자"
                  name="cooperator"
                  content={issue.cooperator}
                  item={managers}
                  func={getCooperator}
                />
              )}
              {!!issue.cooperator_name && issue.status_code !== "20" && (
                <label>
                  <span>협조자</span>
                  <span>{issue.cooperator_name}</span>
                </label>
              )}
            </div>
          </>
        ) : (
          <div className="form-box">
            <label>
              <span>등록일</span>
              <span>
                {isEdit === false
                  ? date.toISOString().split("T")[0]
                  : issue.create_date}
              </span>
            </label>
            {!!issue.time_taken && (
              <label>
                <span>소요시간</span>
                <span>{issue.time_taken}</span>
              </label>
            )}
            {!!issue.comp_date && (
              <label>
                <span>완료일</span>
                <span>{issue.comp_date}</span>
              </label>
            )}
            {!!issue.time_taken && (
              <label>
                <span>협조자</span>
                <span>{issue.cooperator_name}</span>
              </label>
            )}
            <hr />
            <TicketElement
              type="input"
              title="SAP Incident Number"
              required={true}
              name="sap_incident_number"
              content={issue.sap_incident_number}
              onChange={inputHandler}
              // finish={isEdit && true}
              finish={issue.status_code === '50' && true}
            />
            <TicketElement
              type="select"
              title="고객사"
              required={true}
              name="company_name"
              content={issue.company_name}
              item={companyList}
              func={setCompany}
              finish={isEdit && true}
            />
            <TicketElement
              type="input"
              title="접수자"
              required={true}
              name="inquirer"
              content={issue.inquirer}
              onChange={inputHandler}
              finish={isEdit && true}
            />
            <TicketElement
              type="input"
              title="이메일"
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
              title="요청Level"
              required={true}
              name="req_level"
              content={issue.req_level}
              item={requestlevels}
              func={requestLevel}
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
                onChange={inputHandler}
                disabled={issue.status_code === "50" && true}
                // disabled={isEdit && true}
              />
            </div>
          </div>
          <div className="box">
            <label>문의내용</label>
            <div className="input-box">
              <ToastEditor
                html={issue.main_content}
                readMode={isEdit && issue.status_code === "50" && (issue.create_id !== sessionStorage.userEmail) && true}
              />
            </div>
          </div>
          <div className="box">
            <label>처리결과 내용</label>
            <div className="input-box">
              <ToastEditorResult
                html={issue.result_content}
              />
            </div>
          </div>
          <div className="box">
            <label>첨부파일</label>
            <div className="input-box">
              <FileManager
                Iuuid={issueKey ? issueKey : issue.uuid}
                edit={
                  (issue.status_code === "20" || issue.status_code === "") &&
                  true
                }
              />
            </div>
          </div>
          {isEdit && (
            <TicketComment
              uuid={issue.uuid}
              finish={issue.status_code}
            />
          )}
        </div>
      </div>
      {modalOpen === true && (
        <ChangeManager
          show={modalOpen}
          close={closeModal}
          manager={selectedManager}
        />
      )}
    </div>
  );
}
