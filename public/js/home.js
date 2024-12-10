document.addEventListener('DOMContentLoaded', () => {
  if (getLocalStorage('summonerInfo')) showElement('summoner_container');
  else hideElement('summoner_container');

  delLocalStorage('signupEmail');
});

const riotSignOn = () => {
  checkUserSessionExists('userSession');

  console.log(111);
};
