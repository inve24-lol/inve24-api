document.addEventListener('DOMContentLoaded', () => {
  delLocalStorage('signupEmail');
});

const riotSignOn = () => {
  checkUserSessionExists('userSession');

  console.log(111);
};
