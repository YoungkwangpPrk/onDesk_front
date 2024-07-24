export function emailValidattion(email){
  if(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email))
    return;
  else 
    return '* 형식에 맞는 이메일 주소를 입력해 주세요';
};

export function nameValidation(name) {
  if(/^[A-Z|ㄱ-ㅎ|가-힣]{2,}$/i.test(name))
  return;
  else
    return '* 형식에 맞게 입력해 주세요';
};

export function issueValidation({company_account, inquirer, inquirer_email, manager, title, isContentEmpty}) {
  console.log('company:', company_account, 'email:', inquirer_email, 'inquirer:',inquirer, 'manager:', manager, 'title', title, 'content:',isContentEmpty)
  if (company_account === '' || company_account === null) {
    return alert('고객사를 선택해 주세요');
  } else if (inquirer === ''|| inquirer === null)
    return alert('접수자명을 입력해 주세요');
  else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(inquirer_email)) {
    alert('이메일이 형식에 맞지 않습니다.');
    return;
  } 
  else if(manager === '' || manager === null)
    return alert('담당자를 지정해 주세요');
  else if(title === '' || title === null)
    return alert('제목을 입력해 주세요');
  else if(isContentEmpty === null )
    return alert('문의 내용을 입력해 주세요');
  else 
    return true;
};

export function companyMemberValidation(member) {
  var member2 = [];
  var count = 0;
  let result = '';
  for(let i = 0; i < member.length; i++) {
    if((member[i].emailErr === undefined && member[i].nameErr === undefined) || member[i].status === 'delete') {
      count++;
    };
    result = member.filter(email => member[i].email === email.email);
    if(result.length > 1) {
      alert("중복된 이메일이 있습니다 다시 확인해 주세요");
      return;
    };
    if(member[i].status !== null)
      member2.push(member[i]);
    if(member[i].status !== 'delete' && (member[i].user_id === '' || member[i].email === '' || member[i].name === '')) {
      alert('입력한 정보를 확인 해주세요.');
      return;
    };
  };
  return [count, member2];
};

export function comforinUserValidation(array) {
  var count = 0;
  var array2 = [];
  let result = '';
  for(let i = 0; i < array.length; i++) {
    if((array[i].emailErr === undefined && array[i].nameErr === undefined && array[i].name !== '' && array[i].email !== '') || array[i].status === 'delete')
      count++;
      result = array.filter(email => array[i].email === email.email);
    if(result.length > 1) {
      alert("중복된 이메일이 있습니다 다시 확인해 주세요");
      return;
    }
    if(array[i].status !== null)
      array2.push(array[i]);
    if(array[i].status !== 'delete' && (array[i].email === '' || array[i].name === '')) {
      alert('입력한 정보를 확인 해주세요.');
      return;
    };
  };
  return [count, array2];
};