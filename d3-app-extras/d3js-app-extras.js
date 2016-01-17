(function (tlfns) {
  var gutter = 10;
  var padding = 10;
  var viewPortHeight = 360;
  var data;

  var draw = function () {
    if(!data) return;
    d3.select('#main-group').remove();
    var dlen = data.schedules.length;
    var lineheight = (viewPortHeight - (padding * dlen)) / dlen;
    var color = d3.scale.category20();
    d3.select('#timeline')
    .style({'width': '100%', 'height': viewPortHeight + padding })
    .append('g')
    .attr({'id': 'main-group', transform: 'translate(0, 30)' })
    .append('rect').style({'fill': '#ECECEC', 'width': '100%', 'height': viewPortHeight});

    d3.map(data.schedules).forEach(function (i, userSchdules) {
      var userColor = color(i);
      var mainGroup = d3.select('#main-group').selectAll('.event-daltas' + i)
      .data(userSchdules.schedule)
      .enter();

      mainGroup.append('rect')
      .style({'fill': function () {
        //  return userSchdules.color;
        return '#94BF21';
      }, 'height': lineheight})
      .attr({'width': function (eventd) {
        return timelineFns.generateEventStyle(eventd).width;
      }, 'x': function (eventd) {
        return timelineFns.generateEventStyle(eventd).left;
      }, 'y': function () {
        return (lineheight + padding) * Number(i);
      }, 'class': 'event-daltas' + i}).forEach(function (v) {
        mainGroup.append('text')
        .text(function (eventd, idx) {
          if (idx > 0) return;
          return userSchdules.user;
        })
        .attr({
          'x': function (eventd) {
            return gutter;
          },
          'y': function () {
            return (lineheight + padding) * Number(i) + (padding * 2);
          }, 'class': 'userlabel' + i});
      });
    });
    var timeline = d3.select('#main-group').selectAll('.ticks').data(data.ticks).enter();
    var now = new Date();

    timeline.append('rect')
    .attr({'class': 'ticks', 'x': function (tickValue) {
      return timelineFns.generateTickStyle(tickValue).left;
    }})
    .style({'fill': 'black', 'height': viewPortHeight,
           'width': function (tickValue) {
             return timelineFns.generateTickStyle(tickValue, 1.5).width;
           }});

           timeline.append('text').text(function (tickValue) {
             return timelineFns.labelFormat(tickValue);
           }).attr({'y': -gutter, 'class': 'label', 'x': function (tickValue) {
             return timelineFns.generateTickStyle(tickValue).left;
           }});
           timeline.append('rect')
           .attr({'class': 'now', 'x': function () {
                         var zerohours = (now.getHours() * 100) + now.getMinutes();
             return timelineFns.generateTickStyle((now.getHours() * 100) + now.getMinutes()).left;
           }})
           .style({'fill': 'red', 'height': viewPortHeight, 'width': 5});
                  timeline.append('text').text(function (tickValue) {
                    return timelineFns.labelFormat((now.getHours() * 100) + now.getMinutes());
                  }).attr({'y': -gutter, 'class': 'label', 'x': function (tickValue) {
                    return timelineFns.generateTickStyle((now.getHours() * 100) + now.getMinutes()).left;
                  }});
  };

  window.addEventListener('load', function () {
    d3.json('/multi-schedules.json', function (erro, responseData) {
      data = responseData;
      draw();
    });
  });

  window.addEventListener('resize', function () {
    draw();
  });

}(timelineFns));