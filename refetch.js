Mongo.Collection.prototype.refetch = function (infos, clearOldData) {
    if (clearOldData) {
        this.remove();
    }
    var name = this._name;
    if (!FCM[name]) {
        FCM[name] = new fakeCollection(name)
    }
    if (Array.isArray(infos)) {
        for (var data of infos) {
            FCM[name].upsert({_id: data._id}, data);
        }
        FCM[name].dep.changed();
        return;
    }
    FCM[name].upsert({_id: infos._id}, infos);
    FCM[name].dep.changed();
};
Mongo.Collection.prototype.fakeFind = function (selector) {
    var name = this._name;
    if (!FCM[name])
        FCM[name] = new fakeCollection(name);
    return FCM[name].find(selector);
};
Mongo.Collection.prototype.fakeFindOne = function (selector) {
    var name = this._name;
    if (!FCM[name])
        FCM[name] = new fakeCollection(name)
    return FCM[name].findOne(selector);
};