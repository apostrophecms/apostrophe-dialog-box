const sanitizeHtml = require('sanitize-html');
const _ = require('lodash');

module.exports = {
  improve: 'apostrophe-rich-text-widgets',
  dialogBox: false,
  afterConstruct: function(self) {
    if (!self.options.sanitizeHtml) {
      self.options.sanitizeHtml = _.cloneDeep(sanitizeHtml.defaults);
      self.options.sanitizeHtml.allowedAttributes.a.push('data-*');
    } else {

      if (self.options.sanitizeHtml.allowedAttributes && self.options.sanitizeHtml.allowedAttributes.a) {
        self.options.sanitizeHtml.allowedAttributes.a.push('data-*');
      }

      if (self.options.sanitizeHtml.allowedAttributes && !self.options.sanitizeHtml.allowedAttributes.a) {
        self.options.sanitizeHtml.allowedAttributes.a = ['data-*'];
      }

      if (!self.options.sanitizeHtml.allowedAttributes) {
        self.options.sanitizeHtml.allowedAttributes = {
          a: ['data-*']
        };
      }

    }
  }
};
