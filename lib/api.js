const Promise = require('bluebird');
module.exports = (self, options) => {

  self.getDraftAndLiveWrapper = (req, id, callback) => {
    return self.apos.modules['apostrophe-workflow'].getDraftAndLive(req, id, {}, function(err, _draft, _live) {
      if (err) {
        return callback(err);
      }
      return callback(null, _live);
    });
  };

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
    try {
      let dialog;
      if (req.session.workflowMode && req.session.workflowMode === 'live') {
        // rich text dialog links will always contain the draft id,
        // transpose this to live if necessary

        // we could still have a good join, give it a second
        dialog = await self.apos.modules['apostrophe-dialog-box']
          .find(req, { _id: req.params.id })
          .toObject();

        if (!dialog) {
          // at this point we likely need to go look for the live version
          const get = Promise.promisify(self.getDraftAndLiveWrapper);
          return get(req, req.params.id).then(live => {
            return live;
          }).catch((err) => {
            self.apos.utils.error(err);
          });
        } else {
          return dialog;
        }
      } else {
        dialog = await self.apos.modules['apostrophe-dialog-box']
          .find(req, { _id: req.params.id })
          .toObject();
        return dialog;
      }
    } catch (err) {
      return self.apos.utils.warn(err);
    }
  };
};
