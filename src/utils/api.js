import axios from 'axios';

const BASE_URL = 'http://121.66.27.174:8887/api';
const LOCAL_URL = 'http://localhost:8887/api';

axios.defaults.baseURL = BASE_URL;
// axios.defaults.baseURL = LOCAL_URL;
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

function config () {
  return {headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${sessionStorage.token}`,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Method': 'POST, OPTIONS, GET, DELETE, PATCH, UPDATE'
  }};
};

const api =  {
  //로그인
  login:  function(userInfo) {
    return axios.post('/user/authenticate', userInfo)
      .then(res => {return res})
      .catch(err => {
        if(err.response) {
          console.log(err);
          return alert(err.response.data.message);
        } else {
          console.log(err);
          return alert('관리자에게 문의해주세요');
        }
      });
  },

  //비밀번호 변경
  changePassword: function (userDto) {
    return axios.post('/user/changePassword', userDto, config())
      .then(res => {return res})
      .catch(err => {return alert(err.response.status + ' ' + err.response.statusText)});
  },

  //상태코드호출
  commonCode: function() {
    return axios.get('/common/getcode', config())
      .then((res) =>{
        return res.data.detail;
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
  },

  //회사별 사용자 리스트 호출
  getUserList: function (company_account) {
    return  axios.get(`/user/read/${company_account}`, config())
      .then(res => {return res.data.detail})
      .catch(err => {return alert(err.response.status + ' ' + err.response.statusText)});
  },

  //컴포인 사원 비밀번호 초기화
  resetPassword: function (data) {
    return axios.post('/user/changePassword', data, config())
      .then(res => {return res})
      .catch(err => {return alert(err.response.status + ' ' + err.response.statusText)});
  },

  //고객사
  //고객사 리스트 호출
  getCompanyList: function () {
    return axios.get('/company/getCompanyList', config())
      .then(res => {return res.data.detail})
      .catch(err => {return alert(err.response.status + ' ' + err.response.statusText)});
  },

  //고객사 정보 호출
  getCompanyInfo: function (company_account) {
    return axios.get(`/company/getCompany/${company_account}`, config())
      .then(res => {return res.data.detail})
      .catch(err => {return alert(err.response.status + ' ' + err.response.statusText)});
  },

  //고객사 생성/저장
  addCompany: function (company) {
    return axios.post('/company/create', company, config())
      .then(res => {return res})
      .catch(err => {return alert(err.response.status + ' ' + err.response.statusText)});
  },

  //고객사 정보 업데이트
  updateCompany: function (company) {
    return axios.patch('/company/updateCompany', company, config())
      .then(res => {return res})
      .catch(err => {return alert(err.response.status + ' ' + err.response.statusText)});
  },

  //고객사, 컴포인 사원정보 등록 및 목록 업데이트
  saveCompanyMember: function (data) {
    return axios.post('/user/create', data, config())
      .then(res => {return res})
      .catch(err => {return alert(err.response.status + ' ' + err.response.statusText)});
  },

  //고객사 삭제
  deleteCompany: function (company_account) {
    return axios.delete(`/company/deleteCompany/${company_account}`, config())
      .then(res => {return res})
      .catch(err => {return alert(err.response.status + ' ' + err.response.statusText)});
  },

  //이슈
  //접수자기준 이슈목록 호출
  getMyIssue: function (userEmail) {
    return axios.get(`/issue/inquirerList/${userEmail}`, config())
      .then(res => {return res.data.detail})
      .catch(err => {return alert(err.response.status + ' ' + err.response.statusText)});
  },

  //컴포인 유저기준 이슈목록 호출
  getManagerIssue: function (userEmail) {
    return axios.get(`/issue/managerList/${userEmail}`, config())
      .then(res => {return res.data.detail})
      .catch(err => {return alert(err.response.status + ' ' + err.response.statusText)});
  },

  //이슈 전체목록 호출
  getIssue: function (company_account) {
    return axios.get(`/issue/mainList/${company_account}`, config())
      .then(res => {return res.data.detail})
      .catch(err => {return alert(err.response.status + ' ' + err.response.statusText)});
  },

  //이슈 세부내용 호출
  getIssueDetail: function (issueKey) {
    return axios.get(`/issue/mainDetail/${issueKey}`, config())
      .then(res => {return res.data.detail})
      .catch(err => {return alert(err.response.status + ' ' + err.response.statusText)});
  },

  //이슈 댓글
  //댓글 목록 호출
  getCommentList: function (uuid) {
    return axios.get(`/comment/getComment/${uuid}`, config())
      .then(res => {return res.data.detail})
      .catch(err => {return alert(err.response.status + ' ' + err.response.statusText)});
  },

  //이슈 생성
  createIssue: function (issue) {
    return axios.post('/issue/create', issue, config())
      .then(res => {return res;})
      .catch(err => {return alert('등록중 오류가 발생하였습니다. 다시 시도해주세요')});
  },

  //이슈 수정
  updateIssue: function (issue) {
    return axios.patch('/issue/update', issue, config())
      .then(res => {return res;})
      .catch(err => {return alert('오류가 발생하였습니다. 다시 시도해주세요')});
  },
  
  //상태 업데이트
  updateStatus: function (status, issue) {
    return axios.post(`/issue/updateStatus/${status}`, issue, config())
      .then(res => {return res;})
      .catch(err => {return alert('오류가 발생하였습니다. 다시 시도해주세요')});
  },

  //이슈 삭제
  deleteIssue: function (issueKey) {
    return axios.delete(`/issue/delete/${issueKey}`, config())
      .then(res => {return res;})
      .catch(err => {return alert('오류가 발생하였습니다. 다시 시도해주세요')});
  },

  //댓글 등록
  postComment: function (comment) {
    return axios.post('/comment/create', comment, config())
      .then(res => {return res})
      .catch(err => {return alert(err.response.status + ' ' + err.response.statusText)});
  },

  //댓글 삭제
  deleteComment: function(uuid) {
    return axios.delete(`/comment/deleteComment/${uuid}`, config())
      .then(res => {return res})
      .catch(err => {return alert(err.response.status + ' ' + err.response.statusText)});
  },

  //공지사항
  //대시보드에서 혹은 고객이 공지사항 목록 호출
  getBoardListMain: function () {
    return axios.get('/board/selectList', config())
      .then(res => {
        return res.data.detail;
      })
      .catch(err => {return alert(err.response.status + ' ' + err.response.statusText)});
  },
  
  //컴포인 사원이 공지사항 목록 호출
  getBoardListComforin: function () {
    return axios.get('/board/selectListCom4in', config())
      .then(res => {return res.data.detail;})
      .catch(err => {return  alert(err.response.status + ' ' + err.response.statusText)});
  },

  //공지사항 내용 호출
  getBoard: function (noticeKey) {
    return axios.get(`/board/selectDetail/${noticeKey}`, config())
      .then(res => {return res.data.detail})
      .catch(err => {return alert(err.response.status + ' ' + err.response.statusText)});
  },

  //공지사항 등록
  createNotice: function (board) {
    return axios.post('/board/create', board, config())
    .then(res => {return res;})
    .catch(err => {return  alert(err.response.status + ' ' + err.response.statusText)});
  },

  //공지사항 업데이트
  updateNotice: function (noticeKey, board) {
    return axios.patch(`/board/update/${noticeKey}`, board, config())
    .then(res => {return res;})
    .catch(err => {return  alert(err.response.status + ' ' + err.response.statusText)});
  },

  //공지사항 삭제
  deleteNotice: function(noticeKey) {
    return axios.delete(`/board/delete/${noticeKey}`, config())
      .then(res => { return res;})
      .catch(err => {return  alert(err.response.status + ' ' + err.response.statusText)});
  },


  //메일 템플릿
  //템플릿 리스트
  getTemplate: function() {
    return axios.get('/mail/getMailTemplateList', config())
      .then(res => {return res.data.detail})
      .catch(err => {return err});
  },

  //템플릿 세부
  readTemplate: function(uuid) {
    return axios.get(`/mail/getMailTemplateDetail/${uuid}`, config())
      .then(res => {return res.data.detail})
      .catch(err => {return alert(err.response.status + ' ' + err.response.statusText)});
  },

  //템플릿 내용 업데이트
  updateTemplate: function(template) {
    return axios.patch('/mail/updateMailTemplate', template, config())
      .then(res => {return res})
      .catch(err => {return alert(err.response.status + ' ' + err.response.statusText)});
  },

  //대시보드 차트
  statusCount: function () {
    return axios.get(`/dashboard/status_count/${sessionStorage.company_account}`, config())
      .then(res => {return res.data.detail})
      .catch(err => {return alert(err.response.status + ' ' + err.response.statusText)});
  },

  moduleCount: function () {
    return axios.get(`/dashboard/module_count/${sessionStorage.company_account}`, config())
      .then(res => {return res.data.detail})
      .catch(err => {return alert(err.response.status + ' ' + err.response.statusText)});
  },

  //파일 매니저
  //공지사항에 저장된 파일 목록 호출
  getBoardFiles: function (uuid) {
    return axios.get(`/file/downloadInfoBoard/${uuid}`, config())
      .then(res => {return res.data.detail})
      .catch(err => {return alert(err.response.status + ' ' + err.response.statusText)});
  },

  //이슈에 저장된 파일 목록 호출
  getIncidentFiles: function (uuid) {
    return axios.get(`/file/downloadInfoIncident/${uuid}`, config())
      .then(res => {return res.data.detail})
      .catch(err => {return alert(err.response.status + ' ' + err.response.statusText)});
  },

  //파일 업로드
  uploadFile: function (formdata, fileType) {
    return axios.post(`/file/upload3`, formdata, {
      headers: {
        'Content-Type': `${fileType}`,
        'Authorization': `Bearer ${sessionStorage.token}`
      }
    })
    .then(res => {return res})
    .catch(err => {return alert(err.response.status + ' ' + err.response.statusText)});
  },

  //파일 다운로드
  downloadFile: function (item) {
    return axios.get(`/file/download/${item.uuid}`, {
      responseType: 'blob',
      headers: { 'Authorization': `Bearer ${sessionStorage.token}`}
    })
    .then(res => {return res})
    .catch(err => {return alert(err.response.status + ' ' + err.response.statusText)});
  },

  //파일 삭제
  deleteFile: function (item) {
    return axios.delete(`/file/deleteFile/${item.uuid}`, config())
      .then(res => {return res})
      .catch(err => {return alert(err.response.status + ' ' + err.response.statusText)});
  },

  extendSession: function() {
    return axios.post(`/user/reauthenticate`, '', {
      headers: { 
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${sessionStorage.refreshToken}`,
        'Access-Control-Allow-Method': 'POST, OPTIONS, GET, DELETE, PATCH, UPDATE'
      }
    })
    .then(res => {
      sessionStorage.setItem("token", res.data.detail.token);
      return res;
    })
    .catch(err => {
      console.log(err);
      return alert("세션을 연장할 수 없습니다. \n다시 로그인 해주세요.")
    });
  }
};

export default api;
