import { Template } from 'meteor/templating';
import { Memes } from '../api/chats.js';
import { Chats } from '../api/chats.js';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import './body.html';


Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveVar();
  Meteor.subscribe('memes');
  Meteor.subscribe('chats');
});

Template.hotlog.helpers({
  hot() {
    return Memes.find({number: {$gt: 2}}, {sort: {number:-1}});
  },
});

Template.vis.rendered = function () {
    var svg,
      width = 300,
      height = 1000;

    var renderNumber = 2;

    svg = d3.select('#circles').append('svg')
      .attr("id", "circle-svg")
      .attr('width', width)
      .attr('height', height);

    var update = function (update) {
      var data = Memes.find({number: {$gt: renderNumber}}, {sort: {number:-1}});
      dataArray = [];
      var highest = 25;
      data.forEach(function(doc) {
        var dataitem = {"id": doc._id, "number": doc.number, "text": doc.text, "url": doc.url};
        if (doc.number > highest) highest = doc.number;
        dataArray.push(dataitem);
      });

      //add circle exit
      var circles = svg.selectAll('circle').data(dataArray);
      var images = svg.selectAll('image').data(dataArray);
      images.exit().remove();
      circles.exit().remove();
      if (!update) {
        circles = circles.enter().append('circle')
        .attr("id", function(d, i) {return "circle-" + i})
        .attr('cx', function (d, i) { return i * 90 + 40; })
        .attr('cy', height / 2)
        .attr("stroke", "2px")
        .attr("fill", "white")
        .on("mouseover", function(d) {
          d3.select("#labels").html(d.text);
          d3.select(this).attr("fill", "green");
        })
        .on("mouseout", function(d) {
          d3.select(this).attr("fill", "white");
        })

        images = images.enter().append('image')
          .attr("x", function (d, i) { return i * 90 + 10; })
          .attr("y", height / 2 - 30)
          .attr("width", function(d) {
              return 50;
          })
          .attr("height", function(d) {
              return 50;
          })
      } else {
        circles = circles.transition().duration(1000);
      }
      circles.attr('r', function (d) {
          return d.number / highest * 39;
        });

      images.attr("xlink:href", function(d) {
          return d.url;
        });
    };

    Tracker.autorun(function(){
      Memes.find().observeChanges({
        added: function() {
          barChart(true);
        },
        removed: function() {
          barChart(true);
        },
        changed: function() {
          barChart(false);
        }
        });
      })

      function barChart(update) {
      var data = Memes.find({number: {$gt: renderNumber}}, {sort: {number:-1}});
      let dataArray = [];
      data.forEach(function(doc) {
        var dataitem = {"id": doc._id, "number": doc.number, "text": doc.text, "url": doc.url};
        dataArray.push(dataitem);
      });

      var bars = svg.selectAll('rect').data(dataArray);
      var images = svg.selectAll('image').data(dataArray);
      images.exit().remove();
      bars.exit().remove();
      if (!update) {
        bars = bars.enter().append('rect')
        .attr("id", function(d, i) {return "rect-" + d.text})
        .attr("class", "bar")
        .attr("fill", "green")
        .attr("x", 15)
        .attr('height', 30)
        .attr("y", function (d,i){return i * 55 + 40 + "px"});

        images = images.enter().append('image')
          .attr("y", function (d, i) { return i * 55 + 34; })
          .attr("x", 0)
          .attr("width", 40)
          .attr("height", 40);

      } else {
        bars = bars.transition().duration(3000);
      }
      bars.attr("width", function(d) {
        return d.number * 3 + "px";
      })
      .attr("fill", function(d) {
        if (d.number < 15) {
          return "lightblue";
        } else if (d.number < 50) {
          return "lightgreen";
        } else {
          return "red";
        }
      });

      images.attr("xlink:href", function(d) {
          return d.url;
        });
    }
}
