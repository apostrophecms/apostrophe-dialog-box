function buttonClickTrigger(event) {
  var snippetId = event.target.getAttribute('data-open');

  if (!snippetId) {
    return;
  }

  var snippet = document.getElementById('snippet:' + snippetId);

  if (!snippet) {
    return;
  }

  snippet.classList.toggle('active');
}

window.addEventListener('load', function() {
  CKEDITOR.plugins.addExternal(
    'dialogbox',
    apos.prefix +
      '/modules/apostrophe-dialog-box/js/ckeditorPlugins/dialogbox/',
    'plugin.js'
  );

  var _buttons = document.getElementsByClassName('dialog-box-code-snippet-trigger');

  for (var i = 0; i < _buttons.length; i++) {
    _buttons[i].addEventListener('click', buttonClickTrigger);
  }
});
