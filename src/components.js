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
  },
});

Crafty.c('Bow', {

  init: function() {

    var player = Crafty('Player');

    this.requires('2D, Canvas, MouseFace, spr_bow')
      .origin(8 ,12);
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
    this.bind('MouseDown', function() {
      this.removeComponent('spr_bow');
      this.addComponent('spr_bow_pulled');
    });
    this.bind('MouseUp', function() {
      this.removeComponent('spr_bow_pulled');
      this.addComponent('spr_bow');
    });
  },

  stopTrackingMouse: function() {
    this.moving = false;
    this.unbind('MouseMoved');
  },
});

var ARROW_WIDTH = Game.map_grid.tile.width;
var ARROW_HEIGHT = 3;
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
      w: ARROW_WIDTH,
      h: ARROW_HEIGHT,
      speed: ARROW_SPEED,
      angle: bow.getAngle(),
      rotation: bow.getAngle() * 180 / Math.PI,
      shot: false,
    })
    .color('PINK')
    .bind('EnterFrame', function(frame) {

      if (this.shot && this._gy == 0) {
        this.stopArrow();
        return;
      }

      this.shot = true;

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
    .onHit('Wall', this.stopArrow)
    .onHit('Ground', this.stopArrow)
    .gravity('Ground');
  },

  stopArrow: function() {
    this.antigravity();
    this.unbind('EnterFrame');
    Crafty.audio.play('arrow_hit_wall');
  },
});

var PLAYER_SPEED = 5;
var PLAYER_JUMP = 6;

Crafty.c('Player', {
  init: function() {
    this.requires('2D, Canvas, Grid, Gravity, Collision, Twoway, MouseFace, SpriteAnimation, spr_player')
      .twoway(PLAYER_SPEED, PLAYER_JUMP)
      .gravity('Ground')
      .bind('EnterFrame', this.updateBowPosition)
      .onHit('Wall', this.stopMovement)
      .onHit('Ground', this.toggleJump)
      .onHit('Enemy', this.die)
      .bind('MouseUp', this.shootBow)
      .bind('MouseMoved', this.faceMouse)
      .reel('PlayerMoving', 400, 0, 0, 5)
      .bind("KeyDown", function (e) {
        if (e.key === Crafty.keys.LEFT_ARROW ||
            e.key === Crafty.keys.A ||
            e.key === Crafty.keys.RIGHT_ARROW ||
            e.key === Crafty.keys.D)
          this.animate('PlayerMoving', -1);
      })
      .bind('KeyUp', function(e) {
        this.pauseAnimation();
      });


    this._bow = Crafty.e('Bow');
    this._bowXOffset = this.w / 4;
    this._bowYOffset = -4;
  },

  updateBowPosition: function() {
    // Update the bow track with the player
    this._bow.attr({
      x: this.x + this._bowXOffset,
      y: this.y + this._bowYOffset
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

  faceMouse: function() {
    // Flip the user to face the mouse pointer
    switch (this.getDirection()) {
      case this._directions.left:
        this.flip();
        this._bowXOffset = -this.w / 4;
        this._bowYOffset = -2;
        break;
      case this._directions.right:
        this.unflip();
        this._bowXOffset = this.w / 4;
        this._bowYOffset = -4;
        break;
    }
  },

  die: function() {
    this.destroy();
    this._bow.stopTrackingMouse();
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