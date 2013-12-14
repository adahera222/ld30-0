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
    this.requires('2D, Canvas, Grid, Gravity, Collision, Color')
      .gravity('Ground')
      .attr({w: Game.map_grid.tile.width * 2, h: Game.map_grid.tile.height / 8});;
    this.color('YELLOW');
    
  }
})

Crafty.c('Player', {
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
    javelin.antigravity();
  },
});