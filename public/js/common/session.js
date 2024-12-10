document.addEventListener('DOMContentLoaded', () => {
  if (getLocalStorage('userSession')) {
    hideElement('nav_login_btn');
    showElement('nav_logout_btn');
  }
});

const checkUserSessionExists = (userSession) => {
  if (!getLocalStorage(userSession)) {
    alert('로그인이 필요한 서비스입니다.');

    // 로그인 페이지로 이동
    redirectLocation(HOST, 'login');
  }
};

const checkCurrentPageSession = (userSession) => {
  if (getLocalStorage(userSession)) {
    alert('올바른 접근이 아닙니다.');

    // 메인 페이지로 이동
    redirectLocation(HOST);
  } else {
    hideElement('nav_login_btn');
  }
};

const redirectHomePage = () => {
  // 메인 페이지로 이동
  redirectLocation(HOST);
};

const redirectLoginPage = () => {
  // 로그인 페이지로 이동
  redirectLocation(HOST, 'login');
};

const logout = async () => {
  if (!getLocalStorage('userSession')) return alert('올바른 접근이 아닙니다.');

  const { header } = getLocalStorage('userSession');

  try {
    await axios.delete(`${HOST}/auth/v1/signout`, header);

    delLocalStorage('userSession');

    alert(`로그아웃 되었습니다.`);

    // 메인 페이지로 이동
    redirectLocation(HOST);
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      alert(`${data.message} code: ${status}`);
    } else alert('client error');
  }
};
