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
  }
});
```

This will give you a piece type called Dialog Boxes in the admin bar as well as several enhancements to existing Apostrophe modules.

## Working with your first Dialog Box

Create a new dialog box from the admin bar. Give it a title and leave the template as `Default`.

You'll be brought back to the manager where your new Dialog Box will have a Launch link in it's table row. Click it!
![Launch the dialog](/images/apos-dialog-launch.png);







## 🚨🚨 WIP, not at a working stage yet!

## Purpose of starting point
The hope for this boilerplate is to provide you with a framework for breaking up the module and also to pre-wire much of the non-typical meta Apostrophe programming so that you can focus on front-end implmenetation, triggering, etc.

All modules prefixed with `apostrophe-dialog-box-apos-` are `improve` modules, meaning they interact with existing core modules to add global enhancements. The non-apos prefixed modules are new modules that provide content models, views, and front-end assets.

### apostrophe-dialog-box
The base piece type for managing dialogs. This is the top level module in this bundle. It will provide any configuration needed for dialogs themselves.

Also comes with an example route that returns a JSON array of all dialog box pieces.. this in itself could be useful but just also fleshes out more bits of Apostrophe you might want.

- [More info on how Apostrophe implements Express routes here](https://docs.apostrophecms.org/apostrophe/technical-overviews/how-apostrophe-handles-requests#express-routes)
- [More on fetching pieces from Apostrophe (docs use callback style but can use async/await, as illustrated in this repo)](https://docs.apostrophecms.org/apostrophe/tutorials/intermediate/model-layer#fetching-pieces-with-apostrophe)

### apostrophe-dialog-box-pages
Provides the show pages for dialogs for natural editing and composing. Also provides an index for admin viewing all dialogs (the path for editors to get to these dialog UIs might change and an index might not be the right choice).

### apostrophe-dialog-box-templates
Provides a central place for template views to be stored. Projects can provide their own templates at the root `/lib/modules/apostrophe-dialog-box-templates/views/MYVIEW.html`. When adding views be sure to append the choices to the dialog piece `templates` field.

### apostrophe-dialog-box-apos-doc-type-manager
Improves all apostrophe doc types (pages, pieces, piece-like things) unless they opt out and adds a join to the dialog box piece type. This is meant to let us trigger a dialog from a page or a piece page (show page).

### apostrophe-dialog-box-apos-pages
Improves `apostrophe-pages` and adds Dialog Box Index as a page type to its options. Dialogs will be composed and edited as if they were normal pages but only seen by admins.

### apostrophe-dialog-box-apos-widgets
Improves all widget types unless they opt out and adds a join to the dialog piece. This will be useful when triggering dialogs if a certain widget enters the viewport.

### apostrophe-dialog-box-apos-rich-text-widgets
Improves `apostrophe-rich-text-widgets` and adds Dialog Box button to the widget as CKEditor plugin. To see "add dialog box" icon in the editor don't forget to add `Dialogbox` item to toolbar, look at this example:
```
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

### apostrophe-dialog-box-apos-files
### apostrophe-dialog-box-apos-groups
### apostrophe-dialog-box-apos-images
### apostrophe-dialog-box-apos-users
Improve modules that have their base module opt-out of this functionality.
