module.exports = (self, options) => {
  self.addRoutes = function() {
    self.route('get', 'render/:id', async (req, res) => {
      const box = await self.apos.modules['apostrophe-dialog-box']
        .find(req, { slug: req.params.id })
        .toObject();

      if (box) {
        return res.status(200).send(self.render(
          req,
          `apostrophe-dialog-box-templates:${box.template}.html`,
          { piece: box }
        ));
      }

      return res.status(404).send('');
    });

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
