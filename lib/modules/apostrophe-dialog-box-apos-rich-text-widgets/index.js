module.exports = {
  improve: 'apostrophe-rich-text-widgets',
  sanitizeHtml: {
    allowedTags: [ 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
      'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
      'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre',
      'sup', 'sub'
    ],
    allowedAttributes: {
      a: [ 'href', 'name', 'target', 'class', 'data-*' ],
      img: [ 'src' ]
    },
    selfClosing: [ 'img', 'br', 'hr', 'area', 'base', 'basefont',
      'input', 'link', 'meta' ],
    allowedSchemes: [ 'http', 'https', 'ftp', 'mailto' ],
    allowedSchemesByTag: {}
  },
  construct: function(self, options) {
    console.log(self.sanitizeHtml);
  }
};