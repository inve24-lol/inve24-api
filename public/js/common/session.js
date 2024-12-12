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

  return getLocalStorage(userSession);
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

const handleSocketSessionError = async (message) => {
  if (message === '엑세스 토큰이 만료되었습니다.') {
    await refreshSession();
  } else if (
    message === '리프레시 토큰이 만료되었습니다. 다시 로그인하여 새로운 토큰을 발급받으세요.'
  ) {
    redirectLocation(HOST, 'login');
  }
};

const handleSessionError = async (error) => {
  const { message } = error.data;
  let isSessionError = false;
  console.log(11111111);

  if (message === '엑세스 토큰이 만료되었습니다.') {
    await refreshSession();
    isSessionError = true;
  } else if (
    message === '리프레시 토큰이 만료되었습니다. 다시 로그인하여 새로운 토큰을 발급받으세요.'
  ) {
    isSessionError = true;
    redirectLocation(HOST, 'login');
  }

  return isSessionError;
};

const handleCommonError = async (error, description = '') => {
  const { status, data } = error;
  const { message } = data;
  console.log(22222222);
  console.log(message);
  if (status === 400) alert(`${description} code: ${status}`);
  else alert(`${message} code: ${status}`);
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
    delLocalStorage('summonerProfiles');
    delLocalStorage('selectedSummonerProfile');
    delLocalStorage('webServerSocket');

    alert(`로그아웃 되었습니다.`);

    // 메인 페이지로 이동
    redirectLocation(HOST);
  } catch (error) {
    if (!error.response) return alert('client error');
    await handleSessionError(error.response);
    await handleCommonError(error.response);
  }
};

const refreshSession = async () => {
  try {
    const { data: responseBody } = await axios.post(
      `${HOST}/auth/v1/refresh`,
      {},
      { withCredentials: true },
    );

    console.log('엑세스 토큰 갱신 :', responseBody);

    const { userProfile } = getLocalStorage('userSession');

    const userSession = {
      userProfile,
      header: { headers: { Authorization: `Bearer ${responseBody.accessToken}` } },
    };

    setLocalStorage('userSession', userSession);
  } catch (error) {
    if (!error.response) return alert('client error');
    let isSessionError = await handleSessionError(error.response);
    if (!isSessionError) await handleCommonError(error.response);
  }
};
