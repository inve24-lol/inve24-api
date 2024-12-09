const replaceText = (elementId, content) => {
  document.getElementById(elementId).innerHTML = content;
};

const showElement = (elementId) => {
  document.getElementById(elementId).style.display = 'block';
};

const hideElement = (elementId) => {
  document.getElementById(elementId).style.display = 'none';
};
