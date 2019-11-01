module.exports = {
  moogBundle: {
    directory: 'lib/modules',
    modules: [
      // dialog functionality
      'apostrophe-dialog-box-pages',
      'apostrophe-dialog-box-templates',
      // improvements
      'apostrophe-dialog-box-apos-pages',
      'apostrophe-dialog-box-apos-widgets',
      'apostrophe-dialog-box-apos-doc-type-manager',
      'apostrophe-dialog-box-layout-modifier',

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
  construct: function(self, options) {
    options.addFields = options.addFields.concat([
      {
        name: 'time',
        label: 'Trigger time (seconds)',
        type: 'integer'
      }
    ]);

    options.arrangeFields = options.arrangeFields.concat([
      {
        name: 'basics',
        label: 'Basics',
        fields: ['title', 'slug', 'tags', 'published']
      },
      {
        name: 'info',
        label: 'Info',
        fields: ['time', 'template']
      }
    ]);

    require('./lib/routes')(self, options);
    require('./lib/api')(self, options);
  },
  afterConstruct: async function(self) {
    self.addRoutes();
    self.pushAsset('script', 'always', { when: 'lean' });
    self.pushAsset('stylesheet', 'dialog');

    self.on('apostrophe-pages:beforeSend', 'addWeather', async function() {
      const dialogs = await self.apos.modules['apostrophe-dialog-box']
        .find({}, {})
        .toArray();

      self.addHelpers({
        dialogs: dialogs
      });
    });
  }
};
