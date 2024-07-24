import React, { useEffect, useState } from "react";
import { DonutChart, ComposedChart } from "@ui5/webcomponents-react-charts";
import api from "../utils/api";

//css
import "../assets/styles/Chart.css";

function Progress() {
  const date = new Date();
  const [status, setStatus] = useState([
    {
      code: "10",
      count: 0,
    },
    {
      code: "20",
      count: 0,
    },
    {
      code: "30",
      count: 0,
    },
    {
      code: "40",
      count: 0,
    },
    {
      code: "50",
      count: 0,
    },
    {
      all: 0,
    },
  ]);

  const [module, setModule] = useState([
    {
      module: "EC",
      count: 0,
    },
    {
      module: "TIME-OFF",
      count: 0,
    },
    {
      module: "RCM/RMK",
      count: 0,
    },
    {
      module: "ONB/OFB",
      count: 0,
    },
    {
      module: "LMS",
      count: 0,
    },
    {
      module: "PMGM",
      count: 0,
    },
    {
      module: "C&B",
      count: 0,
    },
    {
      module: "Succession",
      count: 0,
    },
    {
      module: "Platform/기타",
      count: 0,
    },
    {
      all: 0,
    },
  ]);

  useEffect(() => {
    statusCount();
    moduleCount();

    async function statusCount() {
      const result = await api.statusCount();
      if (result) {
        for (let i = 0; i < result.length; i++) {
          if (result[i].status_code === "10") {
            setStatus([...status, (status[0].count = result[i].status_count)]);
          } else if (result[i].status_code === "20") {
            setStatus([...status, (status[1].count = result[i].status_count)]);
          } else if (result[i].status_code === "30") {
            setStatus([...status, (status[2].count = result[i].status_count)]);
          } else if (result[i].status_code === "40") {
            setStatus([...status, (status[3].count = result[i].status_count)]);
          } else if (result[i].status_code === "50") {
            setStatus([...status, (status[4].count = result[i].status_count)]);
          }
          setStatus([...status, (status[5].all = result[i].all_count)]);
        }
      }
    }

    async function moduleCount() {
      const result = await api.moduleCount();
      if (result) {
        for (let i = 0; i < result.length; i++) {
          if (result[i].module === "EC") {
            setModule([...module, (module[0].count = result[i].module_count)]);
          } else if (result[i].module === "TIME-OFF") {
            setModule([...module, (module[1].count = result[i].module_count)]);
          } else if (result[i].module === "RCM/RMK") {
            setModule([...module, (module[2].count = result[i].module_count)]);
          } else if (result[i].module === "ONB/OFB") {
            setModule([...module, (module[3].count = result[i].module_count)]);
          } else if (result[i].module === "LMS") {
            setModule([...module, (module[4].count = result[i].module_count)]);
          } else if (result[i].module === "PMGM") {
            setModule([...module, (module[5].count = result[i].module_count)]);
          } else if (result[i].module === "C&B") {
            setModule([...module, (module[6].count = result[i].module_count)]);
          } else if (result[i].module === "Succession") {
            setModule([...module, (module[7].count = result[i].module_count)]);
          } else if (result[i].module === "Platform/기타") {
            setModule([...module, (module[8].count = result[i].module_count)]);
          }
          setModule([...module, (module[9].all = result[i].all_count)]);
        }
      }
    }
  }, []);

  const status_data = [
    {
      name: "등록된 이슈",
      amount: parseInt(status[0].count),
    },
    {
      name: "진행중인 이슈",
      amount: parseInt(status[1].count),
    },
    {
      name: "진행완료된 이슈",
      amount: parseInt(status[2].count),
    },
    {
      name: "처리완료된 이슈",
      amount: parseInt(status[4].count),
    },
    {
      name: "취소된 이슈",
      amount: parseInt(status[3].count),
    },
  ];

  const module_data = [
    {
      name: "EC",
      계: parseInt(module[0].count),
    },
    {
      name: "TIME-OFF",
      계: parseInt(module[1].count),
    },
    {
      name: "RCM/RMK",
      계: parseInt(module[2].count),
    },
    {
      name: "ONB/OFB",
      계: parseInt(module[3].count),
    },
    {
      name: "LMS",
      계: parseInt(module[4].count),
    },
    {
      name: "PMGM",
      계: parseInt(module[5].count),
    },
    {
      name: "C&B",
      계: parseInt(module[6].count),
    },
    {
      name: "Succession",
      계: parseInt(module[7].count),
    },
    {
      name: "Platform/기타",
      계: parseInt(module[8].count),
    },
  ];

  return (
    <div className="chart-container">
      <div className="donut-wrapper">
        <DonutChart
          dataset={status_data}
          dimension={{
            accessor: "name",
          }}
          measure={{
            accessor: "amount",
            colors: ["#f45c41", "#28aae1", "#27437a", "#999999", "#cccccc"],
          }}
          noAnimation
          style={{ height: "100%", width: "100%" }}
          chartConfig={{
            legendHorizontalAlign: "left",
            legendPosition: "left",
          }}
        />
      </div>
      <div className="bar-wrapper">
        <div className="bar-description">
          {/* <p className="element-title">모듈별 접수건({date.getFullYear()})</p> */}
          <p className="element-title-sub">
            모듈별 접수건({date.getFullYear()}) Total: {module[9].all}
          </p>
        </div>
        <ComposedChart
          dataset={module_data}
          dimensions={[{ accessor: "name" }]}
          measures={[
            {
              accessor: "계",
              color: "#27437a",
              type: "bar",
              width: 50,
            },
          ]}
          noLegend
          noAnimation
          style={{ height: "100%", width: "100%", flex: "1 1 auto" }}
        />
      </div>
    </div>
  );
}

export default Progress;
