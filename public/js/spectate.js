let WEB_SERVER_SOCKET;

document.addEventListener('DOMContentLoaded', async () => {
  deleteLog();

  if (getLocalStorage('selectedSummonerProfile')) {
    const { selectedSummonerProfile } = getLocalStorage('selectedSummonerProfile');
    displaySummonerProfile(selectedSummonerProfile);
  }

  if (getLocalStorage('webServerSocket')) {
    const { webServerSocket } = getLocalStorage('webServerSocket');

    await finishSpectate(webServerSocket.puuid);
  }
});

const spectate = async () => {
  hideElement('start_spectate_btn');
  showElement('end_spectate_btn');
  deleteLog();

  const { header } = checkUserSessionExists('userSession');
  const { headers: extraHeaders } = header;

  const { selectedSummonerProfile } = getLocalStorage('selectedSummonerProfile');
  const { puuid } = selectedSummonerProfile;

  const webServerSocket = io(`${HOST}/ws/socket/web`, {
    extraHeaders,
    auth: { socketEntryCode: puuid },
  });

  webServerSocket.on('connect_error', () => {
    appendLog('🟨 실행중인 서버를 찾을 수 없습니다.');
  });

  webServerSocket.on('connect', () => {
    WEB_SERVER_SOCKET = webServerSocket;

    setLocalStorage('webServerSocket', {
      webServerSocket: {
        webServerSocketId: webServerSocket.id,
        puuid,
      },
    });

    hideElement('start_spectate_btn');
    showElement('end_spectate_btn');
    deleteLog();

    appendLog('🟩 서버 연결 성공');
  });

  webServerSocket.on('handle-connection-error', async (error) => {
    const { message } = error.response;

    console.log('클라이언트 소켓 서버 에러: ', message);

    let isSessionError = await handleSocketSessionError(message);

    if (!isSessionError) appendLog(`🟨 ${message}`);
    else appendLog('🟨 다시 시도해주세요.');

    showElement('start_spectate_btn');
    hideElement('end_spectate_btn');
  });
  webServerSocket.on('session-conflict-error', (message) => {
    appendLog(`🟨 ${message}`);
  });

  webServerSocket.on('invite-room', async (body) => {
    const { message } = body;

    appendLog(`🟩 ${message}`);

    await joinWebServerRoom(webServerSocket, puuid);
  });

  webServerSocket.on('hello', (body) => {
    const { message } = body;

    appendLog(`🟩 ${message}`);
  });

  webServerSocket.on('game-status', (body) => {
    const { message } = body;

    appendLog(`🟦 현재 게임 상태: ${message}`);
  });

  webServerSocket.on('game-start-time', (body) => {
    const { message } = body;

    gameProgressTime(Number(message), puuid);
  });

  webServerSocket.on('app-not-found', async (body) => {
    const { message } = body;

    appendLog(`🟨 ${message}`);

    if (!WEB_SERVER_SOCKET) {
      appendLog('🟨 연결된 서버가 없습니다.');
      return;
    }

    await finishSpectate(puuid);
  });

  webServerSocket.on('disconnect', () => {
    delLocalStorage('webServerSocket');

    appendLog('🟥 서버 연결 종료');

    showElement('start_spectate_btn');
    hideElement('end_spectate_btn');
  });
};

const joinWebServerRoom = async (webServerSocket, puuid) => {
  if (!webServerSocket) {
    appendLog('🟨 연결된 서버가 없습니다.');
    return;
  }

  webServerSocket.emit('join-room', { socketEntryCode: puuid });

  webServerSocket.off('join-room-reply');

  webServerSocket.on('join-room-reply', (body) => {
    const { message } = body;

    appendLog(`🟩 ${message}`);
  });
};

const gameProgressTime = (gameStartTime, puuid) => {
  disableBtn('end_spectate_btn');

  let counter = 0;
  const intervalId = setInterval(async () => {
    deleteLog();
    appendLog(`🟪 게임 진행 시간: ${counter + gameStartTime}초`);

    counter++;

    if (counter + gameStartTime >= 60) {
      appendLog('🟨 1분이 경과되어 서버 연결을 종료합니다.');

      clearInterval(intervalId);

      if (!WEB_SERVER_SOCKET) {
        appendLog('🟨 연결된 서버가 없습니다.');
        return;
      }

      enableBtn('end_spectate_btn');

      await finishSpectate(puuid);
    }
  }, 1000);
};

const finishSpectate = async (puuid) => {
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
