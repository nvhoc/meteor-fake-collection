Package.describe({
  name: 'hocnv:meteor-fake-collection',
  summary: "wait a method that Meteor call in waitOn in IronController",
  version: "0.0.1"
});

Package.on_use(function (api) {
  api.use('mongo');
  api.add_files(['refetch.js'], 'client');
  api.add_files(['filter.js'], 'client');
  api.add_files(['filterServer.js'], 'server');
  api.export("FETCHDATA", 'client');
  api.export("filterType", 'client');
  api.export("filterFunc", 'server');
});
