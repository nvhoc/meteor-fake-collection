// =============================================================================
// ,,,,,,,,, ,,,
// ,,,,,,,, ,,,  Copyright:
// ,,,     ,,,          This source is subject to the Designveloper JSC
// ,,,    ,,,           All using or modify must have permission from us.
// ,,,   ,,,            http://designveloper.com
// ,,,,,,,,
// ,,,,,,,       Name:  DSVScriptTemplate
//
// Purpose:
//          Describe the purpose of the script [short version]
// Class:
//          one ; two ; three
// Functions:
//          one ; two ; three
// Called From:
//          (script) any
// Author:
//          hocnguyen
// Notes:
//          Additional information [long version]
// Changelog:
//          5/17/16 - hocnguyen - Init first revision.
// =============================================================================
filterType = {
  basic: function (selector) {
    var keyArr = Object.keys(selector);
    if (keyArr.length > 1) {
      console.warn("can filter with first key in the selector")
    }
    this.key = keyArr[0];
    this.value = selector[this.key];
  },
  exists: function (selector) {
    this.selector = new filterType.basic(selector);
  },
  regex: function (txt) {
    this.txt = txt;
  }
};
filterType.regex.prototype.removeFilter = function (collection, source) {
  var filterField = collection.filterField;
  if (!source || !source.selector.$or || !filterField || !Array.isArray(filterField)) return _.extend(source, {isReset: true});
  var selector = source.selector;
  var indexOr = {};
  for (var i = 0; i < selector.$or.length; i++) {
    var key = Object.keys(selector.$or[i])[0];
    indexOr[key] = i;
  }
  var length = filterField.length;
  for (var i = 0; i < length; i++) {
    if (typeof indexOr[filterField[i]] == 'number')
      selector.$or.splice(indexOr[filterField[i]], 1);
  }
  if (selector.$or.length == 0) {
    delete selector.$or;
  }
  return _.extend(source, {isReset: true});
};
filterType.regex.prototype.connect = function (collection, source) {
  if (this.txt == "") {
    return this.removeFilter(collection, source)
  }
  var regex = {regex: this.txt};
  var filterField = collection.filterField;
  var selector = {};
  if (filterField && Array.isArray(filterField)) {
    var length = filterField.length;
    selector.$or = [];
    for (var i = 0; i < length; i++) {
      var field = {};
      field[filterField[i]] = regex;
      selector.$or.push(field);
    }
  }
  source.selector = _.extend(source.selector, selector);
  return _.extend(source, {isReset: true});

};
filterType.exists.prototype.connect = function (session, source) {
  var key = this.selector.key;
  var value = this.selector.value;
  if (!this.oldSource)  this.oldSource = {};
  this.oldSource[session] = source;

  if (source && !!source.selector[key]) {
    if (value) {
      if (source.selector[key].$exists === false) {
        source.isReset = true;
        source.notQuery = true;
        return source;
      }
      else {
        source.notQuery = !!FETCHDATA.isGotData[session];
        return source;
      }
    } else {
      if (source.selector[key].$exists === false) {
        source.isReset = true;
        source.notQuery = false;
        return source;
      }
      else {
        source.isReset = true;
        source.notQuery = true;
        return source;
      }
    }
  }
}
Mongo.Collection.prototype.setFilterField = function (fields) {
  this.filterField = fields;
}
Mongo.Collection.prototype.filter = function (selector) {
  var self = this;
  this._collection._docs._map = {};
  for (var key in FETCHDATA.indexId) {
    FETCHDATA.indexId[key] = selector.connect(self, FETCHDATA.indexId[key]);
    this.filterData = function (key, data) {
      return selector.connect(self, data);
    };
    this.fetchData(key, FETCHDATA.indexId[key], {notUseFilterData: true});
  }
  if (this.dep)
    this.dep.changed();
};