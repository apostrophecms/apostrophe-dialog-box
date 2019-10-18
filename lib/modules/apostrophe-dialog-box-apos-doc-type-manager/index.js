///
/// This improves all apostrophe docs (pages & pieces)
/// so that we can join dialogs to 'pages' for triggering

module.exports = {
  improve: 'apostrophe-doc-type-manager',
  construct: (self, options) => {
    if (options.dialogBox !== false) {
      self.options.addFields = [
        {
          name: '_dialog',
          label: 'Dialog Box to associate',
          type: 'joinByOne',
          withType: 'apostrophe-dialog-box',
          filters: {
            projection: {
              _url: 1,
              slug: 1,
              title: 1,
              type: 1
            }
          }
        }
      ].concat(self.options.addFields || []);

      self.options.arrangeFields = [
        {
          name: 'dialogs',
          label: 'Dialog Boxes',
          fields: [
            '_dialog',
          ],
          last: true
        }
      ].concat(self.options.arrangeFields || []);
    }
  }
};
