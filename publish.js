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
Meteor.publish('countByFakeCollection', function (name, session, query) {
  if (!this.userId) return this.ready();
  console.log('query publish '+session,filterFunc.fixRegex(query));
  console.log('query publish count'+session,FETCHDATA.collection[name].find(filterFunc.fixRegex(query)).count());
  Counts.publish(this, session, FETCHDATA.collection[name].find(filterFunc.fixRegex(query)));
});