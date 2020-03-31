///
/// This improves apostrophe-pages and adds Dialog Indexes to page types
///

module.exports = {

  improve: 'apostrophe-pages',

  construct: (self, options) => {
    self.options.types.push({
      name: 'apostrophe-dialog-box-page',
      label: 'Dialog Box Index'
    });
  }
};
