import React, { useEffect, useState } from "react";
import {
  NotificationListItem,
  TextArea,
  Button,
  Label,
} from "@ui5/webcomponents-react";
import { v4 } from "uuid";
import api from "../utils/api";

import "../assets/styles/Common.css";
import "../assets/styles/TicketComment.css";

var Length = [];

function TicketComment(props) {
  const uuid = props.uuid ? props.uuid : null;
  const commentUuid = v4();
  const usertoken = sessionStorage.getItem("token");
  const [rerender, setRerender] = useState(false);
  const [getComments, setGetComments] = useState([]);
  const [comment, setComment] = useState({
    uuid: "",
    incident_uuid: uuid,
    writer: sessionStorage.userEmail,
    content: "",
    session_id: sessionStorage.userEmail,
  });

  useEffect(() => {
    //comment 호출
    commentList();
    setRerender(false);

    async function commentList() {
      const result = await api.getCommentList(uuid);
      if (result) {
        Length = result;
        setGetComments(result);
      }
    }
  }, [rerender, uuid, usertoken]);

  function commentHandler(e) {
    setComment({ ...comment, content: e.target.value });
  }

  async function addComment() {
    if (comment.content !== "") {
      //comment 등록 및 리렌더
      comment.uuid = commentUuid;
      const result = await api.postComment(comment);
      if (result) {
        comment.content = "";
        setRerender(true);
      }
    } else {
      alert("내용을 입력해주세요");
    }
  }

  async function deleteComment(uuid) {
    if (window.confirm("삭제하시겠습니까? 삭제된 내용은 복구할 수 없습니다.")) {
      const result = await api.deleteComment(uuid);
      if (result) {
        comment.content = "";
        setRerender(true);
      }
    }
  }

  return (
    <div className="box">
      <label>댓글</label>

      {/* <div className='comment-title'>댓글달기</div> */}
      {props.finish !== ("40" || "50") && (
        <div className="comment-input-container">
          <TextArea
            className="comment-input"
            name="content"
            value={comment.content}
            placeholder="댓글을 입력해주세요"
            onChange={commentHandler}
          />
          <Button className="comment-button" onClick={addComment}>
            댓글등록
          </Button>
        </div>
      )}

      {getComments.map((index, item) => (
        <NotificationListItem
          key={item}
          titleText={index.name}
          footnotes={
            <Label className="comment-label">{index.create_date}</Label>
          }
          showClose={
            index.writer === sessionStorage.userEmail &&
            props.finish !== ("30" || "40" || "50") &&
            true
          }
          onClose={(e) => {
            console.log(e);
            deleteComment(index.uuid);
          }}
        >
          {index.content}
        </NotificationListItem>
      ))}
      {/* <NotificationListItem className="comment-border" />
      <NotificationListItem className="comment-border" /> */}
    </div>
    // <div className="content">

    // </div>
  );
}

export default TicketComment;

export function commentLength() {
  if (Length.length > 0) {
    return Length.length;
  } else {
    return "0";
  }
}
