Crafty.scene('Level1', function() {

  this.occupied = new Array(Game.map_grid.width);
  for (var i = 0; i < Game.map_grid.width; i++) {
    this.occupied[i] = new Array(Game.map_grid.height);
    for (var y = 0; y < Game.map_grid.height; y++) {
      this.occupied[i][y] = false;
    }
  }

  Crafty.e('Player').at(1, 1);
  this.occupied[1][1] = true;

  for (var x = 0; x < Game.map_grid.width; x++) {
    for (var y = 0; y < Game.map_grid.height; y++) {
      var at_edge = x == 0 ||
                    x == Game.map_grid.width - 1;
      var at_bottom = y == Game.map_grid.height - 1;
 
      if (at_edge) {
        // Place a platform entity at the current tile
        Crafty.e('Wall').at(x, y);
        this.occupied[x][y] = true;
      }

      else if (at_bottom ||
               x > 4 && x < 25 && y == 20) {
        Crafty.e('Ground').at(x, y);
        this.occupied[x][y] = true;
      }
    }
  }
});