const redirectLocation = (url) => {
  window.location.href = url;
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

const setLocalStorage = (tag, data) => {
  localStorage.setItem(tag, JSON.stringify(data));
};

const getLocalStorage = (tag) => {
  return localStorage.getItem(tag);
};

const delLocalStorage = (tag) => {
  localStorage.removeItem(tag);
};
