import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import request from 'request';
import fs from 'fs';
export const Emoticons = new Mongo.Collection('emoticons');
if (Meteor.isServer) {
//    var emoticons = JSON.parse(Assets.getText("emoticons.json"));
    Meteor.publish('emoticons', function emoticonsPublication() {
      return Emoticons.find({});
    });

  //  Emoticons.remove({});
//    for (var i = 0; i < emoticons.emoticons.length; i++) {
  //    Emoticons.insert({"name": emoticons.emoticons[i].regex, "url": emoticons.emoticons[i].images[0].url,});
  //  }

  //  Emoticons.insert({"name": "OSfrog", "url": "https://static-cdn.jtvnw.net/emoticons/v1/81248/1.0",});
    Meteor.startup(function () {
      Emoticons._ensureIndex({"name": "text"});
    });
  }
