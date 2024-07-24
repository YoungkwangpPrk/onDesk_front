import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageInfo from "../../components/PageInfo";
import api from "../../utils/api";

//ui5
import { Button, FlexBox, AnalyticalTable } from "@ui5/webcomponents-react";

//css
import "../../assets/styles/Details.css";
import "../../assets/styles/Common.css";

function CompanyList() {
  const navigate = useNavigate();
  const [mainList, setMainList] = useState([]);

  useEffect(() => {
    getTableData();

    //comapnylist 조회
    async function getTableData() {
      const result = await api.getCompanyList();
      if (result) {
        setMainList(result);
      }
    }
  }, []);

  const handleProgressHeaderClick = () => {
    navigate("/admin/companyMember");
  };

  const getCompanyInfo = async (e) => {
    const result = await api.getCompanyInfo(
      e.detail.row.original.company_account
    );
    if (result) {
      navigate("/admin/companyMember", {
        state: { company_account: result[0].company_account },
      });
    }
  };

  const tableData = new Array(mainList.length).fill(null).map((_, index) => {
    return {
      name: mainList[index].pk,
      company: mainList[index].company_name, //고객사
      company_account: mainList[index].company_account, //관련모듈
    };
  });

  const tableColumns = [
    {
      Header: "고객사",
      accessor: "company",
    },
    {
      Header: "계정",
      accessor: "company_account",
    },
  ];

  return (
    <div className="full-box">
      <div className="fix">
        <div className="page-header">
          <PageInfo main="고객사" />
          <div className="wing">
            <button onClick={handleProgressHeaderClick} className="button">
              생성
              <i className="las la-angle-right"></i>
            </button>
          </div>
        </div>
        <div className="table-box white">
          <AnalyticalTable
            data={tableData}
            columns={tableColumns}
            visibleRows={15}
            scaleWidthMode="Smart"
            onRowClick={getCompanyInfo}
            visibleRowCountMode="Auto"
          />
        </div>
      </div>
    </div>
  );
}

export default CompanyList;
