document.addEventListener('DOMContentLoaded', () => {
  checkCurrentPageSession('userSession');

  disableBtn('verify_email_btn');
});

const sendEmail = async () => {
  const EMAIL = getLocalStorage('signupEmail');

  if (!EMAIL) {
    alert('올바른 접근이 아닙니다.');
    return;
  }

  displayElement('spinner');

  try {
    const { data: responseBody } = await axios.get(`${HOST}/mail/v1/${EMAIL}`);

    alert(`${responseBody.email}로 인증 코드를 전송하였습니다.`);

    enableBtn('verify_email_btn');
  } catch (error) {
    if (!error.response) return alert('client error');
    handleCommonError(error.response, '올바른 형식의 이메일을 입력해주세요.');
  } finally {
    hideElement('spinner');
  }
};

const verifyEmail = async () => {
  const EMAIL = getLocalStorage('signupEmail');

  const EMAIL_CODE = document.getElementById('email_code_input').value;

  if (!EMAIL) {
    alert('올바른 접근이 아닙니다.');
    return;
  }

  if (!EMAIL_CODE) {
    alert('이메일 인증 코드를 입력해주세요.');
    return;
  }

  if (isNaN(Number(EMAIL_CODE))) {
    alert('올바른 형식의 이메일 인증 코드를 입력해주세요.');
    return;
  }

  if (EMAIL_CODE.length !== 6) {
    alert('6자리의 이메일 인증 코드를 입력해주세요.');
    return;
  }

  displayElement('spinner');

  try {
    const { data: responseBody } = await axios.get(`${HOST}/mail/v1/${EMAIL_CODE}/${EMAIL}`);

    alert(`${responseBody.email} 인증에 성공하였습니다.`);

    replaceText('signup_title', '가입 정보를 입력해주세요.');
    hideElement('send_email_box');
    hideElement('verify_email_btn');
    showElement('nickname_input');
    showElement('password_input');
    showElement('signup_btn');
  } catch (error) {
    if (!error.response) return alert('client error');
    handleCommonError(error.response, '올바른 형식의 이메일 인증 코드를 입력해주세요.');
  } finally {
    hideElement('spinner');
  }
};

const signup = async () => {
  const EMAIL = getLocalStorage('signupEmail');

  const NICKNAME = document.getElementById('nickname_input').value;
  const PASSWORD = document.getElementById('password_input').value;

  if (!EMAIL) {
    alert('올바른 접근이 아닙니다.');
    return;
  }

  if (!NICKNAME) {
    alert('닉네임을 입력해주세요.');
    return;
  }

  if (!PASSWORD) {
    alert('비밀번호를 입력해주세요.');
    return;
  }

  if (NICKNAME.length < 2 || NICKNAME.length > 10) {
    alert('닉네임은 2자 이상 10자 미만이어야 합니다.');
    return;
  }

  if (PASSWORD.length < 8 || NICKNAME.length > 20) {
    alert('비밀번호는 8자 이상 20자 미만이어야 합니다.');
    return;
  }

  const signupRequestBody = { email: EMAIL, password: PASSWORD, nickname: NICKNAME };

  displayElement('spinner');

  try {
    const { data: responseBody } = await axios.post(`${HOST}/users/v1/signup/`, signupRequestBody);

    alert(`안녕하세요, '${responseBody.userProfile.nickname}'님. 로그인을 진행해 주세요.`);

    // 로그인 페이지로 이동
    redirectLocation(HOST, 'login');
  } catch (error) {
    if (!error.response) return alert('client error');
    handleCommonError(error.response, '올바른 형식의 닉네임 또는 비밀번호를 입력해주세요.');
  } finally {
    hideElement('spinner');
  }
};
