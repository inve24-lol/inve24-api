const EMAIL = document.getElementById('email_input');
const PASSWORD = document.getElementById('password_input');

const check = async () => {
  try {
    if (!EMAIL.value) return alert('이메일을 입력해주세요.');

    const params = EMAIL.value;

    const { data } = await axios.get(`${HOST}/users/v1/check/${params}`);

    if (!data) {
      setLocalStorage('signupEmail', params);
      redirectLocation(`${HOST}/signup`);
      return;
    }

    replaceText('login_title', '비밀번호를 입력해주세요.');
    hideElement('check_btn');
    hideElement('email_input');
    showElement('password_input');
    showElement('login_btn');
  } catch (error) {
    const { status, data } = error.response;
    if (status === 400) alert('올바른 형식의 이메일을 입력해주세요.');
    else alert(data.message);
  }
};

const login = async () => {
  try {
    if (!PASSWORD.value) return alert('비밀번호를 입력해주세요.');

    const body = { email: EMAIL.value, password: PASSWORD.value };

    const { data } = await axios.post(`${HOST}/auth/v1/signin`, body);

    const { accessToken, userProfile } = data;

    console.log(accessToken, userProfile);

    // 롤 계정 등록 페이지로 이동
  } catch (error) {
    const { status, data } = error.response;
    if (status === 400) alert('올바른 형식의 이메일 또는 비밀번호를 입력해주세요');
    else alert(data.message);
  }
};
