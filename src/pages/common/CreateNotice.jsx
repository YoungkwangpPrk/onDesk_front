import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { v4 } from "uuid";

//ui5
import { FlexBox, Input } from "@ui5/webcomponents-react";
import "@ui5/webcomponents-icons/dist/AllIcons";

import PageInfo from "../../components/PageInfo";
import TicketElement from "../../components/TicketElements";
import { inactiveStore } from "../../InactiveStore";
import TextEditor from "../../components/TextEditor";
import FileManager from "../../components/FileManager";
import { FileDBUpdate } from "../../components/FileManager";
import FloatingBar from "../../components/FloatingBar";

import api from "../../utils/api";

import "../../assets/styles/Common.css";
import "../../assets/styles/Board.css";
import ToastEditor from "../../components/ToastEditor";
import Loading from "../../components/Loading";

function CreateNotice() {
  const navigate = useNavigate();
  const location = useLocation();
  const uuid = v4();
  const noticeKey = location.state?.uuid;
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [board, setBoard] = useState({
    uuid: uuid,
    title: "",
    content: "",
    session_id: sessionStorage.userEmail,
    create_date: null,
    open_date: null,
    close_date: null,
  });

  useEffect(() => {
    if (noticeKey !== undefined) {
      setIsLoading(true);
      getBoard();
    }
  }, []);

  async function getBoard() {
    const result = await api.getBoard(noticeKey);
    if (result) {
      console.log(result);
      setBoard({
        uuid: result[0].uuid,
        title: result[0].title,
        content: result[0].content,
        session_id: result[0].create_id,
        open_date: result[0].open_date,
        close_date: result[0].close_date,
      });
      setIsLoading(false);
    }
  }

  function inputHandler(e) {
    setBoard({ ...board, [e.target.name]: e.target.value });
  }

  function openDate(data) {
    setBoard({ ...board, open_date: data.detail.value });
  }

  function closeDate(data) {
    setBoard({ ...board, close_date: data.detail.value });
  }

  //CUD
  function createNotice() {
    const editorState = inactiveStore.editor;
    board.content = editorState;
    console.log(board.content);
    const attachedFiles = FileDBUpdate();
    console.log(
      "🚀 ~ file: CreateNotice.jsx:161 ~ createNotice ~ attachedFiles:",
      attachedFiles
    );
    board.file_info = attachedFiles;
    console.log("board", board);
    const result = api.createNotice(board);
    if (result) {
      navigate("/board");
    }
  }

  function updateNotice() {
    const editorState = inactiveStore.editor;
    const editedContent = editorState;
    board.content = editedContent;
    console.log(board.content);
    const attachedFiles = FileDBUpdate();
    board.file_info = attachedFiles;
    const result = api.updateNotice(noticeKey, board);
    if (result) {
      navigate("/board");
    }
  }

  function deleteNotice() {
    if (window.confirm("삭제하시겠습니까?")) {
      const result = api.deleteNotice(noticeKey);
      if (result) {
        navigate("/board");
      }
    }
  }

  return (
    <div className="full-box">
      {isLoading === true && <Loading />}

      {isEdit === true || noticeKey === undefined ? (
        <FloatingBar
          SaveBtn={isEdit === true ? updateNotice : createNotice}
          CancelBtn={() => {
            setIsEdit(false);
            navigate(-1);
          }}
        />
      ) : (
        sessionStorage.company_account === "com4in" && (
          <FloatingBar
            EditBtn={() => setIsEdit(true)}
            DeleteBtn={deleteNotice}
          />
        )
      )}
      <div className="fix">
        <div className="page-header">
          <PageInfo main="공지사항" sub="상세" path="/board" />
        </div>
        {!isEdit && noticeKey ? (
          <div className="form-box">
            <label>
              <span>공지 시작일</span>
              <span>{board.open_date || "-"}</span>
            </label>
            <label>
              <span>공지 종료일</span>
              <span>{board.close_date || "-"}</span>
            </label>
          </div>
        ) : (
          <div className="form-box">
            <TicketElement
              id="open_date"
              title="공지시작일"
              name="open_date"
              content={board.open_date}
              func={openDate}
              finish={!isEdit && noticeKey !== undefined && true}
            />
            <TicketElement
              id="close_date"
              title="공지종료일"
              name="close_date"
              content={board.close_date}
              func={closeDate}
              finish={!isEdit && noticeKey !== undefined && true}
            />
          </div>
        )}

        {/*  */}
        <div className="editor-box">
          <div className="box">
            <label>제목</label>
            <div className="input-box">
              {
                // create
                (!isEdit === true && !noticeKey === true) ||
                // edit
                (!isEdit === false && !noticeKey === false) ? (
                  <Input
                    className="input"
                    placeholder="제목"
                    maxlength="40"
                    value={board.title}
                    name="title"
                    disabled={false}
                    onChange={inputHandler}
                  />
                ) : (
                  <Input
                    className="input"
                    placeholder="제목"
                    maxlength="40"
                    value={board.title}
                    name="title"
                    disabled={true}
                    onChange={inputHandler}
                  />
                )
              }
            </div>
          </div>
          <div className="box">
            <label>내용</label>
            <div className="input-box">
              {
                // create
                (!isEdit === true && !noticeKey === true) ||
                // edit
                (!isEdit === false && !noticeKey === false) ? (
                  <ToastEditor html={board.content} loading={isLoading} />
                ) : (
                  <ToastEditor
                    html={board.content}
                    readMode={true}
                    loading={isLoading}
                  />
                )
              }
            </div>
          </div>
          <div className="box">
            <label>첨부파일</label>
            <FileManager
              Buuid={noticeKey ? noticeKey : board.uuid}
              edit={isEdit === false && noticeKey !== undefined ? false : true}
            />
          </div>
        </div>
      </div>
      {/* <FlexBox className="content board-date">
        <TicketElement
          id="open_date"
          title="공지시작일"
          name="open_date"
          content={board.open_date}
          func={openDate}
          finish={!isEdit && noticeKey !== undefined && true}
        />
        <TicketElement
          id="close_date"
          title="공지종료일"
          name="close_date"
          content={board.close_date}
          func={closeDate}
          finish={!isEdit && noticeKey !== undefined && true}
        />
      </FlexBox> */}
      {/* <div className="content board-section">
        <span className="title">제목</span>
        {isEdit === true ? (
          <Input
            className="input"
            placeholder="제목"
            maxlength="40"
            value={board.title}
            name="title"
            onChange={inputHandler}
          />
        ) : noticeKey !== undefined ? (
          <span className="title">{board.title}</span>
        ) : (
          <Input
            className="input"
            placeholder="제목"
            maxlength="40"
            value={board.title}
            name="title"
            onChange={inputHandler}
          />
        )}
        <span className="title">내용</span>
        {isEdit === true ? (
          <ToastEditor html={board.content} loading={isLoading} />
        ) : // <TextEditor html={board.content}/>
        noticeKey !== undefined ? (
          <ToastEditor
            html={board.content}
            readMode={true}
            loading={isLoading}
          />
        ) : (
          // <TextEditor html={board.content} readMode={true}/>
          <ToastEditor loading={isLoading} />
          // <TextEditor />
        )}
      </div> */}
    </div>
  );
}

export default CreateNotice;
