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
    if (!selector.$or) return selector;
    var OR = selector.$or;
    var lengthOr = OR.length;
    for (var i = 0; i < lengthOr; i++){
      var key = Object.keys(OR[i]);
      if (OR[i][key].regex){
        OR[i][key] = new RegExp(OR[i][key].regex,'gi');
      }
    }
    selector.$or =OR;
    return selector;
  }
}