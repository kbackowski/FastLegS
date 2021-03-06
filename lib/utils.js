/**
 * Module dependencies.
 */

var _ = require('underscore')._;

/**
 * Utils.
 */

module.exports = function() {
  var self = this;

  this.doubleQuote = function(value, outValues) {
    if (this.nil(value)) {
      return "NULL";
    } else if (_(value).isNumber()) {
      return value;
    } else if (_(value).isArray()) {
      return "(" + toCsv(value, outValues) + ")";
    } else if (_(value).isDate()) {
      return '"' + toDateTime(value) + '"';
    } else {
      return '"' + value + '"';
    }
  };

  this.fieldIsValid = function(model, field) {
    var columns = _(model._fields).pluck('column_name');
    return _.include(columns, field.split('.')[0]);
  };

  this.hasWhiteSpace = function(value) {
    return /\s/g.test(value);
  };

  this.keysFromObject = function(fields) {
    return _(fields).chain()
      .map(function(field) {
        return _(field).keys();
      })
      .flatten()
      .uniq()
      .value();
  };

  this.nil = function(value) {
    if (_(value).isUndefined() || _(value).isNull() || _(value).isNaN()) {
      return true;
    } else if (_(value).isArray() && _(value).isEmpty()) {
      return true;
    } else if (value.toString() === '[object Object]' && _(value).isEmpty()) {
      return true;
    } else if (_(value).isString() && _(value).isEmpty()) {
      return true;
    } else {
      return false;
    }
  };


  this.toCsv = function(list, keys, outValues) {
    return  _(list).chain()
            .values()
            .map(function(o) { outValues.push(o); return '$' + outValues.length; })
            .join(',')
            .value();
  };

  this.toPlaceholder = function(list, keys, outValues) {
    return _(list).chain()
           .values()
           .map(function(o) { outValues.push(o); return '?'; })
           .join(', ')
           .value();
  };

  this.toDateTime = function(value) {
    if (_(value).isDate()) {
      return value.getFullYear()
      + '/' + (value.getMonth()+1)
      + '/' + (value.getDate())
      + ' ' + (value.getHours())
      + ':' + (value.getMinutes())
      + ':' + (value.getSeconds());
    }
  };

  this.validFields = function(model, fields) {
    var returnFields = {};
    _(fields).each(function(value, key) {
      if (self.fieldIsValid(model, key)) {
        returnFields[key] = value;
      }
    });
    return returnFields;
  };
}

