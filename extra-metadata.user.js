// ==UserScript==
// @name Extra Metadata for Scratch 3
// @description Adds extra metadata to the Scratch 3 interface
// @version 0.1
// @namespace https://github.com/forkphorus/cat-plus
// @homepageURL https://github.com/forkphorus/cat-plus#readme
// @match https://scratch.mit.edu/projects/*
// ==/UserScript==

window.addEventListener('load', function() {
  var shareDate = document.querySelector('.share-date');
  if (!shareDate) {
    return;
  }

  var created;
  var shared;
  var modified;

  function getProjectId() {
    const re = location.pathname.match(/\/projects\/(\d*)/);
    return re[1];
  }

  function dateToString(date) {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
  }

  function onResize() {
    addButton();
  }

  function showInfo() {
    let text = '';
    text += 'Created: ' + dateToString(created) + '\n';
    text += 'Shared: ' + dateToString(shared) + '\n';
    text += 'Modified: ' + dateToString(modified);
    alert(text);
  }

  function addButton() {
    shareDate = document.querySelector('.share-date');
    if (!shareDate) {
      return;
    }
    const dateContainer = shareDate.querySelector('span');
    if (!dateContainer) {
      return;
    }
    if (dateContainer.querySelector('.u-button')) {
      return;
    }

    dateContainer.textContent += ' ';
    const button = document.createElement('a');
    button.textContent = '\u2026';
    button.classList.add('u-button');
    button.title = 'More information about dates';
    button.onclick = showInfo;
    dateContainer.appendChild(button);
  }

  const projectId = getProjectId();
  if (!projectId) {
    return;
  }

  fetch('https://api.scratch.mit.edu/projects/' + projectId)
    .then((res) => res.json())
    .then((json) => {
      const history = json.history;
      if (!history) {
        return;
      }

      created = new Date(history.created);
      shared = new Date(history.shared);
      modified = new Date(history.modified);

      addButton();
      setInterval(addButton, 1000);

    });
});
