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
filterFunc = {
  fixRegex: function(selector){
    if (!selector) return {};
    if (!selector.$and) return selector;
    var AND = selector.$and;
    var lengthAnd = AND.length;
    for (var i = 0; i < lengthAnd; i++){
      var keyAnd = Object.keys(AND[i])[0];
      if (keyAnd != '$or') continue;
      var OR = AND[i].$or;
      var lengthOr = OR.length;
      for (var j= 0; j < lengthOr; j++) {
        var key = Object.keys(OR[j])[0];
        if (OR[j][key].regex) {
          OR[j][key] = new RegExp(OR[j][key].regex, 'gi');
        }
      }
      console.log('OR selector',OR);
      console.log('OR selector',OR[0].seq);
      AND[i].$or = OR;
      selector.$and = AND;
      return selector;
    }
    return selector;
  }
}