module.exports = (self, options) => {
  self.addRoutes = function () {
    self.route('get', 'all', async (req, res) => {
      try {
        const dialogs = await self.getAll(req);
        return res.send(dialogs);
      } catch (error) {
        self.apos.utils.warn(error);
        return { status: 'error', message: 'Something went wrong' };
      }
    });
  };
};