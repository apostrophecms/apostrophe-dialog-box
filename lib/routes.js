module.exports = (self, options) => {
  self.addRoutes = function() {
    self.route('get', 'render/:id', async (req, res) => {
      try {
        const box = await self.findOne(req);
        if (box) {
          return res.status(200).send(self.render(
            req,
            `apostrophe-dialog-box:dialogs/${box.template}.html`,
            { piece: box }
          ));
        }

        return res.status(404).send('');
      } catch (error) {
        self.apos.utils.error(error);
      }
    });

    self.route('get', 'all', async (req, res) => {
      try {
        const dialogs = await self.getAll(req);
        return res.send(dialogs);
      } catch (error) {
        self.apos.utils.error(error);
        return {
          status: 'error',
          message: 'Something went wrong'
        };
      }
    });
  };
};
