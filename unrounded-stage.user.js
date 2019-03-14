// ==UserScript==
// @name Unrounded Stage for Scratch 3
// @description Removes rounded corners from the stage in Scratch 3.
// @version 1.0
// @namespace https://github.com/forkphorus/cat-plus
// @homepageURL https://github.com/forkphorus/cat-plus#readme
// @match https://scratch.mit.edu/projects/*
// @grant GM_addStyle
// @run-at document-start
// ==/UserScript==

GM_addStyle(`
.stage_stage_1fD7k.box_box_2jjDp,
.stage_green-flag-overlay-wrapper_2hUi_ {
  border-radius: 0 !important;
}
`);
