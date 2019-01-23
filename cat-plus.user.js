// ==UserScript==
// @name Cat Plus
// @version 0.0.1
// @namespace GarboMuffin
// @match https://scratch.mit.edu/*
// @grant GM_addStyle
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_deleteValue
// @grant GM_listValues
// @run-at document-end
// ==/UserScript==

'use strict';

if (location.hash === '#c3-options') {
  const el = document.createElement('div');

  el.innerHTML = `
  <div><b>cat cat cat options</b></div>
  <div>Changes are automatically saved. Refresh to apply. This will eventually be prettier.</div>
  <div><label><input type="checkbox" c3-bind="leftSideStage"> left side stage?</label></div>
  <div><label><input type="checkbox" c3-bind="compactEditor"> compact[er] editor?</label></div>
  `;

  for (const i of el.querySelectorAll('[c3-bind]')) {
    const bind = i.getAttribute('c3-bind');
    i.onchange = function() {
      GM_setValue(bind, i.checked);
    };
    i.checked = GM_getValue(bind, false);
  }

  el.style.position = 'fixed';
  el.style.top = '0';
  el.style.left = '0';
  el.style.width = '100%';
  el.style.height = '100%';
  el.style.zIndex = Number.MAX_SAFE_INTEGER;
  el.style.backgroundColor = 'white';

  document.body.appendChild(el);
}

if (GM_getValue('leftSideStage', false)) {
  GM_addStyle(`
  .gui_flex-wrapper_uXHkj {
    flex-direction: row-reverse;
  }

  .target-pane_target-pane_3S5E6 {
    flex-direction: row-reverse;
  }

  [dir="ltr"] .sprite-selector_sprite-selector_2KgCX {
    margin-left: calc(0.5rem / 2);
    margin-right: 0;
  }

  .target-pane_stage-selector-wrapper_qekSW {
    margin-left: 0 !important;
    margin-right: calc(0.5rem / 2);
  }
  `);
}

if (GM_getValue('compactEditor', false)) {
  GM_addStyle(`
  .gui_target-wrapper_36Gbz {
    padding-top:0.25rem;
  }

  .sprite-info_row-primary_10JrS {
    margin-bottom: 0;
  }

  .sprite-info_sprite-input_17wjb {
    width: 5rem;
  }

  .sprite-info_larger-input_1UEs0 input {
    width: 3rem;
  }

  .sprite-info_icon-wrapper_3Wbqq {
    width: calc(1.4rem + 2px);
    height: calc(1.4rem + 2px);
    padding: 0.2rem;
  }

  .sprite-info_sprite-info_3EyZh {
    padding: 0.4rem;
    padding-bottom: 0.2rem;
  }

  div.sprite-info_row_1om5V:nth-child(1) > div:nth-child(1) > label:nth-child(1) > span:nth-child(1),
  div.sprite-info_row_1om5V:nth-child(1) > div:nth-child(2) > div:nth-child(1),
  div.sprite-info_row_1om5V:nth-child(1) > div:nth-child(3) > div:nth-child(1),
  div.sprite-info_row_1om5V:nth-child(2) > div:nth-child(1) > label:nth-child(1),
  div.sprite-info_larger-input_1UEs0:nth-child(3) > label:nth-child(1) > span:nth-child(1),
  div.sprite-info_larger-input_1UEs0:nth-child(2) > label:nth-child(1) > span:nth-child(1),
  div.sprite-info_row_1om5V:nth-child(1) > div:nth-child(2) > label:nth-child(2) > span:nth-child(1),
  div.sprite-info_row_1om5V:nth-child(1) > div:nth-child(3) > label:nth-child(2) > span:nth-child(1),
  .label_input-label_3KjCa,
  .label_input-label_3KjCa {
    display: none;
  }

  div.sprite-info_row_1om5V:nth-child(2),
  div.sprite-info_row_1om5V:nth-child(1) {
    display: inline-flex;
  }

  div.sprite-info_row_1om5V:nth-child(1) {
    transform: translateY(-4px);
  }

  .sprite-selector_scroll-wrapper_3NNnc {
    height: 100%;
  }
  `);
}
