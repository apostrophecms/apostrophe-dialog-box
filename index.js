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
      name: 'example',
      label: 'Example String',
      type: 'string'
    },
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
    fields: ['title', 'example']
  }],


  

  // afterConstruct: function(self) {},
  // beforeConstruct: function(self, options) {},
  afterConstruct: function(self) {
    self.pushAsset('script', 'always', { when: 'always' });
    self.pushAsset('script', 'always', { when: 'lean' });
  }
}