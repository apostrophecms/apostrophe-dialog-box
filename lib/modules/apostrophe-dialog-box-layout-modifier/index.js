module.exports = {
  improve: 'apostrophe-templates',
  ignoreNoCodeWarning: true,
  construct: async (self, options) => {
    self.beforeShow = async (req, callback) => {
      const dialogs = await self.apos.modules['apostrophe-dialog-box']
        .find({}, {})
        .toArray();

      console.log(dialogs);

      self.addHelpers({
        dialogs: dialogs
      });

      return callback(null);
    };
  }
};
