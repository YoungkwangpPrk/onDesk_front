import React from "react";
import { Bar, button } from "@ui5/webcomponents-react";

import "../assets/styles/FloatingBar.css";
import "../assets/styles/Common.css";

function FloatingBar({
  DeleteBtn,
  EditBtn,
  SubmitBtn,
  SaveBtn,
  ReSubmitBtn,
  ChangeManager,
  ReceiveBtn,
  CancelBtn,
  CompleteBtn,
  ApproveBtn,
}) {
  return (
    <div className="bar-container">
      {DeleteBtn && (
        <button onClick={DeleteBtn} className="button cont">
          삭제<i className="las la-angle-right"></i>
        </button>
      )}
      {CancelBtn && (
        <button onClick={CancelBtn} className="button cont">
          취소<i className="las la-angle-right"></i>
        </button>
      )}
      {ChangeManager && (
        <button onClick={ChangeManager} className="button cont">
          담당자 변경<i className="las la-angle-right"></i>
        </button>
      )}
      {ReceiveBtn && (
        <button onClick={ReceiveBtn} className="button ">
          접수<i className="las la-angle-right"></i>
        </button>
      )}
      {EditBtn && (
        <button onClick={EditBtn} className="button ">
          수정<i className="las la-angle-right"></i>
        </button>
      )}
      {SubmitBtn && (
        <button onClick={SubmitBtn} className="button">
          등록<i className="las la-angle-right"></i>
        </button>
      )}
      {SaveBtn && (
        <button onClick={SaveBtn} className="button ">
          저장<i className="las la-angle-right"></i>
        </button>
      )}
      {CompleteBtn && (
        <button onClick={CompleteBtn} className="button ">
          진행완료<i className="las la-angle-right"></i>
        </button>
      )}
      {ReSubmitBtn && (
        <button onClick={ReSubmitBtn} className="button cont">
          재등록<i className="las la-angle-right"></i>
        </button>
      )}
      {ApproveBtn && (
        <button onClick={ApproveBtn} className="button ">
          처리완료<i className="las la-angle-right"></i>
        </button>
      )}
    </div>
  );

  return (
    <Bar
      className="bar-container"
      design="Footer"
      endContent={
        <div className="end-content">
          {DeleteBtn && (
            <button onClick={DeleteBtn} className="button">
              삭제
            </button>
          )}
          {CancelBtn && (
            <button onClick={CancelBtn} className="button">
              취소
            </button>
          )}
          {ChangeManager && (
            <button onClick={ChangeManager} className="button">
              담당자 변경
            </button>
          )}
          {ReceiveBtn && (
            <button onClick={ReceiveBtn} className="button ">
              접수
            </button>
          )}
          {EditBtn && (
            <button onClick={EditBtn} className="button ">
              수정
            </button>
          )}
          {SubmitBtn && (
            <button onClick={SubmitBtn} className="button ">
              등록
            </button>
          )}
          {SaveBtn && (
            <button onClick={SaveBtn} className="button ">
              저장
            </button>
          )}
          {CompleteBtn && (
            <button onClick={CompleteBtn} className="button ">
              진행완료
            </button>
          )}
          {ReSubmitBtn && (
            <button onClick={ReSubmitBtn} className="button">
              재등록
            </button>
          )}
          {ApproveBtn && (
            <button onClick={ApproveBtn} className="button ">
              처리완료
            </button>
          )}
        </div>
      }
    />
  );
}

export default FloatingBar;
