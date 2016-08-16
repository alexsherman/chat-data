import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { Emoticons } from '../api/emoticons.js';
import irc from 'irc';
import request from 'request';
import fs from 'fs';

export const Chats = new Mongo.Collection('chats');
export const Memes = new Mongo.Collection('memes');
export const OldMemes = new Mongo.Collection('oldmemes');

/*
to do:

get full json of twitch memes, put urls into emoticons database
make images next to circles be the appropriate memes

think of way to fix ordering so that memes don't get shifted but new ones simply fill in - make x shift based on d or i

create single meme popularity graph

*/

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('chats', function chatsPublication() {
    return Chats.find();
  });

  Meteor.publish('memes', function memesPublication() {
    return Memes.find({}, {sort: {number: -1}, limit: 7});
  });
    Memes.remove({});
    OldMemes.remove({});
    Chats.remove({});


    Meteor.startup(function () {
      Memes._ensureIndex({text: "text"});
      OldMemes._ensureIndex({index: 1});
      Chats._ensureIndex({createdAt:1});
    });
  //clear Chats
  var channel = "#dota2ti";
  //connect to twitch irc channel
  var client = new irc.Client('irc.chat.twitch.tv', 'justinfan29848346', {
      channels: ["#dota2ti"],
  });

  client.join("#dota2ti");
  var index = 0;
  let removeIndex = -300;

  client.addListener('message#dota2ti', Meteor.bindEnvironment(function (newuser, newtext, message) {
      index += 1;
      removeIndex += 1;
      var newTextArray = newtext.split(" ");
      Chats.insert({
        text: newTextArray,
        createdAt: new Date(),
      });

      for (var i = 0; i < newTextArray.length; i++) {
        let text = newTextArray[i];
        if (Memes.find({text: text}).count() == 0) {
          if (Emoticons.find({name: text}).count() > 0) {
            let url = Emoticons.findOne({name: text}).url;
            Memes.insert({
              text: text,
              number: 1,
              url: url,
              createdAt: new Date(),
            });
            Emoticons.update({name: text}, {$inc: {popularity: 1}},)
            OldMemes.insert({meme: text, index: index})
          }
        } else {
          Memes.update({text: text}, {$inc: {number: 1}},);
          Emoticons.update({name: text}, {$inc: {popularity: 1}},)
          OldMemes.insert({meme: text, index: index})
        }
      }

        OldMemes.find({index: removeIndex}).forEach(function(doc) {
          Memes.update({text: doc.meme}, {$inc: {number: -1}});
        });


    }))
}
