module.exports = (self, options) => {
  self.getAll = async req => {
    try {
      // mongo-style criteria object
      const criteria = {}; // all

      // mongo style projection object
      // clamp down what's returned by specifying fields { title: 1, _url: 1, foo: 1, }
      const projection = {};
      const dialogs = await self.find(req, criteria, projection).toArray();
      return dialogs;
    } catch (error) {
      self.apos.utils.warn(error);
      return { status: 'error', message: 'Something went wrong' };
    }
  };

  self.findOne = async (req) => {
    try {
      const dialog = await self.apos.modules['apostrophe-dialog-box']
        .find(req, { _id: req.params.id })
        .toObject();

      return dialog;
    } catch (error) {
      return null;
    }
  };
};
