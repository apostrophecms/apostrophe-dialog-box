apos.define('dialog-box-modal', {
  extend: 'apostrophe-modal',
  source: 'dialog-box-modal',

  construct: function(self, options) {
    self.beforeShow = function(callback) {
      var request = $.ajax({
        url: '/modules/apostrophe-dialog-box/render/' + options.id,
        method: 'GET',
        dataType: 'html'
      });

      request.done(function (msg) {
        var $container = self.$el.find('[data-apos-dialog-modal-container]');
        $container.html(msg);
        $container.find('.apos-dialog-box-blackout').addClass('apos-dialog-box-blackout--active');
        apos.emit('enhance', $container);
      });

      return setImmediate(callback);
    };
  }
});
