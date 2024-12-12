const redirectLocation = (host, endPoint = '') => {
  window.location.href = `${host}/${endPoint}`;
};

const getCodeFromUrl = () => {
  return new URLSearchParams(window.location.search).get('code');
};

const openNewPage = (url) => {
  window.open(url, '_blank');
};

const replaceText = (elementId, content) => {
  document.getElementById(elementId).innerHTML = content;
};

const appendLog = (message) => {
  const logArea = document.getElementById('spectate_log_area');
  const time = new Date().toLocaleTimeString('ko-KR', { timeZone: 'Asia/Seoul' });

  logArea.value += `[${time}] - ${message}\n`;

  logArea.scrollTop = logArea.scrollHeight;
};

const deleteLog = () => {
  document.getElementById('spectate_log_area').value = '';
};

const setRankImg = (elementId, rank) => {
  document.getElementById(elementId).src = `img/Rank=${rank}.png`;
};

const createDivClass = (className) => {
  const div = document.createElement('div');
  div.className = className;
  return div;
};

const setDivText = (div, text) => {
  div.textContent = text;
};

const appendChildToParent = (child, parent) => {
  parent.appendChild(child);
};

const showElement = (elementId) => {
  document.getElementById(elementId).style.display = 'block';
};

const hideElement = (elementId) => {
  document.getElementById(elementId).style.display = 'none';
};

const disableBtn = (elementId) => {
  document.getElementById(elementId).classList.add('btn-disabled');
};

const enableBtn = (elementId) => {
  document.getElementById(elementId).classList.remove('btn-disabled');
};

const setLocalStorage = (tag, data) => {
  localStorage.setItem(tag, JSON.stringify(data));
};

const getLocalStorage = (tag) => {
  return JSON.parse(localStorage.getItem(tag));
};

const delLocalStorage = (tag) => {
  localStorage.removeItem(tag);
};
