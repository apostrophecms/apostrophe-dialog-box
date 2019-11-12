apos.define('apostrophe-rich-text-widgets-editor', {
  construct: function(self, options) {
    self.beforeCkeditorInline = function() {
      self.config.extraPlugins = (self.config.extraPlugins || '').split(',').concat([ 'dialogbox' ]).join(',');
    };
  }
});