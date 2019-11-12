apos.define('apostrophe-rich-text-widgets-editor', {
  construct: function(self, options) {
    self.beforeCkeditorInline = function() {
      // console.log(self.config.allowedContent);
      self.config.extraPlugins = (self.config.extraPlugins || '')
        .split(',')
        .concat(['dialogbox'])
        .join(',');

      self.config.extraAllowedContent = '*(*);*{*}';
    };
  }
});
