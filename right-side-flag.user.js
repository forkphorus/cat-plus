// ==UserScript==
// @name Right Side Flag for Scratch 3
// @description Removes the green flag and stop sign to the right side of the stage (like Scratch 2)
// @version 1.0
// @namespace https://github.com/forkphorus/cat-plus
// @homepageURL https://github.com/forkphorus/cat-plus#readme
// @match https://scratch.mit.edu/projects/*
// @grant GM_addStyle
// @run-at document-start
// ==/UserScript==

GM_addStyle(`
.stage-header_stage-menu-wrapper_15JJt {
  flex-direction: row-reverse !important;
}
`);
