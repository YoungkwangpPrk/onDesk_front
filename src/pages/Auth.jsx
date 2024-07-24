import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Loading from '../components/Loading';

function AuthPage() {
  const navigate = useNavigate();
  var clientUser;
  var clientEmail;
  var clientCompany;
  useEffect(() => {
    if(window.location.pathname !== '/') {
      const x = window.location.pathname;
      var y;
      for(let i = 0; i < x.length; i++) {
        if(x[i] === ','){
          y = i;
        };
      };
      if(y){
        clientUser = x.substring(1, y);
        clientCompany = x.substring(y+1);
        console.log(clientUser, clientCompany);
        sapLogin(clientUser);
      }
      else{
        alert('잘못된 접근입니다');
        navigate(-1);
      };
    } else {
      if(sessionStorage.key('token') === null) {
        navigate('/login');
      } else if(sessionStorage.company_account !== "com4in" ) {
        navigate('/main');
      } else {
        navigate('/com4in/main');
      };
    };
  }, []);

  function sapLogin(clientUser) {
    axios.get(`/saml/getSapUser/${clientUser}/${clientCompany}`)
    .then(res => {
      clientEmail = res.data.detail.d.email;
      axios.post('/user/authenticate', {
        //하드코딩으로 변경가능
        email: res.data.detail.d.email, //유저이메일
        password: "com4in!!", //유저 비밀번호
        Account: clientCompany //고객사
      })
      .then((res) => {
        sessionStorage.setItem('clientUser', clientUser);
        sessionStorage.setItem('userEmail', clientEmail);
        sessionStorage.setItem('token', res.data.detail.token);
        sessionStorage.setItem('company_account', clientCompany);
        sessionStorage.setItem('company_name', res.data.detail.userInfo.company_name);
        sessionStorage.setItem('userName', res.data.detail.userInfo.name);
        sessionStorage.setItem(
          "comforin_manager",
          res.data.detail.userInfo.comforin_manager
        );
        navigate('/main');
      })
      .catch(err => {
          alert('로그인 중 문제가 발생했습니다. 관리자에게 문의해 주세요');
          navigate('/login');
      });
    });
  };
  return (
    <Loading />
  );
};

export default AuthPage;

/**
 * sessionStorage.key('token') === null ? <Navigate replace to="/login" /> : <Navigate replace to="/main" />
 */