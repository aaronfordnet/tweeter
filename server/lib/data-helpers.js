"use strict";

// Helper functions for saving and getting tweets from DB
module.exports = function makeDataHelpers(db) {
  return {

    // Save tweet to DB
    saveTweet: function(newTweet, callback) {
      db.collection("tweets").insertOne(newTweet, (err, r) => {
        if (err) {
          return callback(err);
        }
        callback(null, true);
      });
    },

    // Get all tweets from DB and sort by newest first
    getTweets: function(callback) {
      const sortNewestFirst = (a, b) => a.created_at - b.created_at ;
      db.collection("tweets").find().sort(sortNewestFirst).toArray((err, tweets) => {
        if (err) {
          return callback(err);
        }
        callback(null, tweets);
      });
    }
  };
}
