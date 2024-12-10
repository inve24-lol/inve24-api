const redirectLocation = (host, endPoint = '') => {
  window.location.href = `${host}/${endPoint}`;
};

const replaceText = (elementId, content) => {
  document.getElementById(elementId).innerHTML = content;
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
