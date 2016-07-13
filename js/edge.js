const Util = require("./util");
const Constants = require('../constants');

const Edge = function(options) {
  this.vertex1 = options.vertex1;
  this.vertex2 = options.vertex2;
  // this.color = Constants.BLACK;
};

Edge.prototype.draw = function(ctx, edges) {
  // console.log("Edge.draw(ctx, edges)");
  // console.log(edges);
  // this.intersecting = false;
  // ctx.strokeStyle = Constants.BLACK;
  // ctx.beginPath();
  // ctx.moveTo(this.vertex1.x, this.vertex1.y);
  // ctx.lineTo(this.vertex2.x, this.vertex2.y);
  // ctx.stroke();
  //
  // edges.forEach( edge => {
  console.log(edges);
  // debugger;
    if (this.currentlyIntersecting(edges)) {
      console.log("Edge is currently intersecting");
      // this.intersecting = true;
      ctx.strokeStyle = Constants.LINE_INTERSECTING;
      // edge.intersecting = true;
      ctx.beginPath();
      ctx.moveTo(this.vertex1.x, this.vertex1.y);
      ctx.lineTo(this.vertex2.x, this.vertex2.y);
      ctx.stroke();
    } else {
      console.log("Edge is not currently intersecting");
      ctx.strokeStyle = Constants.BLACK;
      ctx.beginPath();
      ctx.moveTo(this.vertex1.x, this.vertex1.y);
      ctx.lineTo(this.vertex2.x, this.vertex2.y);
      ctx.stroke();
    }
  // });
};

  // });


  // let intersecting = this.currentlyIntersecting(edges);
  // if (this.intersecting) {
  //   ctx.strokeStyle = Constants.LINE_INTERSECTING;
  // } else {
  //   ctx.strokeStyle = Constants.BLACK;
  // }
  // ctx.beginPath();
  // ctx.moveTo(this.vertex1.x, this.vertex1.y);
  // ctx.lineTo(this.vertex2.x, this.vertex2.y);
  // ctx.stroke();
// };

Edge.prototype.slope = function() {
  return Util.slope(this.vertex1, this.vertex2);
};

Edge.prototype.xIntercept = function() {
  if (this.isVertical()) {
    return this.vertex1.x;
  } else {
    return Util.xIntercept(this.vertex1, this.slope());
  }
};

Edge.prototype.shareVertex = function(edge) {
  return (
    this.vertex1 === edge.vertex1
    || this.vertex1 === edge.vertex2
    || this.vertex2 === edge.vertex1
    || this.vertex2 === edge.vertex2
  );
};

Edge.prototype.isVertical = function() {
  return (Math.abs(this.vertex1.x - this.vertex2.x) < 1);
};

Edge.prototype.isHorizontal = function() {
  return (Math.abs(this.vertex1.y - this.vertex2.y) < 1);
};

Edge.prototype.intersectsAtX = function(edge) {
  // console.log("Edge.intersectsAtX(edge)");
  // console.log(edge);
  // debugger;
  return (edge.xIntercept() - this.xIntercept()) / (this.slope() - edge.slope());
};

Edge.prototype.intersectsWith = function(edge) {
  // console.log("Edge.intersectsWith(edge)");
  // console.log(edge);
  // If this edge is vertical, check whether its x is within the bounds for the other edge

  // CHECK IF ONE IS HORIZONTAL
  if (this.isHorizontal()) {
    let y = this.vertex1.y;
    let minY = Math.min(edge.vertex1.y, edge.vertex2.y) + 1;
    let maxY = Math.max(edge.vertex1.y, edge.vertex2.y) - 1;
    return (minY < y && y < maxY);

  } else if (edge.isHorizontal()) {
    let y = edge.vertex1.y;
    let minY = Math.min(this.vertex1.y, this.vertex2.y) + 1;
    let maxY = Math.max(this.vertex1.y, this.vertex2.y) - 1;
    return (minY < y && y < maxY);

  } else if (this.isVertical()) {
    let x = this.vertex1.x;
    const minX = Math.min(edge.vertex1.x, edge.vertex2.x) + 1;
    const maxX = Math.max(edge.vertex1.x, edge.vertex2.x) - 1;
    return (minX < x && x < maxX);

  } else if (edge.isVertical()){
    let x = edge.vertex1.x;
    const minX = Math.min(this.vertex1.x, this.vertex2.x) + 1;
    const maxX = Math.max(this.vertex1.x, this.vertex2.x) - 1;
    return (minX < x && x < maxX);

  } else {
    let x = this.intersectsAtX(edge);

    const firstMin = Math.min(this.vertex1.x, this.vertex2.x);
    const firstMax = Math.max(this.vertex1.x, this.vertex2.x);

    const secondMin = Math.min(edge.vertex1.x, edge.vertex2.x);
    const secondMax = Math.max(edge.vertex1.x, edge.vertex2.x);

    const onFirst = (firstMin < x && x < firstMax);
    const onSecond = (secondMin < x && x < secondMax);

    return (onFirst && onSecond && !this.shareVertex(edge));
  }
};

Edge.prototype.currentlyIntersecting = function(allEdges) {
  // console.log("Edge.currentlyIntersecting(allEdges)");
  // console.log(allEdges);
  let intersecting = false;
  allEdges.forEach( edge => {
    // debugger;
    if (this.intersectsWith(edge)) {
      intersecting = true;
      // edge.intersecting = true;
    }
  });
  return intersecting;
};

module.exports = Edge;
