///
/// This improves apostrophe-widgets and adds joins to dialogs
///

module.exports = {
  improve: 'apostrophe-widgets',
  beforeConstruct: (self, options) => {
    if (options.dialogBox !== false) {
      options.addFields = [
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
      ].concat(options.addFields || []);

      options.arrangeFields = [
        {
          name: 'dialogs',
          label: 'Dialog Boxes',
          fields: [
            '_dialog',
          ],
          last: true
        }
      ].concat(options.arrangeFields || []);
    }
  }
};