import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//ui5
import { AnalyticalTable } from "@ui5/webcomponents-react";

import PageInfo from "../../components/PageInfo";
import Loading from "../../components/Loading";
import api from "../../utils/api";

//css
import "../../assets/styles/Common.css";

function ComIssueList(props) {
  const navigate = useNavigate();
  const [mainList, setMainList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    if (props.main === true) {
      getManagerIssue();
    } else {
      getTableData();
    }

    async function getTableData() {
      const result = await api.getIssue(sessionStorage.company_account);
      if (result) {
        setMainList(result);
      }
      setIsLoading(false);
    }

    async function getManagerIssue() {
      const result = await api.getManagerIssue(sessionStorage.userEmail);
      if (result) {
        setMainList(result);
      }
      setIsLoading(false);
    }
  }, [props.main]);

  const handleProgressHeaderClick = () => {
    navigate("/com4in/detail/:id");
  };

  const showList = () => {
    navigate("/com4in/list");
  };

  function readIssue(e) {
    const issueId = e.detail.row.original.name;
    navigate(`/com4in/detail/${issueId}`, { state: { uuid: issueId } });
  }

  const tableData = new Array(mainList.length).fill(null).map((_, index) => {
    return {
      name: mainList[index].uuid,
      title: mainList[index].title, //제목
      company_name: mainList[index].company_name, //고객사
      req_type: mainList[index].req_type, //요청유형
      inquirer: mainList[index].inquirer, //문의자
      manager: mainList[index].manager_name, //담당자
      status: mainList[index].status, //진행상태
      create_date: mainList[index].create_date,
      comp_req_date: mainList[index].comp_req_date, //완료요청일
      comp_date: mainList[index].comp_date, //완료일
      module: mainList[index].module, //관련모듈
    };
  });

  const tableColumns = [
    // {
    //   Header: "순번",
    //   accessor: "name", // String-based value accessors!
    // },
    {
      PopInHeader: "제목",
      Header: "제목",
      accessor: "title",
    },
    {
      responsivePopIn: true,
      responsiveMinWidth: 401,
      Header: "고객사",
      accessor: "company_name",
    },
    {
      responsivePopIn: false,
      responsiveMinWidth: 601,
      Header: "유형",
      accessor: "req_type",
    },
    {
      responsivePopIn: true,
      responsiveMinWidth: 100,
      Header: "접수자",
      accessor: "inquirer",
    },
    {
      responsivePopIn: false,
      responsiveMinWidth: 601,
      Header: "담당자",
      accessor: "manager",
    },
    {
      responsivePopIn: true,
      responsiveMinWidth: 100,
      Header: "진행상태",
      accessor: "status",
      hAlign: "Center",
    },
    {
      responsivePopIn: false,
      responsiveMinWidth: 601,
      Header: "등록일",
      accessor: "create_date",
      hAlign: "Center",
    },
    {
      responsivePopIn: false,
      responsiveMinWidth: 601,
      Header: "완료요청일",
      accessor: "comp_req_date",
      hAlign: "Center",
    },
    {
      Header: "완료일",
      accessor: "comp_date",
      hAlign: "Center",
    },
    // {
    //   Cell: (instance) => {
    //     const { row, webComponentsReactProperties } = instance;
    //     // disable buttons if overlay is active to prevent focus
    //     const isOverlay = webComponentsReactProperties.showOverlay;
    //     // console.log('This is your row data', row.original);
    //     return (
    //       <Button
    //         icon="feeder-arrow"
    //         style={{ border: "none" }}
    //         disabled={isOverlay}
    //         onClick={() => {
    //           navigate("/com4in/detail", {
    //             state: { uuid: row.original.name },
    //           });
    //         }}
    //       />
    //     );
    //   },
    //   disableFilters: true,
    //   disableGroupBy: true,
    //   disableResizing: true,
    //   disableSortBy: true,
    //   id: "actions",
    //   width: 40,
    // },
  ];

  return (
    <div className="full-box">
      {isLoading === true && <Loading />}
      <div className="fix">
        {!props.main && (
          <div className="page-header">
            <PageInfo main="이슈목록" />
            <div className="wing">
              <button onClick={handleProgressHeaderClick} className="button">
                생성
                <i className="las la-angle-right"></i>
              </button>
            </div>
          </div>
        )}

        <div className={`${props.main === true ? "table" : "table-box white"}`}>
          <AnalyticalTable
            filterable
            data={tableData}
            columns={tableColumns}
            visibleRows={props.main === true ? 5 : 15}
            scaleWidthMode="Smart"
            onRowClick={readIssue}
            visibleRowCountMode={props.main === true ? "Fixed" : "Auto"}
          />
        </div>
      </div>

      {/* 


        {props.main === true ? 

        
        (
          <div className="element-title">내 이슈목록</div>
        ) : (
          <PageInfo main="이슈목록" />
        )}
        {props.main === true ? (
          <Button className="common-button" onClick={showList}>
            전체보기
          </Button>
        ) : (
          <Button
            className="common-button header-button-align"
            onClick={handleProgressHeaderClick}
          >
            생성
          </Button>
        )} */}
    </div>
  );
}

export default ComIssueList;
