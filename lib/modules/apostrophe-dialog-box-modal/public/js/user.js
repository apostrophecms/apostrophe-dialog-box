apos.define('apostrophe-dialog-box-modal', {
  extend: 'apostrophe-context',
  construct: function(self, options) {
    self.open = function(id) {
      var options = {};
      options.id = id;
      options.action = self.action;
      return apos.create('dialog-box-modal', options);
    };
  }
});

$('body').on('click', '[data-apos-dialog-box-modal-trigger]', function() {
  return apos.modules['apostrophe-dialog-box-modal'].open($(this).attr('data-apos-dialog-box-modal-trigger'));
});
