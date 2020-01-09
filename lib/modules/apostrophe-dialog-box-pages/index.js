module.exports = {
  extend: 'apostrophe-pieces-pages',
  label: 'Dialog Box Page',
  name: 'apostrophe-dialog-box-page',
  addFields: [],
  perPage: 999,
  construct: (self, options) => {
    self.beforeIndex = async (req, callback) => {
      // indexes should not be seen by anon users
      if (!req.user) {
        req.redirect = '/';
      }
      return callback(null);
    };

    self.beforeShow = async (req, callback) => {
      // dialog box show pages should not be seen by users
      if (!req.user) {
        req.redirect = '/';
      }
      return callback(null);
    };
  }
};
