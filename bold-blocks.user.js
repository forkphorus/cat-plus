// ==UserScript==
// @name Bold Blocks for Scratch 3
// @description Makes blocks in Scratch 3 bolder and easier to read.
// @version 1.0
// @namespace https://github.com/forkphorus/cat-plus
// @homepageURL https://github.com/forkphorus/cat-plus#readme
// @match https://scratch.mit.edu/projects/*
// @grant GM_addStyle
// @run-at document-start
// ==/UserScript==

GM_addStyle(`
.blocklyText, .blocklyHtmlInput {
  font-weight: bold !important;
  font-size: 18px !important;
}
`);
