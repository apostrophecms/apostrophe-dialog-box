# apostrophe-dialog-box
`apostrophe-dialog-box` provides simple pop-up dialog boxes for your Apostrophe site. Manage them you would like any other piece type, edit their content in-context, provide your own templates, and have users trigger them with various configuration.

## Installation

`npm install apostrophe-dialog-box`

## Basic configuration

In `app.js`

```js
var apos = require('apostrophe')({
  shortName: 'dialog-sandbox',
  modules: {
    // ... other modules
    'apostrophe-dialog-box': {}
    'apostrophe-dialog-box-modal': {},
  }
});
```

This will give you a piece type called Dialog Boxes in the admin bar as well as several enhancements to existing Apostrophe modules.

## Working with your first Dialog Box

Create a new dialog box from the admin bar. Give it a title and leave the template as `Default`.

You'll be brought back to the manager where your new Dialog Box will have a Launch link in it's table row. Click it!
![Launch the dialog](/images/apos-dialog-launch.png);

This will activate the basic dialog template. It comes stock with basic Apostrophe area. Make your edits and close the dialog naturally and your edits will stick.

## Triggering dialog boxes

Dialog boxes can be triggered by page load or by clicking on elments with the proper `data` attributes attached to them.

### Options for triggering dialog boxes on page load

Page load settings can contain
- Delay (in seconds) for when the dialog box will appear after load
- Ability to set an expiration cookie so that dialogs will only appear once during the expiration lifespan

### Triggering a dialog box on all pages

Go to the *Global* menu and find the Dialog Boxes tab. Join the dialog box you made previously

### Triggering a dialog box on one page

Go to the *Page Settings* of the page the page you want to activate a dialog on. In the Page Settings find the Dialog Boxes tab and configure your dialog

### Triggering a dialog box via text link

You can optionally enable a Dialog Box plugin for your rich text editors by passing the proper options:

```nunjucks
{{ 
  apos.area(data.page, 'body', { 
    widgets: {
      'apostrophe-rich-text': {
        toolbar: [ 'Bold', 'Italic', 'Link', 'Dialogbox' ]
      },
      'apostrophe-video': {}
    }
  }) 
}}
```

![Dialog box icon](/images/dialog-icon.png)

Using it will present you with a text field you can enter as well a dropdown to select which dialog box you'd like to associate with thel ink.

![Dialog box rich text editor](/images/editor.png)

### Triggering a dialog box from other things

All you need to do to trigger a dialog box from custom widgets or UI is add a data attribute to the element with the dialog boxes ID. The attribute is formatted like `data-apos-dialog-box-trigger="APOS_PIECE_ID"` To get the snippet open the Dialog Boxes admin menu, find the dialog box you want to trigger in the manager, and click Copy code to Clipbord (you can attach the attribute to anything you want, not just a link).

![Copy to clipboard](/images/clipboard.png)

## Extending and Customizing Dialog Boxes

You'll probably want to customize and potentially have multiple Dialog Box templates to choose from. In these custom templates you can include projet-level widgets, markup, and CSS.

### Adding a new template

- Create a new template like `/lib/modules/apostrophe-dialog-box/views/dialogs/MY_COOL_DIALOG.html`
- Populate the file with the boilerplate markup
```
{% extends "dialogs/base.html" %}

{% block main %}
  <!-- your areas here -->
{% endblock %}
```
- Override the default template select with your project level choices
in `app.js`

```
'apostrophe-dialog-bo x': {
  addFields: [
    {
      name: 'template',
      label: 'Template',
      type: 'select',
      choices: [
        { label: 'Default', value: 'default' },
        { label: 'My Cool Dialgoog', value: 'MY_COOL_DIALOG' }
      ]
    }
  ]
},
'apostrophe-dialog-box-modal': {},
```

Your template will now be available to editors. You can also change the template of existing dialogs by modifying them in the Dialog Box manager.