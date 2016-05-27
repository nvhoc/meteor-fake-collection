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
  var indexFilterField = collection.indexFilterField;
  if (!source || !source.selector || !source.selector.$and || !indexFilterField) return _.extend(source, {isReset: true});
  var selector = source.selector;
  var length = selector.$and.length;
  for (var i = 0; i < length; i++) {
    var key = Object.keys(selector.$and[i])[0];
    if (key != '$or') continue;
    var keyOr = Object.keys(selector.$and[i].$or[0])[0];
    if (indexFilterField[keyOr] && selector.$and[i].$or[0][keyOr].regex) {
      selector.$and.splice(i, 1);
      if (selector.$and.length == 0){
        delete selector.$and;
      }
      return _.extend(source, {isReset: true});
    }
  }
  return _.extend(source, {isReset: true});
};
filterType.regex.prototype.connect = function (collection, source) {
  if (this.txt == "") {
    return this.removeFilter(collection, source)
  }
  source = this.removeFilter(collection, source);
  var regex = {regex: this.txt};
  var filterField = collection.filterField;
  var or = [];
  if (filterField && Array.isArray(filterField)) {
    var length = filterField.length;
    for (var i = 0; i < length; i++) {
      var field = {};
      field[filterField[i]] = regex;
      or.push(field);
    }
  }
  if (source) {
    source.selector = source.selector || {};
    if (source.selector.$and)
      source.selector.$and.push({$or: or});
    else
      source.selector.$and = [{$or: or}];
  }
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
Mongo.Collection.prototype.filter = function (selector) {
  var self = this;
  var name = self._name;
  this._collection._docs._map = {};
  for (var key in FETCHDATA.indexId[name]) {
    FETCHDATA.indexId[name][key] = selector.connect(self, FETCHDATA.indexId[name][key]);
    this.filterData = function (key, data) {
      return _.extend(selector.connect(self, data), {isReset: false});
    };
    this.fetchData(key, FETCHDATA.indexId[name][key], {notUseFilterData: true});
  }
  if (this.dep)
    this.dep.changed();
};