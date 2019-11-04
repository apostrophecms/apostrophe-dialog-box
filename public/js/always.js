///
/// This is where you could write logic for what triggers dialogs
///

//This is core logic for time triggers. It can be moved somewhere else in the future

function initDialogs() {
  var _dialogs = document.getElementsByClassName('apos-dialog-box-blackout');

  var _buttons = document.getElementsByClassName(
    'apostrophe-dialog-box-trigger'
  );

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

    if (triggerTimeSec && isActive && !apos.user) {
      var triggerTimeMil = triggerTimeSec * 1000;
      var triggerTimeout = setTimeout(function() {
        closeAllDialogs(_dialogs);
        openDialog(dialog);
        clearTimeout(triggerTimeout);
      }, triggerTimeMil);
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
          var activeDialog = document.getElementsByClassName(
            'apos-dialog-box-blackout--active'
          )[0];

          if (activeDialog) {
            closeDialog(activeDialog);
          }
        }
      });
    }
  }

  function _processButtons() {
    Array.prototype.forEach.call(_buttons, function(button) {
      button.addEventListener('click', function() {
        var triggerId = button.getAttribute('data-open');

        if (!triggerId) {
          return;
        }

        var dialog = document.getElementById(triggerId);

        if (!dialog) {
          return;
        }

        closeAllDialogs(dialog);
        openDialog(dialog);
      });
    });
  }

  return {
    dialogs: _dialogs,
    processDialogs: _processDialogs,
    processButtons: _processButtons
  };
}



function extend(Child, Parent) {
  var Temp = function() {};

  Temp.prototype = Parent.prototype;

  Child.prototype = new Temp();

  Child.prototype.constructor = Child;
}

function Trigger(dialog) {
  this._type = '';

  this.getType = function() {
    return this._type;
  };

  this.canActivate = function() {
    return false;
  };

  this.addListeners = function() {};
}

function TimeTrigger() {
  this._type = '';

  this.canActivate = function(dialog) {
    return true;
  };

  this.addListeners = function(dialog) {};
}

extend(TimeTrigger, Trigger);

function Dialog(id) {
  
  var _element = null;

  this._markup = document.getElementById(id);

  this.time = parseInt(this._markup.getAttribute('data-time'));

  this.session = this._markup.getAttribute('data-session') === '1';

  this.id = id;

  this.element = function () {
    if (_element) {
      return _element;
    }

    _element = document.getElementById(id);

    return _element;
  }

  this.open = function() {
    return this.element().classList.add('apos-dialog-box-blackout--active');
  };

  this.close = function() {
    return this.element().classList.remove('apos-dialog-box-blackout--active');
  };
}

function Renderer(id) {

  var _element = document.getElementById(id);

  this.render = function(dialogId, cb) {
    var http = new XMLHttpRequest();

    http.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        _element.innerHTML = this.responseText;
        
        var dialog = new Dialog(document.getElementById(dialogId));
        
        dialog.open();
      }
    };

    http.open('GET', '/modules/apostrophe-dialog-box/render/' + dialogId, true);

    http.send();
  };
}


function Dialogs(options) {
  var _markups = document.getElementsByClassName(options.markups);

  var _buttons = document.getElementsByClassName(options.buttons);

  var _render  = new Renderer(options.render);
  
  var _dialogs = [];

  this.dialogs = function () {
    return _dialogs;
  }

  this.initButtons = function() {

  }

  this.initDialogs = function () {

  }

}


window.addEventListener('load', function() {

  var _render = new Renderer(
    document.getElementById('apostrophe-dialog-box-render-area')
  );

  var _dialogsMarkup = document.getElementsByClassName(
    'apostrophe-dialog-box-markup'
  );

  var _buttons = document.getElementsByClassName(
    'apostrophe-dialog-box-trigger'
  );

  for (var i = 0; i < _buttons.length; i++) {
    _buttons[i].addEventListener(
      'click',
      (function(button) {
        return function() {
          var dialogId = button.getAttribute('data-open');

          if (!dialogId) {
            return;
          }

          _render.render(dialogId, function(dialog) {});
        };
      })(_buttons[i])
    );
  }
});
