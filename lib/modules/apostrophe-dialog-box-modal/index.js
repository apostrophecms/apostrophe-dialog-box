module.exports = {
  extend: 'apostrophe-module',
  afterConstruct: async function(self) {
    self.pushAsset('script', 'user', { when: 'user' });
    self.pushAsset('script', 'modal', { when: 'user' });
    self.pushCreateSingleton();
    self.addRoutes();
  },
  construct: async function (self, options) {
    self.addRoutes = function() {
      self.route('post', 'dialog-box-modal', async function (req, res) {
        if (!self.apos.permissions.can(req, 'admin')) {
          return res.status(403).send('forbidden');
        }
        return res.send(self.render(req, 'modal', {}));
      });
    };
  }
};
