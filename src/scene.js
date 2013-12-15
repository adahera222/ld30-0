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
               'assets/enemy.png',
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

    Crafty.sprite(18, 18, 'assets/enemy.png', {
      spr_enemy: [0, 0]
    });

    Crafty.sprite(24, 24, 'assets/bow.png', {
      spr_bow_no_arrow:          [0, 0],
      spr_bow_no_arrow_pulled:   [1, 0],
      spr_bow_arrow:             [2, 0],
      spr_bow_arrow_pulled:      [3, 0]
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

    Crafty.scene('Title'); 
  });
});

Crafty.scene('Title', function() {

  Crafty.e('2D, DOM, Text')
      .text('Press Spacebar to Start')
      .textColor('#FFFFFF', 1)
      .textFont({
        size: '18px',
      })
      .attr({
        x: 0,
        y: Game.height() / 2,
        w: Game.width(),
      });

  this.titleLevel = new Array(Game.map_grid.width);
  this.titleLevel[0] =   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
  this.titleLevel[1] =   [1, 0, 2, 2, 2, 2, 0, 2, 0, 0, 0, 0, 2, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1];
  this.titleLevel[2] =   [1, 0, 2, 0, 0, 2, 0, 2, 2, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1];
  this.titleLevel[3] =   [1, 0, 2, 0, 0, 2, 0, 2, 0, 2, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1];
  this.titleLevel[4] =   [1, 0, 2, 0, 0, 2, 0, 2, 0, 0, 2, 0, 2, 0, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1];
  this.titleLevel[5] =   [1, 0, 2, 0, 0, 2, 0, 2, 0, 0, 0, 2, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1];
  this.titleLevel[6] =   [1, 0, 2, 0, 0, 2, 0, 2, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1];
  this.titleLevel[7] =   [1, 0, 2, 2, 2, 2, 0, 2, 0, 0, 0, 0, 2, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1];
  this.titleLevel[8] =   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
  this.titleLevel[9] =   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
  this.titleLevel[10] =  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
  this.titleLevel[11] =  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
  this.titleLevel[12] =  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
  this.titleLevel[13] =  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
  this.titleLevel[14] =  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
  this.titleLevel[15] =  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
  this.titleLevel[16] =  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
  this.titleLevel[17] =  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
  this.titleLevel[18] =  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
  this.titleLevel[19] =  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2];


  for (var row = 0; row < Game.map_grid.height; row++) {
    for (var column = 0; column < Game.map_grid.width; column++) {
      var type = this.titleLevel[row][column];
      switch(type) {
        case 1:
          Crafty.e('Wall').at(column, row);
          break;
        case 2:
          Crafty.e('Ground').at(column, row);
          break;
        case 3:
          Crafty.e('Player').at(column, row);
          break;
      }

    }
  }

  this.bind("KeyDown", function (e) {
    if (e.key === Crafty.keys.SPACE)
      Crafty.scene('Game');
  });

});


Crafty.scene('Game', function() {

  Crafty.e('Score').at(0, 0);

  // 0 - Air
  // 1 - Wall
  // 2 - Ground
  // 3 - Player

  this.level = new Array(Game.map_grid.width);
  this.level[0] =   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
  this.level[1] =   [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
  this.level[2] =   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.level[3] =   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.level[4] =   [2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2];
  this.level[5] =   [1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1];
  this.level[6] =   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
  this.level[7] =   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
  this.level[8] =   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
  this.level[9] =   [1, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 1];
  this.level[10] =  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
  this.level[11] =  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
  this.level[12] =  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
  this.level[13] =  [1, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2, 1];
  this.level[14] =  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
  this.level[15] =  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
  this.level[16] =  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
  this.level[17] =  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1];
  this.level[18] =  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
  this.level[19] =  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];


  for (var row = 0; row < Game.map_grid.height; row++) {
    for (var column = 0; column < Game.map_grid.width; column++) {
      var type = this.level[row][column];
      switch(type) {
        case 1:
          Crafty.e('Wall').at(column, row);
          break;
        case 2:
          Crafty.e('Ground').at(column, row);
          break;
        case 3:
          Crafty.e('Player').at(column, row);
          break;
      }

    }
  }


  setInterval(function () {
    if (Crafty.isPaused()) {
      return;
    }
      
    // Four spawn positions
    // 1 - Top left
    // 2 - Top right
    // 3 - Side left
    // 4 - Side right
    var spawnPosition = Math.floor(Math.random() * (5 - 1) + 1);
    var x = 0;
    var y = 0;
    var direction = 'right';

    switch(spawnPosition) {
      case 1:
        x = 1;
        y = -1;
        break;
      case 2:
        x = 26  ;
        y = -1;
        direction = 'left';
        break;
      case 3:
        x = -1;
        y = 2;
        break;      
      case 4:
        x = 30;
        y = 2;
        direction = 'left'
        break;
    }

    Crafty.e('Enemy').at(x, y).startMovingInDirection(direction);
  }, 1000);

  // Add kill everything blocks at the bottom of the level
  var y = 25
  for (var x = -30; x < Game.map_grid.width + 30; x++) {
    Crafty.e('KillEverythingBlock').at(x, y);
  }

  this.show_game_over = this.bind('PlayerKilled', function() {
    Crafty.e('2D, DOM, Text')
      .textFont({
        size: '28px'
      })
      .text('Game Over')
      .textColor('#FFFFFF', 1)
      .attr({
        x: 0,
        y: Game.height() / 2 - (Game.map_grid.tile.height * 2),
        w: Game.width()
      });
    Crafty.e('2D, DOM, Text')
      .textFont({
        size: '14px'
      })
      .text('Press Space to Restart')
      .textColor('#FFFFFF', 1)
      .attr({
        x: 0,
        y: Game.height() / 2 + (Game.map_grid.tile.height * 1),
        w: Game.width()
      });
    Crafty.e('2D, DOM, Text')
      .text('Created by @adammika for Ludum Dare 28')
      .textColor('#FFFFFF', 1)
      .attr({
        x: 0,
        y: Game.height() - (Game.map_grid.tile.height * 1),
        w: Game.width()
      });

    // restart game on spacebar
    this.bind('KeyDown', function(e) {
      if (e.key === Crafty.keys.SPACE) {
        Crafty.scene('Game');
      }
    });

  });
}, function() {
  this.unbind('PlayerKilled', this.show_game_over);
});