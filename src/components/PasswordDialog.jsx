import React, { useState } from 'react';
import api from '../utils/api';

//ui5
import { Bar, Button, Input, Dialog, Text } from '@ui5/webcomponents-react';

import '../assets/styles/LoginPage.css';

function PasswordDialog(props) {
  const [err, setErr] = useState(false);
  const user = props.userInfo;
  const [userDto, setUserDto] = useState({
    create_date: user.create_date,
    session_id: user.session_id,
    company_account: user.company_account,
    email: user.email,
    leader: user.leader,
    name: user.name,
    password: user.password,
    uuid: user.uuid,
    role: user.role,
    status: user.status,
    update_date: user.update_date,
    update_id: user.update_id
  });

  function inputHandler(e) {
    setUserDto({
      create_date: user.create_date,
      session_id: user.session_id,
      company_account: user.company_account,
      email: user.email,
      leader: user.leader,
      name: user.name,
      password: e.target.value,
      uuid: user.uuid,
      role: user.role,
      status: user.status,
      update_date: user.update_date,
      update_id: user.update_id
    });
  };
  
  function passwordValidation(e) {
    if(e.target.value !== userDto.password) {
      setErr(true);
    } else{
      setErr(false);
    };
  };

  async function changePassword() {
    console.log(user);
    console.log(userDto);
    if(userDto.password !== null && userDto.password !== undefined && err !== true) {
        const result = await api.changePassword(userDto);
        if(result) {
          alert("비밀번호가 정상적으로 변경 되었습니다. 다시 로그인 해주세요.");
          props.close();
        }      
    } else {
      alert("새 비밀번호를 정확히 입력해주세요");
    };
  };

  return (
    <Dialog
      open={props.show === true}
      onAfterClose={() => props.close()}
      headerText="새로운 비밀번호를 입력해주세요"
      footer={
        <Bar
          design='Footer' 
          endContent={
            <Button className='button' style={{padding: '5px 10px'}} onClick={changePassword}>비밀번호 변경</Button>
        } />
      }
    >
      <div className='password-dialog'>
        <Text>새 비밀번호</Text>
        <Input type="Password" value='' onChange={inputHandler} />
        <Text>비밀번호 확인</Text>
        <Input type="Password" value='' onInput={passwordValidation} />
        {err && <Text style={{color: 'red'}}>*비밀번호가 일치하지 않습니다</Text>}
      </div>
    </Dialog>
  )
}

export default PasswordDialog;