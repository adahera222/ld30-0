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

Crafty.c('Javelin', {

  init: function() {
    this.requires('2D, Canvas, Grid, Gravity, Collision, Color, MouseFace')
      .attr({w: Game.map_grid.tile.width * 2, h: Game.map_grid.tile.height / 8})
      .gravity('Ground')
      .origin(this.w / 2, this.h / 2);
    this.color('YELLOW');
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
})

Crafty.c('Player', {
  _hasJavelin: false,

  init: function() {
    this.requires('2D, Canvas, Grid, Color, Gravity, Collision, Twoway, Solid')
      .twoway(5, 5)
      .gravity('Ground')
      .onHit('Wall', this.stopMovement)
      .onHit('Javelin', this.pickUpJavelin);
    this.color('GREEN');
  },

  stopMovement: function() {
    this._speed = 0;
    if (this._movement) {
      this.x -= this._movement.x;
      this.y -= this._movement.y;
    }
  },

  pickUpJavelin: function(javelins) {
    javelin = javelins[0].obj;
    javelin.attr({x: this.x - this.w / 2, y: this.y + this.h / 4});

    if (this._hasJavelin == false) {
      javelin.antigravity();
      javelin.startTrackingMouse();
      
      this._hasJavelin = true;
    }
  },
});