document.addEventListener('DOMContentLoaded', async () => {
  delLocalStorage('signupEmail');

  if (getLocalStorage('userSession')) await getMySummoners();

  if (getCodeFromUrl()) await riotSignOn(getCodeFromUrl());

  if (getLocalStorage('summonerInfo')) displaySummonerList(getLocalStorage('summonerInfo'));
});

const redirectRiotSignOnPage = async () => {
  const { header } = checkUserSessionExists('userSession');

  try {
    const { data: responseBody } = await axios.get(`${HOST}/summoner/v1/rso-url`, header);

    const { riotSignOnUrl } = responseBody;

    redirectLocation(riotSignOnUrl);
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      alert(`${data.message} code: ${status}`);
    } else alert('client error');
  }
};

const riotSignOn = async (code) => {
  const { header } = checkUserSessionExists('userSession');

  try {
    const { data: responseBody } = await axios.post(
      `${HOST}/summoner/v1/summoners?rsoAccessCode=${code}`,
      {},
      header,
    );

    const { summonerProfiles } = responseBody;

    setLocalStorage('summonerInfo', summonerProfiles);

    openNewPage(RIOT_SIGN_OUT_URL);

    redirectLocation(HOST);
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 400) alert(`rso access code 필요합니다. code: ${status}`);
      else alert(`${data.message} code: ${status}`);
    } else alert('client error');
  }
};

const getMySummoners = async () => {
  const { header } = checkUserSessionExists('userSession');

  try {
    const { data: responseBody } = await axios.get(`${HOST}/summoner/v1/summoners`, header);

    const { summonerProfiles } = responseBody;

    setLocalStorage('summonerInfo', summonerProfiles);
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      alert(`${data.message} code: ${status}`);
    } else alert('client error');
  }
};

const displaySummonerList = (summonerInfo) => {
  const wrap = document.getElementById('home_wrap');

  summonerInfo.forEach((summoner) => {
    const container = createDivClass('summoner-container flex-col-se-c container home-container');

    const summonerDiv = createDivClass('summoner flex-row-sb-c');

    const summonerTitleDiv = createDivClass('summoner-title');
    setDivText(summonerTitleDiv, `${summoner.gameName} #${summoner.tagLine}`);

    const summonerBtnDiv = createDivClass('btn summoner-select-btn');
    setDivText(summonerBtnDiv, '선택 >');

    appendChildToParent(summonerTitleDiv, summonerDiv);
    appendChildToParent(summonerBtnDiv, summonerDiv);
    appendChildToParent(summonerDiv, container);
    appendChildToParent(container, wrap);
  });
};
