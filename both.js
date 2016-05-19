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
  this.filterField = fields;
  var indexOr = {};
  for (var i = 0; i < fields.length; i++) {
    var key = fields[i];
    indexOr[key] = true;
  }
  this.indexFilterField = indexOr;
};