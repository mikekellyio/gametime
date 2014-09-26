// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Players = new Mongo.Collection("players");

if (Meteor.isClient) {
  Template.leaderboard.players = function () {
    return Players.find({}, {sort: {score: -1, name: 1}});
  };
  
  Template.players.players = function () {
    return Players.find({}, {sort: {name: 1}});
  };

  Template.player.class_name = function() {
    return this.name.toLowerCase();
  }
  
  Template.player.events({
    'click': function () {
      Session.set("selected_player", this._id);
    },
    'click span.inc': function () {
      Players.update(this._id, {$inc: {score: 1}});
    },
    'click span.dec': function () {
      if(this.score > 0){
        Players.update(this._id, {$inc: {score: -1}}); 
      }
    }
  });
}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Players.find().count() === 0) {
      var names = ["Red",
                   "Green",
                   "Blue",
                   "Yellow"];
      for (var i = 0; i < names.length; i++)
        Players.insert({name: names[i], score: 0});
    }
  });
}
