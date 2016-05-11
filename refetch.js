Mongo.Collection.prototype.refetch = function (infos, clearOldData) {
  if (clearOldData) {
    this.remove();
  }
  var name = this._name;
  if (!FCM[name]) {
    FCM[name] = new fakeCollection(name)
  }
  this.oldFind({}).observe({
    added: function (data) {
      FCM[name].upsert({_id: data._id}, data);
    },
    changed: function (data) {
      FCM[name].upsert({_id: data._id}, data);
    },
    removed: function (data) {
      FCM[name].fakeRemove({_id: data._id});
    }
  });
  if (Array.isArray(infos)) {
    infos.forEach(function(data) {
      FCM[name].upsert({_id: data._id}, data);
    });
    FCM[name].dep.changed();
    return;
  }
  FCM[name].upsert({_id: infos._id}, infos);
  FCM[name].dep.changed();
};

Mongo.Collection.prototype.oldFind = Mongo.Collection.prototype.find;
Mongo.Collection.prototype.oldFindOne = Mongo.Collection.prototype.findOne;
Mongo.Collection.prototype.find = function (selector) {
  var name = this._name;
  if (FCM[name])
    return FCM[name].find(selector);
  return this.oldFind.apply(this,arguments);
};
Mongo.Collection.prototype.findOne = function (selector) {
  var name = this._name;
  if (FCM[name])
    return FCM[name].findOne(selector);
  return this.oldFindOne.apply(this,arguments);
};