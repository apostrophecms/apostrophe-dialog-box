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

  var elements = [
    {
      type: 'text',
      id: 'text',
      label: 'Text',
      validate: CKEDITOR.dialog.validate.notEmpty('Text can not be empty.')
    },
    {
      type: 'select',
      id: 'dialog',
      label: 'Dialog',
      items: dialogs,
      validate: CKEDITOR.dialog.validate.notEmpty(
        'Please select dialog box to open!'
      )
    }
  ];

  return {
    title: 'Dialog box',
    minWidth: 400,
    minHeight: 200,
    contents: [
      {
        id: 'tab-settings',
        label: 'Settings',
        elements: elements
      }
    ],
    onLoad: function() {
      this.getElement().addClass('dialogbox');
    },
    onOk: function() {
      var item = {
        _id: this.getValueOf('tab-settings', 'dialog'),
        text: this.getValueOf('tab-settings', 'text')
      };

      var element = document.createElement('a');

      element.setAttribute('data-open', item._id);

      element.setAttribute('class', 'apostrophe-dialog-box-trigger');

      element.setAttribute('href', '#');

      element.innerText = item.text;

      editor.insertHtml(element.outerHTML);
    }
  };
});
