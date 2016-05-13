FETCHDATA = {
  subFetch: {},
  pageFetch: {},
  indexId: {},
  requestAjax: function (opt, cb) {
    var query = {
      method: !!opt.method
        ? opt.method
        : "GET",
      url: ENUM_CLIENT.GET_API(opt.url),
      beforeSend: function (xhr) {
        xhr.setRequestHeader('X-Auth-Token', opt.token);
        xhr.setRequestHeader('X-User-Id', opt.userId);
      }
    };
    if (opt.method != "GET") {
      query.data = opt.data;
    }
    $.ajax(query)
      .done(function (msg) {
        cb(msg);
      });
  }
};
Mongo.Collection.prototype.setFetch = function (rest) {
  this._useFetch = true;
  if (!rest)
    this._rest = "fetch_" + this._name;
  else
    this._rest = rest;
}
Mongo.Collection.prototype.fetchData = function (session, data) {
  var self = this;
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
  var limit = 10;
  if (FETCHDATA.indexId[session] && !isMore) {
    Session.setDefault(session, true);
    return;
  }
  if (isMore && typeof FETCHDATA.pageFetch[name] == 'number')
    FETCHDATA.pageFetch[name]++;
  if (!FETCHDATA.pageFetch[name])
    FETCHDATA.pageFetch[name] = 0;
  Session.setDefault(session, false);
  Meteor.autorun(function () {
    var token = Session.get('loginToken');
    var user = Meteor.user();
    if (token && user) {
      Meteor.call('fetch_' + name, selector, opts, FETCHDATA.pageFetch[name], limit, function (err, res) {
        if (res.status == "success") {
          if (!FETCHDATA.indexId[session])
            FETCHDATA.indexId[session] = true;
          self.refetch(res.data, isRemove);
          Session.set(session, true);
        }
      })
    }
  });
}
Mongo.Collection.prototype.refetch = function (infos, clearOldData) {
  if (!this.dep)
    this.dep = new Tracker.Dependency;
  if (clearOldData) {
    this.remove();
  }
  var data = {};
  if (Array.isArray(infos)) {
    infos.forEach(function (info) {
      data[info._id] = info;
    });
  } else if (infos) {
    data[infos._id] = infos;
  }
  this._collection._docs._map = _.extend(this._collection._docs._map, data);
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