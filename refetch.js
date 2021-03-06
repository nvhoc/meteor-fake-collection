Mongo.Collection.prototype.fetchReset = function () {
  this._collection._docs._map = {};
  FETCHDATA.subFetch = {};
  FETCHDATA.pageFetch = {};
  for (var key in FETCHDATA.indexId)
    FETCHDATA.indexId[key] = {};
  FETCHDATA.indexPage = {};
  FETCHDATA.isGotData = {};
}
Mongo.Collection.prototype.fetchData = function (session, data, opt) {
  var self = this;
  var notUseFilterData = (opt)
    ? opt.notUseFilterData
    : null;
  if (this.filterData && !notUseFilterData) this.filterData(session, data);
  var name = self._name;
  var rest = self._rest;
  var selector = !!data.selector
    ? data.selector
    : {};
  var opts = !!data.opts
    ? data.opts
    : {};
  var isMore = data.isMore;
  var isRemove = data.isRemove;
  var isReset = data.isReset;
  var notQuery = data.notQuery;
  var pageShow = data.page;
  var notNoticeChanged = data.notNoticeChanged;
  var limit = 10;
  if (isRemove || isReset) {
    FETCHDATA.pageFetch[session] = 0;
    FETCHDATA.isGotData[session] = false;
    data.isReset = false;
    data.isRemove = false;
  }
  if (FETCHDATA.indexId[name][session] && !isMore && !isReset) {
    Session.setDefault(session, true);
    return;
  }
  if (notQuery) {
    if (!FETCHDATA.indexId[name][session])
      FETCHDATA.indexId[name][session] = data;
    if (!this.dep)
      this.dep = new Tracker.Dependency;
    if (!notNoticeChanged)
      this.dep.changed();
    Session.setDefault(session, true);
    return;
  }
  if (isMore && typeof FETCHDATA.pageFetch[session] == 'number') {
    FETCHDATA.pageFetch[session]++;
    data.isMore = false;
  }
  if (!FETCHDATA.pageFetch[session])
    FETCHDATA.pageFetch[session] = 0;
  var pageFetch = FETCHDATA.pageFetch[session];
  if (typeof pageShow == 'number') {
    if (!FETCHDATA.indexPage[name]) {
      FETCHDATA.indexPage[name] = {};
    }
    FETCHDATA.indexPage[name][pageShow] = FETCHDATA.pageFetch[session];
    pageFetch = pageShow;
    FETCHDATA.pageFetch[session]++;
  }
  Session.setDefault(session, false);
  Meteor.autorun(function () {
    var token = Session.get('loginToken');
    var user = Meteor.user();
    if (token && user) {
      Meteor.call(rest, selector, opts, pageFetch, limit, function (err, res) {
        if (res && res.status == "success") {
          FETCHDATA.isGotData[session] = true;
          if (!FETCHDATA.indexId[name][session])
            FETCHDATA.indexId[name][session] = data;
          self.refetch(res.data, notNoticeChanged);
          Session.set(session, true);
        }
      })
    }
  });
};
Mongo.Collection.prototype.refetch = function (infos, notNoticeChanged) {
  if (!this.dep)
    this.dep = new Tracker.Dependency;
  var data = {};
  if (Array.isArray(infos)) {
    infos.forEach(function (info) {
      data[info._id] = info;
    });
  } else if (infos) {
    data[infos._id] = infos;
  }
  this._collection._docs._map = _.extend(this._collection._docs._map, data);
  if (!notNoticeChanged)
    this.dep.changed();
};
Mongo.Collection.prototype.oldFind = Mongo.Collection.prototype.find;
Mongo.Collection.prototype.oldFindOne = Mongo.Collection.prototype.findOne;
Mongo.Collection.prototype.find = function (selector) {
  if (!this.dep)
    this.dep = new Tracker.Dependency;
  this.dep.depend();
  return this.oldFind.apply(this, arguments);
};
Mongo.Collection.prototype.findOne = function (selector) {
  return this.oldFindOne.apply(this, arguments);
};

var connectionCount = 0;
Meteor.startup(function(){
  Tracker.autorun(function() {
    var status = Meteor.status().status;
    if (status == 'offline') {
      connectionCount = -1;
    }
    ;
    if (status == 'connected') {
      connectionCount = 1;
    }
    if (connectionCount === 1) {
      for (var name in  FETCHDATA.collection){
        var self = FETCHDATA.collection[name];
        self._collection._docs._map = {};
        for (var key in FETCHDATA.indexId[name]) {
          self.fetchData(key, _.extend(FETCHDATA.indexId[name][key], {isReset: true}));
        }
        if (self.dep)
          self.dep.changed();
      }

    }
  });
})