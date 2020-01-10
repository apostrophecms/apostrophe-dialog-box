module.exports = (self, options) => {

  self.getAll = async req => {
    try {
      // mongo-style criteria object
      const criteria = {}; // all

      // mongo style projection object
      // clamp down what's returned by specifying fields { title: 1, _url: 1, foo: 1, }
      const projection = {
        _id: 1,
        title: 1
      };

      const dialogs = await self
        .find(req, criteria, projection)
        .limit(100)
        .toArray();

      return dialogs;
    } catch (err) {
      self.apos.utils.error(err);
      return { status: 'error', message: 'Something went wrong' };
    }
  };

  self.findOne = async req => {
    let dialog;
    dialog = await self.apos.modules['apostrophe-dialog-box']
      .find(req, { _id: req.params.id })
      .toObject();
    return dialog;
  };
};
