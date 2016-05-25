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
//          5/18/16 - hocnguyen - Init first revision.
// =============================================================================
Mongo.Collection.prototype.setFilterField = function (fields) {

};
Mongo.Collection.prototype.setFetch = function (data) {
  var rest = data.rest;
  var fields = data.regex;
  if (!rest)
    this._rest = "fetch_" + this._name;
  else
    this._rest = rest;
  this.filterField = fields;
  var indexOr = {};
  for (var i = 0; i < fields.length; i++) {
    var key = fields[i];
    indexOr[key] = true;
  }
  this.indexFilterField = indexOr;
  FETCHDATA.collection[this._name] = this;
};

FETCHDATA = {
  isGotData: {},
  subFetch: {},
  pageFetch: {},
  indexId: {},
  indexPage: {},
  collection:{}
};