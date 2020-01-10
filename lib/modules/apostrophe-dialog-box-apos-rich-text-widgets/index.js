const sanitizeHtml = require('sanitize-html');
const _ = require('lodash');

module.exports = {
  improve: 'apostrophe-rich-text-widgets',
  dialogBox: false,
  construct: (self, options) => {
    var superSanitize = self.sanitize;
    self.sanitize = function(req, input, callback) {
      return superSanitize(req, input, function(err, output) {
        if (err) {
          return callback(err);
        }
        // For performance, keep a record of the permalink ids in
        // each widget, if any, so we can query efficiently and skip
        // queries where the feature is not used
        const dialogTriggers = output.content.match(/data-apos-dialog-box-trigger="\w*"/g);
        output.dialogIds = _.map(dialogTriggers, function(trigger) {
          const matches = trigger.split('"');
          const id = matches[1];
          return id;
        });
        return callback(null, output);
      });
    };

    self.on('apostrophe-workflow:resolveRelationships', 'resolveRichTextDialogs', function(req, doc, toLocale) {
      const widgets = [];
      const widgetsByDocId = {};
      self.apos.docs.walk(doc, function(o, k, v, dotPath) {
        if ((o.type === self.name) && (o.dialogIds && o.dialogIds.length)) {
          widgets.push(o);
          _.each(o.dialogIds, function(_id) {
            widgetsByDocId[_id] = widgetsByDocId[_id] || [];
            widgetsByDocId[_id].push(o);
          });
        }
      });

      let ids = _.flatten(
        _.map(widgets, 'dialogIds')
      );
      ids = _.uniq(ids);
      const workflowGuidsToIds = {};
      const idsToNewIds = {};
      return self.apos.docs.db.find({
        _id: {
          $in: ids
        }
      }, {
        workflowGuid: 1
      }).toArray().then(function(docs) {
        _.each(docs, function(doc) {
          workflowGuidsToIds[doc.workflowGuid] = doc._id;
        });
        return self.apos.docs.db.find({
          workflowLocale: toLocale,
          workflowGuid: {
            $in: _.map(docs, 'workflowGuid')
          }
        }, {
          workflowGuid: 1
        }).toArray();
      }).then(function(docs) {
        _.each(docs, function(doc) {
          idsToNewIds[workflowGuidsToIds[doc.workflowGuid]] = doc._id;
        });
        _.each(widgets, function(widget) {
          const ids = widget.dialogIds;
          _.each(ids, function(id) {
            if (!idsToNewIds[id]) {
              return;
            }
            widget.content = widget.content.replace(new RegExp(self.apos.utils.regExpQuote('data-apos-dialog-box-trigger="' + id + '"'), 'g'), 'data-apos-dialog-box-trigger="' + idsToNewIds[id] + '"');
          });
          widget.dialogIds = _.map(widget.dialogIds, function(id) {
            return idsToNewIds[id] || id;
          });
        });
      });
    });

  },
  afterConstruct: (self) => {
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
