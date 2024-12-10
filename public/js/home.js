document.addEventListener('DOMContentLoaded', () => {
  if (getLocalStorage('userSession')) {
    hideElement('nav_login_btn');
    showElement('nav_logout_btn');
  }
});

const redirectLoginPage = () => {
  redirectLocation(HOST, 'login');
};
