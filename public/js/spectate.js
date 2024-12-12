let WEB_SERVER_SOCKET;

document.addEventListener('DOMContentLoaded', async () => {
  deleteLog();

  if (getLocalStorage('selectedSummonerProfile')) {
    const { selectedSummonerProfile } = getLocalStorage('selectedSummonerProfile');
    console.log(selectedSummonerProfile);
    displaySummonerProfile(selectedSummonerProfile);
  }

  if (getLocalStorage('webServerSocket')) delLocalStorage('webServerSocket');

  // if (getLocalStorage('webServerSocket')) {
  //   const { webServerSocket } = getLocalStorage('webServerSocket');

  //   await closeAppServerSocket(webServerSocket.puuid);
  // }
});

const spectate = async () => {
  hideElement('start_spectate_btn');
  showElement('end_spectate_btn');

  const { header } = checkUserSessionExists('userSession');
  const { headers: extraHeaders } = header;

  const { selectedSummonerProfile } = getLocalStorage('selectedSummonerProfile');
  const { puuid } = selectedSummonerProfile;

  const webServerSocket = io(`${HOST}/ws/socket/web`, {
    extraHeaders,
    auth: { socketEntryCode: puuid },
  });

  webServerSocket.on('connect_error', () => {
    appendLog('🟨 실행중인 서버를 찾을 수 없습니다.', true);
  });

  webServerSocket.on('connect', () => {
    WEB_SERVER_SOCKET = webServerSocket;

    setLocalStorage('webServerSocket', {
      webServerSocket: {
        webServerSocketId: webServerSocket.id,
        puuid,
      },
    });

    appendLog('🟩 서버 연결 성공');
  });

  webServerSocket.on('handle-connection-error', async (error) => {
    const { message } = error.response;

    console.log('클라이언트 소켓 서버 에러: ', message);

    let isSessionError = await handleSocketSessionError(message);

    if (!isSessionError) appendLog(`🟨 ${message}`, true);
    else alert('다시 시도해주세요.');

    showElement('start_spectate_btn');
    hideElement('end_spectate_btn');
  });
  webServerSocket.on('session-conflict-error', (message) => {
    appendLog(`🟨 ${message}`, true);
  });

  webServerSocket.on('invite-room', async (body) => {
    const { message } = body;

    appendLog(`🟩 ${message}`);

    await joinWebServerRoom(webServerSocket, puuid);
  });

  webServerSocket.on('hello', async (body) => {
    const { message } = body;

    appendLog(`🟩 ${message}`);
  });

  webServerSocket.on('disconnect', () => {
    delLocalStorage('webServerSocket');

    appendLog('🟥 서버 연결 종료');

    showElement('start_spectate_btn');
    hideElement('end_spectate_btn');
  });
};

const joinWebServerRoom = async (webServerSocket, puuid) => {
  if (!webServerSocket) appendLog('🟨 연결된 서버가 없습니다.', true);

  webServerSocket.emit('join-room', { socketEntryCode: puuid });

  webServerSocket.off('join-room-reply');

  webServerSocket.on('join-room-reply', (body) => {
    const { message } = body;

    appendLog(`🟩 ${message}`);
  });
};

const finishSpectate = async (puuid) => {
  if (!WEB_SERVER_SOCKET) return appendLog('🟨 연결된 서버가 없습니다.', true);

  WEB_SERVER_SOCKET.emit('disconnect-request', { socketEntryCode: puuid });

  WEB_SERVER_SOCKET.disconnect();

  WEB_SERVER_SOCKET = null;

  delLocalStorage('webServerSocket');

  showElement('start_spectate_btn');
  hideElement('end_spectate_btn');
};

const displaySummonerProfile = (summoner) => {
  setRankImg('rank_img', summoner.tier === 'UNRANKED' ? 'Challenger' : summoner.tier);
  replaceText('summoner_name', summoner.gameName);
  replaceText('summoner_tag', `#${summoner.tagLine}`);
  replaceText(
    'league_tier',
    summoner.tier === 'UNRANKED' ? 'Unranked' : `${summoner.tier} ${summoner.rank}`,
  );
  replaceText('league_point', `${summoner.leaguePoints} LP`);
  replaceText(
    'league_score',
    summoner.tier === 'UNRANKED'
      ? '기록된 전적이 없습니다.'
      : `${summoner.wins}승 ${summoner.losses}패 승률 ${parseInt((summoner.wins / (summoner.wins + summoner.losses)) * 100)}%`,
  );
};
