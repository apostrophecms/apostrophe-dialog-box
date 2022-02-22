# Changelog

## 1.2.1 (2022-02-22)

- add `trash` to `arrangeFields` to prevent warning during startup

## 1.2.0 (2021-03-24)

- Adds a client side event on closing dialog boxes. Thanks to [Toke Voltelen](https://github.com/Tokimon) for the contribution.
- Major refactoring and code improvement. Thanks again to Toke Voltelen for the contribution.

## 1.1.1 2020-12-16

- Replaces XHR call by `apos.utils.get` to respect locale prefix when used with apostrophe-workflow.

## 1.1.0 2020-08-26

- Dispatched events when dialog box is opened whether automatically or manually.

## 1.0.7 2020-08-12

- Fixes an issue that prevented use of `beforeCkeditorInline` overrides at project level.

## 1.0.6 2020-06-03

- Dialogs triggered by timers are now editable, get their widgets enhanced even in lean mode, and are namespaces to not leak a ton of symbols into window.

## 1.0.5 2020-03-30

- Updates eslint configuration and sets up CircleCI integration.
