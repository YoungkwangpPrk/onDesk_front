import React, { useEffect, useState } from "react";
import { Avatar, FileUploader, Text } from "@ui5/webcomponents-react";
import { v4 } from "uuid";
import uploadIcon from "@ui5/webcomponents-icons/dist/upload";
import api from "../utils/api";

import "../assets/styles/Common.css";
import "../assets/styles/FileManager.css";

let AllFiles = [];

function FileManager(props) {
  const noticeUuid = props.Buuid ? props.Buuid : "";
  const incidentUuid = props.Iuuid ? props.Iuuid : "";
  const fileUuid = v4();
  const [file, setFile] = useState([]);

  useEffect(() => {
    AllFiles = [];
    if (props.Buuid) {
      getBoardInfo();
    } else if (props.Iuuid) {
      getIncidentInfo();
    }

    async function getBoardInfo() {
      const result = await api.getBoardFiles(noticeUuid);
      if (result) {
        setFiles(result);
      }
    }

    async function getIncidentInfo() {
      const result = await api.getIncidentFiles(incidentUuid);
      if (result) setFiles(result);
    }

    function setFiles(data) {
      console.log(data);
      setFile(Array.from(data));
      AllFiles = Array.from(data);
      console.log(AllFiles);
    }
  }, [noticeUuid, props.Buuid, props.Iuuid, incidentUuid]);

  const fileCheck = (event) => {
    if (AllFiles.length === 5) {
      alert("파일은 최대 5개까지만 첨부 가능합니다");
      return;
    } else {
      uploadFiles(event);
    }
  };

  async function uploadFiles(event) {
    const limit = 8388608;
    const fileType = event.target.files[0].type;
    if(fileType !== "image/jpeg" && fileType !== "image/png" && fileType !== "image/jpg" && fileType !== "application/pdf") {
      alert(`지원하지 않는 형식입니다. \n지원하는 파일 형식: *.jpeg, *.jpg, *.png`);
      return;
    }
    if(event.target.files[0].size > limit){
      alert('8MB미만의 파일만 업로드 가능합니다.');
      return; 
    }
    console.log(event);
    const formdata = new FormData();
    formdata.append("file", event.target.files[0]);
    formdata.append("uuid", fileUuid);
    formdata.append("path", "itsm_files");
    console.log(formdata.get("file"));
    const result = await api.uploadFile(formdata, fileType);
    if (result) {
      setFile([
        {
          uuid: fileUuid,
          file_name: event.target.files[0].name,
        },
        ...file,
      ]);
      AllFiles.push({
        uuid: fileUuid,
        board_uuid: noticeUuid,
        incident_uuid: incidentUuid,
        session_id: sessionStorage.userEmail,
      });
      document.getElementById("fileInput").value = "";
    }
  }

  async function downloadFiles(item) {
    console.log(item);
    const result = await api.downloadFile(item);
    if (result) {
      console.log(result);
      console.log("dat", result.data);
      const href = URL.createObjectURL(result.data);
      console.log("href", href);
      const link = document.createElement("a");
      console.log(link);
      link.href = href;
      link.setAttribute("download", item.file_name);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    }
  }

  async function deleteFile(item) {
    const result = await api.deleteFile(item);
    if (result) {
      console.log(result);
      for (let i = 0; i < AllFiles.length; i++) {
        if (item.uuid === AllFiles[i].uuid) {
          const x = AllFiles[i];
          AllFiles.splice(x, 1);
        }
      }
      const dele = Array.from(file);
      dele.splice(dele.indexOf(item), 1);
      setFile(dele);
      console.log("afterdelete", AllFiles);
    }
  }

  return (
    // <div className="file-container content">
    <div className="input-box">
      {props.edit === true ? (
        <FileUploader
          id="fileInput"
          hideInput
          className="upload-button"
          onChange={fileCheck}
        >
          <button className="button">
            파일 업로드<i className="las la-angle-right"></i>
          </button>
          {/* <Button>파일 업로드</Button> */}
        </FileUploader>
      ) : (
        ""
        // <div className="container-title">첨부파일목록</div>
      )}
      <div className="file-box">
        <div className="files-align">
          {file.map((item, index) => (
            <div key={index} className="files">
              <span
                onMouseOver={(e) => (e.target.style.color = "blue")}
                onMouseOut={(e) => (e.target.style.color = "black")}
                onClick={() => downloadFiles(item)}
              >
                {item.file_name}
              </span>
              {(props.edit === true ||
                item.update_id === sessionStorage.userEmail) && (
                <button onClick={() => deleteFile(item)}>X</button>
              )}
            </div>
          ))}
        </div>
        {file.length === 0 && props.edit === true && (
          <div className="box-content">
            {/* <FileUploader
              id="fileInput"
              hideInput
              onChange={fileCheck}
            >
              <Avatar icon={uploadIcon} />
            </FileUploader> */}
            <Text>파일을 업로드 해주세요</Text>
          </div>
        )}
      </div>
    </div>
  );
}

export default FileManager;

export function FileDBUpdate() {
  // console.log(AllFiles)
  // axios.patch('/file/fileUpdate', AllFiles[0], {
  //   headers: {
  //     Authorization: `Bearer ${sessionStorage.token}`
  //   }
  // })
  // .then(res => {
  //   console.log("🚀 ~ file: FileManager.jsx:110 ~ FileUpload ~ res:", res)
  //   AllFiles = []
  // })
  // .catch(err => {
  //   console.log("🚀 ~ file: FileManager.jsx:115 ~ FileUpload ~ err:", err)
  //   AllFiles = []
  // })
  return AllFiles;
}
