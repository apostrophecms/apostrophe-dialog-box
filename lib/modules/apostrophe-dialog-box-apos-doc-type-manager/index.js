module.exports = {
  improve: 'apostrophe-doc-type-manager',
  construct: (self, options) => {
    if (options.dialogBox !== false) {
      self.options.addFields = [
        {
          name: 'dialogs',
          label: 'Dialogs',
          type: 'array',
          titleField: 'title',
          schema: [
            {
              name: 'title',
              type: 'string',
              label: 'Dialog title'
            },
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
            },
            {
              name: 'time',
              label: 'Trigger time (seconds)',
              type: 'integer',
              required: true
            },
            {
              name: 'session',
              label: 'Trigger one per session?',
              type: 'boolean',
              choices: [
                {
                  label: 'No',
                  value: false
                },
                {
                  label: 'Yes',
                  value: true,
                  showFields: [ 'sessionTime' ]
                }
              ]
            },
            {
              name: 'sessionTime',
              label: 'Session time in hours',
              type: 'integer',
              required: true
            }
          ]
        }
      ].concat(self.options.addFields || []);

      self.options.arrangeFields = [
        {
          name: 'dialogs',
          label: 'Dialog Boxes',
          fields: [ 'dialogs' ],
          last: true
        }
      ].concat(self.options.arrangeFields || []);
    }
  }
};
