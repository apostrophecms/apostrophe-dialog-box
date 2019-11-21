module.exports = {
  moogBundle: {
    directory: 'lib/modules',
    modules: [
      // improvements
      'apostrophe-dialog-box-apos-pages',
      // 'apostrophe-dialog-box-apos-widgets',
      'apostrophe-dialog-box-apos-doc-type-manager',

      // modules that should opt-out
      'apostrophe-dialog-box-apos-files',
      'apostrophe-dialog-box-apos-groups',
      'apostrophe-dialog-box-apos-images',
      'apostrophe-dialog-box-apos-users',
      'apostrophe-dialog-box-apos-rich-text-widgets'
    ]
  },
  name: 'apostrophe-dialog-box',
  extend: 'apostrophe-pieces',
  label: 'Dialog Box',
  alias: 'dialog',
  pluralLabel: 'Dialog Boxes',
  dialogBox: false,
  addFields: [
    {
      name: 'template',
      label: 'Template',
      type: 'select',
      choices: [{ label: 'Default', value: 'default' }]
    }
  ],
  removeFields: ['tags'],
  construct: function(self, options) {
    options.arrangeFields = options.arrangeFields.concat([
      {
        name: 'basics',
        label: 'Basics',
        fields: ['title', 'template']
      },
      {
        name: 'admin',
        label: 'Admin',
        fields: ['published', 'slug']
      }
    ]);

    require('./lib/routes')(self, options);
    require('./lib/api')(self, options);
  },
  afterConstruct: async function(self) {
    self.addRoutes();
    self.pushAsset('script', 'always', { when: 'lean' });
    self.pushAsset('script', 'user', { when: 'user' });
    self.pushAsset('stylesheet', 'dialog');

    self.apos.templates.prepend('body', req => {
      const page = req.data.page;

      if (!page) {
        return;
      }

      if (page.type === 'apostrophe-dialog-box-page' && req.data) {
        return self.render(
          req,
          'apostrophe-dialog-box:dialogs/list_all.html',
          {
            pieces: req.data.pieces || []
          }
        );
      }

      const dialogs = Object.assign([], page.dialogs || []);

      const global =
        req.data.global && req.data.global.dialogs
          ? req.data.global.dialogs
          : [];

      for (const globalDialog of global) {
        const inArray = !!dialogs.find(
          dialog => dialog.dialogId === globalDialog.dialogId
        );

        if (!inArray) {
          dialogs.push(globalDialog);
        }
      }

      return self.render(req, 'apostrophe-dialog-box:dialogs/list.html', {
        dialogs: dialogs
      });
    });
  }
};
