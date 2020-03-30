// This is core logic for time triggers. It can be moved somewhere else in the future

window.APOS_DIALOGS = {};

var dialogClasses = {
  markups: 'apostrophe-dialog-box-markup',
  render: 'apostrophe-dialog-box-render-area',
  active: 'apos-dialog-box-blackout--active',
  overlay: 'apos-dialog-box-blackout',
  closeIcon: 'apos-dialog-box-close-icon'
};

var dialogAttrubutes = {
  buttons: '[data-apos-dialog-box-trigger]',
  clipboard: '[data-apos-dialog-box-copy-to-clipboard]'
};

var helpers = {
  closeDialog: function(event) {
    if (event.target.classList.contains(dialogClasses.active)) {
      event.target.classList.remove(dialogClasses.active);
    }

    if (event.target.classList.contains(dialogClasses.closeIcon)) {
      event.target
        .closest('.' + dialogClasses.active)
        .classList.remove(dialogClasses.active);
    }
  }
};

function extend(Child, Parent) {
  var Temp = function() {};

  Temp.prototype = Parent.prototype;

  Child.prototype = new Temp();

  Child.prototype.constructor = Child;
}

function Dialog(id, options) {
  if (!options) {
    options = {};
  }

  var _element = null;

  this._markup = document.getElementById('markup:' + id);

  this.time = this._markup
    ? parseInt(this._markup.getAttribute('data-time'))
    : null;

  this.session = this._markup
    ? this._markup.getAttribute('data-session') === '1'
    : false;

  this.sessionTime = this._markup
    ? this._markup.getAttribute('data-session-time')
    : null;

  this.id = id;

  this.getExpirationTime = function () {
    var cookies = document.cookie.split(';');
    var dialogCookie = cookies.find(function(cookie) {
      return cookie.indexOf(id) !== -1;
    });

    if (dialogCookie) {
      return dialogCookie.split('=')[1];
    }

    return null;
  };

  this.sessionExpired = function (time) {
    var currentTime = new Date().getTime();

    return currentTime > time;
  };

  this.checkSession = function () {
    if (!this.session || !this.sessionTime || options.disableSession) {
      return true;
    }

    var expirationTime = this.getExpirationTime();

    if (expirationTime) {
      return this.sessionExpired(expirationTime);
    }

    this.setDialogSessionTime();

    return true;
  };

  this.setDialogSessionTime = function () {
    var currentTime = new Date();
    var expirationTime = currentTime.setTime(
      currentTime.getTime() + (this.sessionTime * 60 * 60 * 1000)
    );

    document.cookie = this.id + '=' + expirationTime;
  };

  this.element = function () {
    if (_element) {
      return _element;
    }

    _element = document.getElementById(id);

    if (!_element) {
      _element = document.getElementById(dialogClasses.render).firstElementChild;
    }

    if (_element) {
      _element.addEventListener('click', helpers.closeDialog);
    }

    return _element;
  };

  this.open = function () {
    return this.element().classList.add(dialogClasses.active);
  };

  this.close = function() {
    return this.element().classList.remove(dialogClasses.active);
  };
}

function Renderer(id) {
  var _element = document.getElementById(id);

  this.render = function(dialogId, callback) {
    var http = new window.XMLHttpRequest();

    http.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        _element.innerHTML = this.responseText;
        if (callback) {
          callback();
        }
      }
    };

    http.open('GET', '/modules/apostrophe-dialog-box/render/' + dialogId, true);

    http.send();
  };
}

function Trigger(render, dialogs) {
  this._type = '';

  this.getType = function() {
    return this._type;
  };

  this.canActivate = function(dialog) {
    return false;
  };

  this.addListeners = function(dialog) {};
}

function TimeTrigger(render, dialogs) {
  this._type = 'time';

  this.canActivate = function(dialog) {
    return !!dialog.time && dialog.checkSession();
  };

  this.addListeners = function(dialog) {
    var triggerTime = dialog.time * 1000;
    var triggerTimeout = setTimeout(function() {
      dialogs.close();
      render.render(dialog.id, function() {
        dialog.open();
      });
      clearTimeout(triggerTimeout);
    }, triggerTime);
  };
}

extend(TimeTrigger, Trigger);

function Dialogs() {
  var _markups = document.getElementsByClassName(dialogClasses.markups);

  var _buttons = document.querySelectorAll(dialogAttrubutes.buttons);

  var _clipboards = document.querySelectorAll(dialogAttrubutes.clipboard);

  var _render = new Renderer(dialogClasses.render);

  var _triggers = [new TimeTrigger(_render, this)];

  this.close = function() {
    var dialogs = document.getElementsByClassName(dialogClasses.overlay);
    for (var i = 0; i < dialogs.length; i++) {
      var element = dialogs[i];

      if (element) {
        element.classList.remove(dialogClasses.active);
      }
    }
  };

  this.initButtons = function() {
    for (var i = 0; i < _buttons.length; i++) {
      _buttons[i].addEventListener(
        'click',
        (function(button) {
          return function(event) {
            event.preventDefault();

            var dialogId = button.getAttribute('data-apos-dialog-box-trigger');

            if (!dialogId) {
              return;
            }

            var exists = document.getElementById(dialogId);

            // If dialog exists then we don't need to render
            if (exists) {
              return new Dialog(dialogId, {
                disableSession: true
              }).open();
            }

            return _render.render(dialogId, function() {
              var dialog = new Dialog(dialogId, {
                disableSession: true
              });
              dialog.open();

              // enhance the new areas
              if (apos.emit) {
                apos.emit('enhance', $('#apostrophe-dialog-box-render-area'));
              }

            });
          };
        })(_buttons[i])
      );
    }
  };

  this.initDialogs = function() {
    for (var i = 0; i < _markups.length; i++) {
      var dialog = new Dialog(_markups[i].getAttribute('data-id'));
      for (var j = 0; j < _triggers.length; j++) {
        if (_triggers[j].canActivate(dialog)) {
          (function(dialogInstance) {
            _triggers[j].addListeners(dialogInstance);
          })(dialog);
        }
      }
    }
  };

  this.initCopyToClipboards = function () {
    for (var i = 0; i < _clipboards.length; i++) {
      _clipboards[i].addEventListener(
        'click',
        (function(button) {
          return function(event) {
            event.preventDefault();
            var el = document.createElement('textarea');
            el.value = '<a href="#" data-apos-dialog-box-trigger="' + button.getAttribute('data-apos-dialog-box-copy-to-clipboard') + '">Launch Dialog</a>';
            el.setAttribute('readonly', '');
            el.style.position = 'absolute';
            el.style.left = '-9999px';
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            apos.notify('Copied snippet to clipboard', { type: 'success' });
          };
        })(_clipboards[i])
      );
    }
  };
}

window.APOS_DIALOGS.init = function () {
  var dialogs = new Dialogs();

  dialogs.initButtons();

  dialogs.initDialogs();

  dialogs.initCopyToClipboards();

  document.addEventListener('keyup', function(event) {
    if (event.keyCode === 27) {
      dialogs.close();
    }
  });
};

window.addEventListener('load', function() {
  window.APOS_DIALOGS.init();
});
