import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnalyticalTable } from "@ui5/webcomponents-react";

import PageInfo from "../../components/PageInfo";
import api from "../../utils/api";

import "../../assets/styles/Common.css";

function MailTemplateList() {
  const navigate = useNavigate();
  const [templateList, setTemplateList] = useState([]);

  useEffect(() => {
    //템플릿 목록 조회
    getTemplate();
  }, []);

  async function getTemplate() {
    const result = await api.getTemplate();
    setTemplateList(Array.from(result));
  }

  const readTemplate = async (e) => {
    const uuid = e.detail.row.original.uuid;
    const result = await api.readTemplate(uuid);
    if (result) {
      navigate("/admin/mailTemplate", { state: { uuid: uuid } });
    }
  };

  const tableData = new Array(templateList.length)
    .fill(null)
    .map((_, index) => {
      return {
        uuid: templateList[index].uuid,
        status_code: templateList[index].status_code,
        title: templateList[index].title, //제목
        status_name: templateList[index].status_name
      };
    });

  const tableColumns = [
    // {
    //   Header: "uuid",
    //   accessor: "uuid"
    // },
    {
      Header: "상태코드",
      accessor: "status_code",
    },
    {
      Header: "상태값",
      accessor: "status_name"
    },
    {
      Header: "제목",
      accessor: "title",
    },
  ];

  return (
    <div className="full-box">
      <div className="fix">
        <div className="page-header">
          <PageInfo main="메일 템플릿" />
        </div>
        <div className="table-box white">
          {/* {templateList.length === 0 && <><h1 style={{paddingBottom: 20}}>새 템플릿을 등록해 주세요</h1>
        <Button className='common-button' onClick={() => navigate('/admin/mailTemplate')}>템플릿 등록</Button></>} */}
          <AnalyticalTable
            filterable
            data={tableData}
            columns={tableColumns}
            minRows={1}
            visibleRows={15}
            loading={templateList.length === 0 && true}
            scaleWidthMode="Smart"
            onRowClick={readTemplate}
            visibleRowCountMode="Auto"
          />
        </div>
      </div>
    </div>
  );
}

export default MailTemplateList;
