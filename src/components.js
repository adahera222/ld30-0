Crafty.c('Grid', {
  init: function() {
    this.attr({
      w: Game.map_grid.tile.width,
      h: Game.map_grid.tile.height
    })
  },

  at: function(x, y) {
    if (x === undefined && y === undefined) {
      return { x: this.x / Game.map_grid.tile.width,
               y: this.y / Game.map_grid.tile.height }
    }
    else {
      this.attr({ x: x * Game.map_grid.tile.width,
                  y: y * Game.map_grid.tile.height });
      return this;
    }
  },
});

Crafty.c('Wall', {
  init: function() {
    this.requires('2D, Canvas, Grid, Color');
    this.color('BROWN');
  },
});

Crafty.c('Ground', {
  init: function() {
    this.requires('2D, Canvas, Grid, Color');
    this.color('RED');
  },
});

Crafty.c('Bow', {

  init: function() {
    this.requires('2D, Canvas, Color, MouseFace')
      .attr({
        w: Game.map_grid.tile.width * 2,
        h: Game.map_grid.tile.height / 8
      })
      .origin(this.w / 2, this.h / 2);
    this.color('YELLOW');
    this.startTrackingMouse();
  },

  arrowOriginX: function() {
    return this._x + this._w / 2;
  },

  arrowOriginY: function() {
    return this._y + this.h / 2;
  },

  startTrackingMouse: function() {
    this.moving = true;
    this.bind('MouseMoved', function(entity) {
      this.rotation = this.getAngle() * (180 / Math.PI);
    });
  },

  stopTrackingMouse: function() {
    this.moving = false;
    this.unbind('MouseMoved');
  },
});

var ARROW_SPEED = 10;

Crafty.c('Arrow', {
  init: function(bow) {
    this.requires('2D, Canvas, Color, Gravity, Gravity, Collision');
  },

  shootFromBow: function(bow) {
    this.attr({
      x: bow.arrowOriginX(),
      y: bow.arrowOriginY(),
      w: 3,
      h: 3,
      speed: ARROW_SPEED,
      angle: bow.getAngle()
    })
    .color('PINK')
    .bind('EnterFrame', function(frame) {
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
    })
    .onHit('Ground', this.removeArrow)
    .onHit('Wall', this.removeArrow)
    .gravity('Ground');
  },

  removeArrow: function() {
    this.destroy();
  },
});

Crafty.c('Player', {

  init: function() {
    this.requires('2D, Canvas, Grid, Color, Gravity, Collision, Twoway, Solid, MouseFace')
      .twoway(5, 5)
      .gravity('Ground')
      .bind('EnterFrame', this.updateBowPosition)
      .onHit('Wall', this.stopMovement)
      .onHit('Ground', this.stopJump)
      .bind('MouseUp', this.shootBow);
    this.color('GREEN');

    this._bow = Crafty.e('Bow');
  },

  updateBowPosition: function() {
    // Update the bow track with the player
    this._bow.attr({
      x: this.x - this.w / 2,
      y: this.y + this.h / 4
    });
  },

  stopMovement: function() {
    this._speed = 0;
    if (this._movement) {
      this.x -= this._movement.x;
      this.y -= this._movement.y;
    }
  },

  stopJump: function() {
    this._up = false;
    this._falling = true;
  },

  shootBow: function(data) {
    if (data.mouseButton == Crafty.mouseButtons.LEFT) {
      console.log('shoot');
      var arrow = Crafty.e('Arrow');
      arrow.shootFromBow(this._bow);
    }
  },
});