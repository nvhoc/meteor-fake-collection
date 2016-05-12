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
  }else{
    data[infos._id] = infos;
  }
  this._collection._docs._map = data;
  this.dep.changed();
};
Mongo.Collection.prototype.oldFind = Mongo.Collection.prototype.find;
Mongo.Collection.prototype.oldFindOne = Mongo.Collection.prototype.findOne;
Mongo.Collection.prototype.find = function (selector) {
  if (!this.dep)
    this.dep = new Tracker.Dependency;
  this.dep.depend();
  return this.oldFind.apply(this,arguments);
};
Mongo.Collection.prototype.findOne = function (selector) {
  return this.oldFindOne.apply(this,arguments);
};