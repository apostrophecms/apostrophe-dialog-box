CKEDITOR.dialog.add('dialogboxDialog', function(editor) {
  var request = new XMLHttpRequest();

  request.open('GET', '/modules/apostrophe-dialog-box/all', false);

  request.send(null);

  var dialogs = [];

  if (request.status === 200) {
    var data = [];

    if (request.responseText) {
      try {
        data = JSON.parse(request.responseText);
      } catch (e) {
        data = [];
      }
    }

    for (var i = 0; i < data.length; i++) {
      dialogs.push([data[i].title, data[i]._id]);
    }
  }

  return {
    title: 'Dialog box properties',
    minWidth: 400,
    minHeight: 200,
    contents: [
      {
        id: 'tab-basic',
        label: 'Basic Settings',
        elements: [
          {
            type: 'text',
            id: 'title',
            label: 'Title',
            validate: CKEDITOR.dialog.validate.notEmpty(
              'Abbreviation field cannot be empty.'
            )
          },
          {
            type: 'select',
            id: 'dialog',
            label: 'Dialog',
            items: dialogs,
            validate: CKEDITOR.dialog.validate.notEmpty(
              'Explanation field cannot be empty.'
            )
          }
        ]
      }
    ],
    onOk: function() {
      var item = {
        _id: this.getValueOf('tab-basic', 'dialog'),
        title: this.getValueOf('tab-basic', 'title')
      };
      editor.insertHtml(
        '<a data-open="' +
          item._id +
          '" href="javascript:void(0);" class="apostrophe-dialog-box-trigger">' +
          item.title +
          '</a>'
      );
    }
  };
});
