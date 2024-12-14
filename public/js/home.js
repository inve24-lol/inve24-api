document.addEventListener('DOMContentLoaded', async () => {
  if (getLocalStorage('userSession')) {
    const { userProfile } = getLocalStorage('userSession');
    if (userProfile.role !== 'GUEST') await getMySummoners();
  }

  if (getCodeFromUrl()) await riotSignOn(getCodeFromUrl());

  if (getLocalStorage('signupEmail')) delLocalStorage('signupEmail');

  if (getLocalStorage('summonerProfiles')) displaySummonerList(getLocalStorage('summonerProfiles'));

  if (getLocalStorage('selectedSummonerProfile')) delLocalStorage('selectedSummonerProfile');

  if (getLocalStorage('webServerSocket')) delLocalStorage('webServerSocket');
});

const redirectRiotSignOnPage = async () => {
  displayElement('spinner');

  const { header } = checkUserSessionExists('userSession');

  try {
    const { data: responseBody } = await axios.get(`${HOST}/summoner/v1/rso-url`, header);

    const { riotSignOnUrl } = responseBody;

    redirectLocation(riotSignOnUrl);
  } catch (error) {
    if (!error.response) return alert('client error');
    await handleSessionError(error.response);
    handleCommonError(error.response, '올바른 형식의 이메일 또는 비밀번호를 입력해주세요.');
  } finally {
    hideElement('spinner');
  }
};

const riotSignOn = async (code) => {
  const { header } = checkUserSessionExists('userSession');

  displayElement('spinner');

  try {
    const { data: responseBody } = await axios.post(
      `${HOST}/summoner/v1/summoners?rsoAccessCode=${code}`,
      {},
      header,
    );

    const { summonerProfiles } = responseBody;

    setLocalStorage('summonerProfiles', summonerProfiles);

    openNewPage(RIOT_SIGN_OUT_URL);

    redirectLocation(HOST);
  } catch (error) {
    if (!error.response) return alert('client error');
    await handleSessionError(error.response);
    handleCommonError(error.response, 'rso access code 필요합니다.');
  } finally {
    hideElement('spinner');
  }
};

const getMySummoners = async () => {
  const { header } = checkUserSessionExists('userSession');

  displayElement('spinner');

  try {
    const { data: responseBody } = await axios.get(`${HOST}/summoner/v1/summoners`, header);

    const { summonerProfiles } = responseBody;

    if (summonerProfiles) setLocalStorage('summonerProfiles', summonerProfiles);
  } catch (error) {
    if (!error.response) return alert('client error');
    let isSessionError = await handleSessionError(error.response);
    if (!isSessionError) handleCommonError(error.response);
  } finally {
    hideElement('spinner');
  }
};

const deleteMySummoner = async (summonerId) => {
  const { header } = checkUserSessionExists('userSession');

  displayElement('spinner');

  try {
    await axios.delete(`${HOST}/summoner/v1/summoners/${summonerId}`, header);

    delLocalStorage('summonerProfiles');

    redirectLocation(HOST);
  } catch (error) {
    if (!error.response) return alert('client error');
    let isSessionError = await handleSessionError(error.response);
    if (!isSessionError) handleCommonError(error.response, '올바른 소환사 ID 형식이 아닙니다.');
  } finally {
    hideElement('spinner');
  }
};

const displaySummonerList = (summonerProfiles) => {
  const summonerWrap = document.getElementById('home_wrap');

  summonerProfiles.forEach((summoner) => {
    const summonerContainer = createDivClass(
      'summoner-container flex-col-se-c container home-container',
    );

    const summonerBoxDiv = createDivClass('summoner-box flex-row-sb-c');

    const summonerDeleteBtnDiv = createDivClass('btn summoner-delete-btn');
    setDivText(summonerDeleteBtnDiv, '< 삭제');

    const summonerTitleDiv = createDivClass('summoner-title');
    setDivText(summonerTitleDiv, `${summoner.gameName} #${summoner.tagLine}`);

    const summonerSelectBtnDiv = createDivClass('btn summoner-select-btn');
    setDivText(summonerSelectBtnDiv, '선택 >');

    summonerDeleteBtnDiv.addEventListener('click', async () => {
      if (confirm(`'${summoner.gameName}' 계정을 삭제하시겠습니까?`))
        await deleteMySummoner(summoner.id);
    });

    summonerSelectBtnDiv.addEventListener('click', () => {
      if (confirm(`'${summoner.gameName}' 계정으로 조회를 시작합니다.`)) {
        setLocalStorage('selectedSummonerProfile', { selectedSummonerProfile: summoner });

        // 관전 페이지로 이동
        redirectLocation(HOST, 'spectate');
      }
    });

    appendChildToParent(summonerDeleteBtnDiv, summonerBoxDiv);
    appendChildToParent(summonerTitleDiv, summonerBoxDiv);
    appendChildToParent(summonerSelectBtnDiv, summonerBoxDiv);
    appendChildToParent(summonerBoxDiv, summonerContainer);
    appendChildToParent(summonerContainer, summonerWrap);
  });
};
