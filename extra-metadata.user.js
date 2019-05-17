// ==UserScript==
// @name Extra Metadata for Scratch 3
// @description Adds extra metadata to the Scratch 3 interface
// @version 0.1.3
// @namespace https://github.com/forkphorus/cat-plus
// @homepageURL https://github.com/forkphorus/cat-plus#readme
// @match https://scratch.mit.edu/projects/*
// ==/UserScript==

(function() {

  'use strict';

  /**
   * @param {Date} date Date
   * @returns {string} Human readable date.
   */
  function dateToString(date) {
    return date.toLocaleString();
  }

  function handleProjectPage() {
    if (location.pathname.includes('editor')) {
      return;
    }

    /**
     * @typedef {Object} ProjectData
     * @property {Date} created
     * @property {Date} modified
     * @property {Date} shared
     * @property {number} comments
     */

    /**
     * @type {ProjectData}
     */
    var projectData = {};

    /**
     * @returns {string} The project ID, if any.
     */
    function getProjectId() {
      const re = location.pathname.match(/\/projects\/(\d*)/);
      return re[1];
    }

    /**
     * @param {ProjectData} id 
     */
    function getProjectData(id) {
      return fetch('https://api.scratch.mit.edu/projects/' + id)
        .then((r) => r.json())
        .then((data) => {
          return {
            created: new Date(data.history.created),
            shared: new Date(data.history.shared),
            modified: new Date(data.history.modified),
            comments: data.stats.comments,
          };
        });
    }

    function showDateInformation() {
      let text = '';
      text += 'Created: ' + dateToString(projectData.created) + '\n';
      text += 'Shared: ' + dateToString(projectData.shared) + '\n';
      text += 'Modified: ' + dateToString(projectData.modified);
      alert(text);
    }

    function addDateElement() {
      const shareDate = document.querySelector('.share-date');
      if (!shareDate) return;

      const dateContainer = shareDate.querySelector('span');
      if (!dateContainer || dateContainer._extraMetadata) return;

      dateContainer._extraMetadata = true;
      dateContainer.textContent += ' ';
      const button = document.createElement('a');
      button.textContent = '\u2026';
      button.title = 'More information about dates';
      button.onclick = showDateInformation;
      dateContainer.appendChild(button);
    }

    function addCommentsElement() {
      const commentsHeader = document.querySelector('.comments-header');
      if (!commentsHeader) return;

      const commentsHeaderText = commentsHeader.querySelector('span');
      if (!commentsHeaderText || commentsHeaderText._extraMetadata) return;

      commentsHeaderText._extraMetadata = true;
      commentsHeaderText.textContent += ' (' + projectData.comments + ')';
    }

    function updateInterface() {
      addDateElement();
      addCommentsElement();
    }

    const projectId = getProjectId();
    if (!projectId) return;

    getProjectData(projectId)
      .then((data) => {
        projectData = data;
        updateInterface();
        setInterval(updateInterface, 1000);
      })
      .catch((err) => {
        // that's fine
      });
  }

  window.addEventListener('load', function() {
    handleProjectPage();
  });

})();
