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
    this.requires('2D, Canvas, Collision, Grid, spr_wall')
      .crop(1, 1, 16, 16);
  },
});

Crafty.c('Ground', {
  init: function() {
    this.requires('2D, Canvas, Collision, Grid, spr_platform')
      .collision([0, 0],[this.w, 0],[this.w, this.h], [0, this.h]);
    console.log('w: ' + this.w + ' h: ' + this.h);
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

var ARROW_SPEED = 20;

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
    Crafty.audio.play('arrow_hit_wall');
  },
});

var PLAYER_SPEED = 5;
var PLAYER_JUMP = 6;

Crafty.c('Player', {

  init: function() {
    this.requires('2D, Canvas, Grid, Color, Gravity, Collision, Twoway, MouseFace')
      .twoway(PLAYER_SPEED, PLAYER_JUMP)
      .gravity('Ground')
      .bind('EnterFrame', this.updateBowPosition)
      .bind('Moved', function(from) {
        var hit = !!this.hit('Ground');
        if (hit) {
          this.y = from.y;
        }
      })
      .onHit('Wall', this.stopMovement)
      .onHit('Ground', this.toggleJump)
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

  toggleJump: function() {
    this._up = false;
  },

  shootBow: function(data) {
    if (data.mouseButton == Crafty.mouseButtons.LEFT) {
      var arrow = Crafty.e('Arrow');
      arrow.shootFromBow(this._bow);
      Crafty.audio.play('arrow_shot');
    }
  },

  die: function() {
    this.destroy();
    Crafty.trigger('PlayerKilled', this);
    Crafty.audio.play('death');
  },
});

var ENEMY_SPEED = 2;

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
    this.destroy();
    Crafty.audio.play('arrow_hit_enemy');
  },
});