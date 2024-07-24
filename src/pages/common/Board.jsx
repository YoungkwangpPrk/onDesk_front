import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

//ui5
import {
  AnalyticalTable
} from "@ui5/webcomponents-react";
import "@ui5/webcomponents-icons/dist/AllIcons";

//component
import PageInfo from "../../components/PageInfo";
import Loading from "../../components/Loading";
import api from "../../utils/api";

//css
import "../../assets/styles/Common.css";
import "../../assets/styles/Board.css";

function Board(props) {
  const navigate = useNavigate();
  const [boardList, setBoardList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  //get notices
  useEffect(() => {
    setIsLoading(true);
    if (props.main === true || sessionStorage.company_account !== "com4in") {
      getBoardList();
    } else if (sessionStorage.company_account === "com4in") {
      getBoardListComforin();
    }

    async function getBoardListComforin() {
      const result = await api.getBoardListComforin();
      if (result) {
        setBoardList(result);
      }
      setIsLoading(false)
    }

    async function getBoardList() {
      const result = await api.getBoardListMain();
      if (result) {
        setBoardList(result);
      }
      setIsLoading(false)
    }
  }, [props.main]);

  const tableData = new Array(boardList.length).fill(null).map((_, index) => {
    return {
      name: boardList[index].uuid,
      title: boardList[index].title, //제목
      create_name: boardList[index].create_name, //작성자
      create_date: boardList[index].create_date, //작성일
      notice_dates:
        boardList[index].open_date + " ~ " + boardList[index].close_date,
    };
  });

  const tableColumns = [
    // {
    //   Header: "순번",
    //   accessor: "name" // String-based value accessors!
    // },
    {
      Header: "제목",
      accessor: "title",
    },
    {
      Header: "작성자",
      accessor: "create_name",
    },
    {
      Header: "작성일",
      accessor: "create_date",
      hAlign: "Center",
    },
    {
      Header: "공지일",
      accessor: "notice_dates",
      hAlign: "Center",
    },
  ];

  const handleProgressHeaderClick = () => {
    navigate("/board/new");
  };

  const readBoard = (uuid) => {
    navigate("/board/new", { state: { uuid: uuid } });
  };

  return props.main === true ? (
    <ul className="board-on-main">
      {boardList.map((item, index) => (
        <li key={index}>
          {/* <Icon name='marketing-campaign' className='notice-icon' /> */}
          <div
            className="board-on-main-content"
            onClick={() => readBoard(item.uuid)}
          >
            <div>{item.title}</div>
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <div className="full-box">
      {isLoading === true && <Loading />}
      <div className="fix">
        <div className="page-header">
          {props.main === true ? (
            <div className="element-title">공지사항</div>
          ) : (
            <PageInfo main="공지사항" />
          )}
          <div className="wing">
            {sessionStorage.company_account === "com4in" && (
              <button className="button" onClick={handleProgressHeaderClick}>
                생성
              </button>
            )}
            {/* <button onClick={addRow} className="button">
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
          </button> */}
          </div>
        </div>
        <div className="table-box white">
          <AnalyticalTable
            filterable
            data={tableData}
            columns={tableColumns}
            minRows={1}
            visibleRows={props.main === true ? 1 : 10}
            scaleWidthMode="Smart"
            onRowClick={(e) => readBoard(e.detail.row.original.name)}
            visibleRowCountMode="Auto"
          />
        </div>
      </div>

      {/* <FlexBox className="table-header">
        {props.main === true ? (
          <div className="element-title">공지사항</div>
        ) : (
          <PageInfo main="공지사항" />
        )}
        {props.main === true ? (
          <div className="common-button" onClick={() => navigate("/board")}>
            전체보기 {">"}
          </div>
        ) : (
          sessionStorage.company_account === "com4in" && (
            <Button
              className="common-button header-button-align"
              onClick={handleProgressHeaderClick}
            >
              생성
            </Button>
          )
        )}
      </FlexBox> */}
    </div>
  );
}

export default Board;
