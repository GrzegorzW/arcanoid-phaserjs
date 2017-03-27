var stageFirst = function (game) {
};

stageFirst.prototype = Object.create(stage.prototype);

stageFirst.prototype.create = function () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.checkCollision.down = false;

    this.s = this.game.add.tileSprite(0, 0, 800, 600, 'starfield');

    this.bricks = this.game.add.group();
    this.bricks.enableBody = true;
    this.bricks.physicsBodyType = Phaser.Physics.ARCADE;

    var brick;

    for (var y = 0; y < 1; y++) {
        for (var x = 0; x < 15; x++) {
            brick = this.bricks.create(120 + (x * 36), 100 + (y * 52), 'breakout', 'brick_' + (y + 1) + '_1.png');
            brick.body.bounce.set(1);
            brick.body.immovable = true;
        }
    }

    this.explosions = this.game.add.group();
    this.explosions.createMultiple(15, 'kaboom');
    this.explosions.forEach(this.setupExplosion, this);

    this.paddle = this.game.add.sprite(this.game.world.centerX, 500, 'breakout', 'paddle_big.png');
    this.paddle.anchor.setTo(0.5, 0.5);

    this.game.physics.enable(this.paddle, Phaser.Physics.ARCADE);

    this.paddle.body.collideWorldBounds = true;
    this.paddle.body.bounce.set(1);
    this.paddle.body.immovable = true;

    this.createBall();

    // this.ball = this.game.add.sprite(this.game.world.centerX, this.paddle.y - 16, 'breakout', 'ball_1.png');
    // this.ball.anchor.set(0.5);
    // this.ball.checkWorldBounds = true;
    //
    // this.game.physics.enable(this.ball, Phaser.Physics.ARCADE);
    //
    // this.ball.body.collideWorldBounds = true;
    // this.ball.body.bounce.set(1);
    //
    // this.ball.animations.add('spin', ['ball_1.png', 'ball_2.png', 'ball_3.png', 'ball_4.png', 'ball_5.png'], 50, true, false);
    //
    // this.ball.events.onOutOfBounds.add(this.ballLost, this);

    this.game.add.text(32, 520, 'level: ' + this.game.currentLevel, {
        font: "20px Arial",
        fill: "#ffffff",
        align: "left"
    });
    this.scoreText = this.game.add.text(32, 550, 'score: ' + this.game.score, {
        font: "20px Arial",
        fill: "#ffffff",
        align: "left"
    });
    this.livesText = this.game.add.text(680, 550, 'lives: ' + this.game.lives, {
        font: "20px Arial",
        fill: "#ffffff",
        align: "left"
    });
    this.introText = this.game.add.text(this.game.world.centerX, 400, '- click to start -', {
        font: "40px Arial",
        fill: "#ffffff",
        align: "center"
    });
    this.introText.anchor.setTo(0.5, 0.5);

    this.game.input.onDown.add(this.releaseBall, this);
};

stageFirst.prototype.update = function () {
    this.paddle.x = this.game.input.x;

    if (this.paddle.x < 24) {
        this.paddle.x = 24;
    } else if (this.paddle.x > this.game.width - 24) {
        this.paddle.x = this.game.width - 24;
    }

    if (this.ballOnPaddle) {
        this.ball.body.x = this.paddle.x;
    } else {
        this.game.physics.arcade.collide(this.ball, this.paddle, this.ballHitPaddle, null, this);
        this.game.physics.arcade.collide(this.ball, this.bricks, this.ballHitBrick, null, this);
    }
};
