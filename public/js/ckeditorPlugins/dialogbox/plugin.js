CKEDITOR.plugins.add('dialogbox', {
  icons: 'dialogbox',
  init: function(editor) {
    var dialogId = 'dialogboxDialog';

    editor.addCommand(
      'insertDialogbox',
      new CKEDITOR.dialogCommand(dialogId, {
        allowedContent: 'a[href,data-*](*)'
      })
    );

    editor.ui.addButton('Dialogbox', {
      label: 'Dialog Box',
      command: 'insertDialogbox',
      toolbar: 'links'
    });

    CKEDITOR.dialog.add(dialogId, this.path + 'dialogs/insert.js');
  }
});
