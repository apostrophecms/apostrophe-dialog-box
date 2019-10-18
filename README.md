# apostrophe-dialog-box

## Purpose of starting point
The hope for this boilerplate is to provide you with a framework for breaking up the module and also to pre-wire much of the non-typical meta Apostrophe programming so that you can focus on front-end implmenetation, triggering, etc.

All modules prefixed with `apostrophe-dialog-box-apos-` are `improve` modules, meaning they interact with existing core modules to add global enhancements. The non-apos prefixed modules are new modules that provide content models, views, and front-end assets.

## Getting started locally
- clone this repo
- run `npm link` inside repo directory
- create boilerplate apostrophe project in a separate directory (npx apostrophe-cli create-project new-boilerplate)
- `cd new-boilerplate`
- `npm i`
- `npm node app.js apostrophe-users:add USERNAME admin
  -- fill in password when prompted
- `npm link apostrophe-dialog-box`
- in the `app.js` of the project add the following to the `modules` object.
```
  'apostrophe-dialog-box': {
    addFields: [
      {
        name: 'template',
        label: 'Template',
        type: 'select',
        choices: [
          { label: 'Default', value: 'default' },
          { label: 'Number Two', value: 'two' }
        ]
      }
    ]
  },
```
This will configure the module and add options project-level dialog templates.
