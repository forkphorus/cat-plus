// ==UserScript==
// @name Better Context Menus for Scratch 3
// @version 0.1
// @namespace https://github.com/forkphorus/cat-plus
// @match https://scratch.mit.edu/projects/*
// @run-at document-idle
// ==/UserScript==

window.addEventListener('load', function() {
  const menuLibrary = {
    procedures_call(options, block) {
      options.push({
        enabled: true,
        text: "Goto Definition",
        callback: function() {
          const procCode = block.procCode_;
          for (const block of Object.values(workspace.blockDB_)) {
            if (block.type === 'procedures_prototype' && block.procCode_ === procCode) {
              workspace.centerOnBlock(block.id);
              break;
            }
          }
        },
      });
    },
  };

  let workspace = Blockly.getMainWorkspace();
  let hooked = false;

  function hook() {
    hooked = true;
 
    workspace.addChangeListener(function(change) {
      if (change.type === 'create') {
        for (const id of change.ids) {
          const block = workspace.blockDB_[id];
          const type = block.type;

          if (type in menuLibrary) {
            const nativeCustomContextMenu = block.customContextMenu;
            block.customContextMenu = function(options) {
              if (nativeCustomContextMenu) {
                nativeCustomContextMenu.call(this, options);
              }
              menuLibrary[type](options, this);
            }
          }
        }
      }
    });
  }

  if (workspace) {
    hook();
  } else {
    document.body.addEventListener('click', function(e) {
      if (!hooked && e.target.closest('.see-inside-button')) {
        setImmediate(function() {
          workspace = Blockly.getMainWorkspace();
          hook();
        });
      }
    });
  }

});
