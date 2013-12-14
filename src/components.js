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
      xInitial: bow.arrowOriginX(),
      yInitial: bow.arrowOriginY(),
      x: bow.arrowOriginX(),
      y: bow.arrowOriginY(),
      w: 10,
      h: 3,
      speed: ARROW_SPEED,
      angle: bow.getAngle(),
      rotation: bow.getAngle() * 180 / Math.PI
    })
    .color('PINK')
    .bind('EnterFrame', function(frame) {
      var dX = Math.cos(this.angle) * this.speed;
      var dY = Math.sin(this.angle) * this.speed;

      this.x += dX;
      this.y += dY;

      var sumY = dY + this._gy;

      // If I have time, refactor this arrow rotation code
      if (sumY < 0) {
        // Going upwards
        // Level off from the current angle
        if (this.rotation < 270) {
          // Going upwards to the left
          var remainingAngleToLevel = this.rotation - 180;
          var dRotation = remainingAngleToLevel / 50;
          this.rotation -= dRotation;
        }
        else {
          // Going upwards to the right
          var remainingAngleToLevel = 360 - this.rotation;
          var dRotation = remainingAngleToLevel / 50;
          this.rotation += dRotation;
        }
      }
      else {
        // Going downwards
        if (this.rotation < 270 && this.rotation > 90) {
          // Going downwards to the left
          var remainingAngleToVertical = this.rotation - 90;
          var dRotation = remainingAngleToVertical / 50;
          this.rotation -= dRotation;
        }
        else {
          // Going downwards to the right
          var remainingAngleToVertical = 90 - this.rotation;
          var dRotation = remainingAngleToVertical / 200;
          this.rotation -= dRotation;
        }
      }
      
    })
    .onHit('Wall', this.removeArrow)
    .bind('hit', this.removeArrow)
    .gravity('Ground');
  },

  removeArrow: function() {
    this.destroy();
  },
});

var PLAYER_SPEED = 5;
var PLAYER_JUMP = 5;

Crafty.c('Player', {

  init: function() {
    this.requires('2D, Canvas, Grid, Color, Gravity, Collision, Twoway, MouseFace')
      .twoway(PLAYER_SPEED, PLAYER_JUMP)
      .gravity('Ground')
      .bind('EnterFrame', this.updateBowPosition)
      .onHit('Wall', this.stopMovement)
      .onHit('Ground', this.stopJump)
      .onHit('Enemy', this.die)
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
      var arrow = Crafty.e('Arrow');
      arrow.shootFromBow(this._bow);
    }
  },

  die: function() {
    this.destroy();
    Crafty.trigger('PlayerKilled', this);
  },
});

var ENEMY_SPEED = 3;

/**
  When you spawn an enemy, it must be given a -startMovingInDirection
  call before it begins moving
*/
Crafty.c('Enemy', {
  init: function() {
    this.requires('2D, Canvas, Grid, Color, Gravity, Collision')
      .attr({
        speed: ENEMY_SPEED,
        moving: false
      })
      .onHit('Wall', this.reverseDirection)
      .onHit('Arrow', this.die)
      .bind('EnterFrame', this.updatePosition)
      .gravity('Ground');
  },

  updatePosition: function() {
    if (this.moving) {
      this.x += this.speed;
    }
  },

  reverseDirection: function() {
    this.speed *= -1;
  },

  startMovingInDirection: function(direction) {
    if (direction == 'left') {
      this.reverseDirection();
    }
    this.moving = true;
  },

  die: function(entities) {
    // TODO death animation
    // TODO death sound
    this.destroy();
  },
});