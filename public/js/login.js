document.addEventListener('DOMContentLoaded', () => {
  hideElement('nav_login_btn');
});

const emailCheck = async () => {
  const EMAIL = document.getElementById('email_input').value;

  if (!EMAIL) return alert('이메일을 입력해주세요.');

  try {
    const { data } = await axios.get(`${HOST}/users/v1/check/${EMAIL}`);

    if (!data) {
      setLocalStorage('signupEmail', EMAIL);

      // 회원 가입 페이지로 이동
      redirectLocation(`${HOST}/signup`);
      return;
    }

    replaceText('login_title', '비밀번호를 입력해주세요.');
    hideElement('email_check_btn');
    showElement('password_input');
    showElement('login_btn');
  } catch (error) {
    const { status, data } = error.response;
    if (status === 400) alert('올바른 형식의 이메일을 입력해주세요.');
    else alert(data.message);
  }
};

const login = async () => {
  const EMAIL = document.getElementById('email_input').value;
  const PASSWORD = document.getElementById('password_input').value;

  if (!PASSWORD) return alert('비밀번호를 입력해주세요.');

  const loginRequestBody = { email: EMAIL, password: PASSWORD };

  try {
    const { data } = await axios.post(`${HOST}/auth/v1/signin`, loginRequestBody);

    const { accessToken, userProfile } = data;

    delLocalStorage('signupEmail');
    setLocalStorage('accessToken', accessToken);
    setLocalStorage('userProfile', userProfile);

    alert(`'${userProfile.nickname}'님. 로그인에 성공하였습니다.`);

    // 메인 페이지로 이동
    redirectLocation(`${HOST}`);
  } catch (error) {
    const { status, data } = error.response;
    if (status === 400) alert('올바른 형식의 이메일 또는 비밀번호를 입력해주세요.');
    else alert(data.message);
  }
};
