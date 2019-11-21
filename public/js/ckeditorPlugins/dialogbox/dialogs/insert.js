CKEDITOR.dialog.add('dialogboxDialog', function(editor) {
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
      items: [],
      validate: CKEDITOR.dialog.validate.notEmpty(
        'Please select dialog box to open!'
      ),
      onShow: function() {
        var wrapper = this.getElement().$;

        if (!wrapper) {
          return;
        }

        var select = wrapper.getElementsByTagName('select');

        if (!select || !select.length) {
          return;
        }

        select = select[0];

        select.innerHTML = '';

        select.setAttribute('disabled', 'disabled');

        var loading = document.createElement('option');

        loading.innerText = 'Loading the dialogs ...';

        select.append(loading);

        var request = new window.XMLHttpRequest();

        request.onreadystatechange = function() {
          if (this.readyState === 4 && this.status === 200) {
            var data = [];

            if (request.responseText) {
              try {
                data = JSON.parse(request.responseText);
              } catch (e) {
                data = [];
              }
            }

            if (!data.length) {
              return;
            }

            select.innerHTML = '';

            for (var i = 0; i < data.length; i++) {
              var option = document.createElement('option');
              option.innerText = data[i].title;
              option.setAttribute('value', data[i]._id);
              select.append(option);
            }

            select.removeAttribute('disabled');
          }
        };

        request.open('GET', '/modules/apostrophe-dialog-box/all');

        request.send();
      }
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

      element.setAttribute('data-apos-dialog-box-trigger', item._id);

      element.setAttribute('href', '#');

      element.innerText = item.text;

      editor.insertHtml(element.outerHTML);
    }
  };
});
