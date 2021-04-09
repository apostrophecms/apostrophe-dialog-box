// This is core logic for time triggers. It can be moved somewhere else in the future.
// It is inside a self-executing function to avoid leaks in the global namespace.

(function() {
  var dialogClasses = {
    markups: 'apostrophe-dialog-box-markup',
    render: 'apostrophe-dialog-box-render-area',
    active: 'apos-dialog-box-blackout--active',
    overlay: 'apos-dialog-box-blackout',
    closeIcon: 'apos-dialog-box-close-icon'
  };

  var dialogAttributes = {
    buttons: '[data-apos-dialog-box-trigger]',
    clipboard: '[data-apos-dialog-box-copy-to-clipboard]'
  };

  window.APOS_DIALOGS = {
    dialogs: {},
    dialogClasses: dialogClasses,
    dialogAttributes: dialogAttributes
  };

  function getDialog(id, options) {
    var dialogs = window.APOS_DIALOGS.dialogs;
    var dialog = dialogs[id];

    if (!dialog) {
      dialog = new Dialog(id, options);
      dialogs[id] = dialog;
    }

    return dialog;
  }

  function triggerEvent(name, id) {
    apos.utils.emit(document.body, 'apostrophe-dialog-box:' + name, {
      dialogId: id
    });
  }

  function Dialog(id, options) {
    if (!options) {
      options = {};
    }

    var _element = null;

    this._markup = document.getElementById('markup:' + id);

    this.time = this._markup
      ? parseInt(this._markup.dataset.time)
      : null;

    this.session = this._markup
      ? this._markup.dataset.session === '1'
      : false;

    this.sessionTime = this._markup
      ? this._markup.dataset.sessionTime
      : null;

    this.id = id;

    this.parameters = options.parameters || {};

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
        var renderElm = document.getElementById(dialogClasses.render);

        if (renderElm) {
          _element = renderElm.firstElementChild;
        }
      }

      if (_element) {
        var self = this;

        _element.addEventListener('click', function (event) {
          var cns = event.target.classList;
          var isActiveDialog = cns.contains(dialogClasses.active);
          var isCloseButton = cns.contains(dialogClasses.closeIcon);

          (isActiveDialog || isCloseButton) && self.close();
        });
      }

      return _element;
    };

    this.open = function () {
      var elm = this.element();
      if (!elm) {
        return;
      }

      var activeCn = dialogClasses.active;

      if (!elm.classList.contains(activeCn)) {
        elm.classList.add(dialogClasses.active);
        triggerEvent('opened', this.id);
      }
    };

    this.close = function() {
      var elm = this.element();
      if (!elm) {
        return;
      }

      var activeCn = dialogClasses.active;

      if (elm.classList.contains(activeCn)) {
        elm.classList.remove(activeCn);
        triggerEvent('closed', this.id);
      }
    };
  }

  function Renderer(id) {
    var _element = document.getElementById(id);

    this.render = function(dialogId, callback) {
      apos.utils.get('/modules/apostrophe-dialog-box/render/' + dialogId, {}, function (err, response) {
        if (err) {
          return;
        }

        _element.innerHTML = response;

        if (apos.emit) {
          apos.emit('enhance', window.$(_element));
        } else {
          apos.utils.runPlayers(_element);
        }

        if (callback) {
          callback();
        }
      });
    };
  }

  function TimeTrigger(render, dialogs) {
    this._type = 'time';

    this.getType = function() {
      return this._type;
    };

    this.canActivate = function(dialog) {
      return !!dialog.time && dialog.checkSession();
    };

    this.addListeners = function(dialog) {
      var triggerTime = dialog.time * 1000;
      var triggerTimeout = setTimeout(function() {
        dialogs.close();

        render.render(dialog.id, function() {
          dialog.open();
          triggerEvent('time-triggered', dialog.id);
        });

        clearTimeout(triggerTimeout);
      }, triggerTime);
    };
  }

  function Dialogs() {
    var _markups = document.getElementsByClassName(dialogClasses.markups);

    var _buttons = document.querySelectorAll(dialogAttributes.buttons);

    var _clipboards = document.querySelectorAll(dialogAttributes.clipboard);

    var _render = new Renderer(dialogClasses.render);

    var _triggers = [ new TimeTrigger(_render, this) ];

    this.close = function() {
      var dialogs = window.APOS_DIALOGS.dialogs;

      for (var id in dialogs) {
        dialogs[id].close();
      }
    };

    this.initButtons = function() {
      for (var i = 0; i < _buttons.length; i++) {
        _buttons[i].addEventListener(
          'click',
          (function(button) {
            return function(event) {
              event.preventDefault();

              var dialogId = button.dataset.aposDialogBoxTrigger;
              var parameters = JSON.parse(button.dataset.aposDialogBoxParameters) || {};

              if (!dialogId) {
                return;
              }

              var dialogElm = document.getElementById(dialogId);

              // If dialog exists then we don't need to render
              if (dialogElm) {
                return getDialog(dialogId, _.assign({ disableSession: true }, { parameters: parameters })).open();
              }

              return _render.render(dialogId, function() {
                getDialog(dialogId, _.assign({ disableSession: true }, { parameters: parameters })).open();

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
        var dialog = getDialog(_markups[i].dataset.id);

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
              el.value = '<a href="#" data-apos-dialog-box-trigger="' + button.dataset.aposDialogBoxCopyToClipboard + '">Launch Dialog</a>';
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
      // NOTE: "keyCode" is deprecated but needed for old browsers
      if (event.key === 'Escape' || event.keyCode === 27) {
        dialogs.close();
      }
    });
  };

  window.addEventListener('load', function() {
    window.APOS_DIALOGS.init();
  });
})();
