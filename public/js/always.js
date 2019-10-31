///
/// This is where you could write logic for what triggers dialogs
///

//This is core logic for time triggers. It can be moved somewhere else in the future

function initDialogs() {
  var _dialogs = document.getElementsByClassName('apos-dialog-box-blackout');

  function closeDialog(dialog) {
    dialog.classList.remove('apos-dialog-box-blackout--active');
  }

  function closeAllDialogs(dialogs) {
    Array.prototype.forEach.call(dialogs, closeDialog);
  }

  function openDialog(dialog) {
    dialog.classList.add('apos-dialog-box-blackout--active');
  }

  function processDialog(dialog) {
    var triggerTimeSec = dialog.getAttribute('data-time');
    var isActive = dialog.getAttribute('data-active') === '1';

    if (triggerTimeSec && isActive) {
      var triggerTimeMil = triggerTimeSec * 1000;
      var triggerTimeout = setTimeout(function(){
        closeAllDialogs(_dialogs);
        openDialog(dialog);
        clearTimeout(triggerTimeout);
      }, triggerTimeMil)
    }
  
    dialog.addEventListener('click', function(event) {
      if (event.target.classList.contains('apos-dialog-box-blackout--active')) {
        closeDialog(dialog);
      }
    });
  }

  function _processDialogs() {
    if (_dialogs.length) {
      Array.prototype.forEach.call(_dialogs, processDialog);
      document.addEventListener('keyup', function(event) {
        if (event.keyCode === 27) {
          /* 
            We take the first open dialog we have because there should
            not be more than 1 active dialog at any given time.
          */
          var activeDialog = document.getElementsByClassName('apos-dialog-box-blackout--active')[0];

          if(activeDialog) {
            closeDialog(activeDialog);
          }
        }
      });
    }
  }

  return {
    dialogs: _dialogs,
    processDialogs: _processDialogs
  }
}

const dialogs = initDialogs();

dialogs.processDialogs();
