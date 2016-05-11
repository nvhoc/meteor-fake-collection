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
//          1/19/16 - hocnguyen - Init first revision.
// =============================================================================
(function () {
  fakeCursor = function(data){
    this.data = data;
  };
  fakeCursor.prototype.fetch = function(){
    return this.data;
  };
  fakeCursor.prototype.count = function(){
    return this.data.length;
  };
  fakeCollection = function (name) {
    this.dep = new Tracker.Dependency;
    this._name = name;
    var data = [];
    var index = {};
    var self = this;
    this.getIndex = function (key, data) {
      if (!index[key] || !index[key][data])
        return [];
      return index[key][data];
    };
    this.pushData = function (selector, doc) {
      for (var key in doc) {
        if (!index[key]) {
          index[key] = {};
        }
        if (!index[key][doc[key]])
          index[key][doc[key]] = [];
        index[key][doc[key]].push(data.length);
      }
      data.push(doc);
    };
    this.checkNotInSelector = function (selector, cb) {
      var search = null;
      for (var key in selector) {
        if (search) {
          var tmpSearch = self.getIndex(key, selector[key]);
          if (!tmpSearch) {
            cb.onYes();
            return;
          }
          var resSearch = [];
          var check = !tmpSearch.every(function (element) {
            if (search.indexOf(element) != -1) {
              resSearch.push(element);
              return false;
            }
            return true;
          });
          if (!check) {
            cb.onYes();
            return;
          }
          search = resSearch;
        }
        search = self.getIndex(key, selector[key]);
        if (search.length == 0) {
          cb.onYes();
          return;
        }
      }
      cb.onNo(search);
    };
    this.getData = function () {
      return data;
    };
    this.setData = function (index, doc) {
      data[index] = doc;
    };
    this.removeData = function (index) {
      data[index] = null;
    };
  };
  // _id:{'asdasdasd':[1,2,4]

  fakeCollection.prototype.findOne = function (selector) {
    var self = this;
    if (typeof selector != 'object')
      selector = {_id: selector};
    var res = self.find(selector, true).fetch();
    if (res && res.length > 0) {
      return res[0];
    }
    return undefined;
  };

  fakeCollection.prototype.find = function (selector, isOne) {
    var self = this;
    self.dep.depend();
    //var f_args = Array.prototype.slice.call(arguments,1);
    var res = [];
    self.checkNotInSelector(selector, {
      'onYes': function () {
        return;
      },
      'onNo': function (search) {
        var data = self.getData();
        if (!search || search.length == 0) {
          res = data;
          return;
        }
        if (isOne) {
          if (!!data[search[0]])
            res.push(data[search[0]]);
          return;
        }
        for (var i = 0; i < search.length; i++) {
          if (!!data[search[i]])
            res.push(data[search[i]]);
        }
      }
    });
    return new fakeCursor(res);
  };
  fakeCollection.prototype.upsert = function (selector, doc) {
    var self = this;
    self.checkNotInSelector(selector, {
      'onYes': function () {
        self.pushData(selector, doc);
      },
      'onNo': function (search) {
        if (!search || search.length == 0) {
          return;
        }
        for (var i = 0; i < search.length; i++) {
          self.setData(search[i], doc);
        }
      }
    });
  }
  fakeCollection.prototype.fakeRemove = function (selector) {
    var self = this;
    self.checkNotInSelector(selector, {
      'onYes': function () {
        return;
      },
      'onNo': function (search) {
        if (!search || search.length == 0) {
          return;
        }
        for (var i = 0; i < search.length; i++) {
          self.removeData(search[i]);
        }
      }
    });
  }
}).call(this);