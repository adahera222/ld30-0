Game = {

  map_grid : { 
    width: 30,
    height: 20,
    tile : {
      width : 32,
      height: 32
    }
  },

  width: function() {
    return this.map_grid.width * this.map_grid.tile.width;
  },

  height: function() {
    return this.map_grid.height * this.map_grid.tile.height;
  },

  start: function() {
    Crafty.init(Game.width(), Game.height());
    Crafty.background('black');
    Crafty.scene('Game');
  },
}