Crafty.scene('Game', function() {

  this.occupied = new Array(Game.map_grid.width);
  for (var i = 0; i < Game.map_grid.width; i++) {
    this.occupied[i] = new Array(Game.map_grid.height);
    for (var y = 0; y < Game.map_grid.height; y++) {
      this.occupied[i][y] = false;
    }
  }

  Crafty.e('Player').at(14, 17);
  this.occupied[1][1] = true;

  for (var x = 0; x < Game.map_grid.width; x++) {
    for (var y = 0; y < Game.map_grid.height; y++) {
      var at_edge = x == 0 ||
                    x == Game.map_grid.width - 1;
      var at_bottom = y == 1 && x != 12 && x != 13 && x != 14 && x != 15 && x != 16 ||
                      y == Game.map_grid.height - 1;
 
      if (at_edge) {
        // Place a platform entity at the current tile
        Crafty.e('Wall').at(x, y);
        this.occupied[x][y] = true;
      }

      else if (at_bottom ||
               x > 4 && x < 25 && y == Game.map_grid.height - 6) {
        Crafty.e('Ground').at(x, y);
        this.occupied[x][y] = true;
      }
      else if (x == 5 && y == 0) {
        var enemy = Crafty.e('Enemy').at(x, y);
        enemy.startMovingInDirection('right');
      }
    }
  }

  this.show_game_over = this.bind('PlayerKilled', function() {
    Crafty.e('2D, DOM, Text')
      .text('Game Over')
      .textColor('#FFFFFF', 1)
      .attr({
        x: 0,
        y: Game.height() / 2,
        w: Game.width()
      });
  });
}, function() {
  this.unbind('PlayerKilled', this.show_game_over);
});