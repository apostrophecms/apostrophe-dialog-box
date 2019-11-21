window.addEventListener('load', function() {
  CKEDITOR.plugins.addExternal(
    'dialogbox',
    apos.prefix +
      '/modules/apostrophe-dialog-box/js/ckeditorPlugins/dialogbox/',
    'plugin.js'
  );
});
