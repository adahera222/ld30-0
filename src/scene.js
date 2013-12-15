Crafty.scene('Loading', function() {
  Crafty.e('2D, DOM, Text')
    .text('Loading...')
    .textColor('#FFFFFF')
    .attr({
      x: 0,
      y: Game.height() / 2,
      w: Game.width()
    });

  Crafty.load(['assets/platform.png',
               'assets/wall.png',
               'assets/player.png',
               'assets/bow.png',
               'assets/arrow.png',
               'assets/arrow_hit_enemy.wav',
               'assets/arrow_hit_wall.wav',
               'assets/arrow_shot.wav',
               'assets/death.wav'], function() {
    Crafty.sprite(16, 'assets/platform.png', {
      spr_platform: [0, 0]
    });

    Crafty.sprite(16, 24, 'assets/player.png', {
      spr_player: [0, 0]
    });

    Crafty.sprite(24, 24, 'assets/bow.png', {
      spr_bow_no_arrow:          [1, 0],
      spr_bow_no_arrow_pulled:   [1, 0],
      spr_bow_arrow:             [2, 0],
      spr_bow_arrow_pulled:   [3, 0]
    });

    Crafty.sprite(18, 'assets/wall.png', {
      spr_wall: [0, 0]
    });

    Crafty.sprite(18, 7, 'assets/arrow.png', {
      spr_arrow: [0, 0]
    });

    Crafty.audio.add({
      arrow_hit_enemy:  ['assets/arrow_hit_enemy.wav'],
      arrow_hit_wall:   ['assets/arrow_hit_wall.wav'],
      arrow_shot:       ['assets/arrow_shot.wav'],
      death:            ['assets/death.wav']
    });

    Crafty.scene('Game'); 
  });
});


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