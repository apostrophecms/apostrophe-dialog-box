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

      // modules that should opt-out
      'apostrophe-dialog-box-apos-files',
      'apostrophe-dialog-box-apos-groups',
      'apostrophe-dialog-box-apos-images',
      'apostrophe-dialog-box-apos-users',
      'apostrophe-dialog-box-apos-rich-text-widgets',
    ]
  },

  name: 'apostrophe-dialog-box',
  extend: 'apostrophe-pieces',
  label: 'Dialog Box',
  pluralLabel: 'Dialog Boxes',
  dialogBox: false,
  addFields: [
    {
      name: 'template',
      label: 'Template',
      type: 'select',
      choices: [
        { label: 'Default', value: 'default' }
      ]
    }
  ],
  arrangeFields: [{
    name: 'basics',
    label: 'Basics',
    fields: ['title', 'slug', 'tags', 'published', 'template']
  }],

  construct: function (self, options) {
    require('./lib/routes')(self, options);
    require('./lib/api')(self, options);
  },

  afterConstruct: function(self) {
    self.addRoutes();
    self.pushAsset('script', 'always', { when: 'lean' });
  }
}