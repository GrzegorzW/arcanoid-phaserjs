var stageThird = function (game) {
};

stageThird.prototype = Object.create(stage.prototype);

stageThird.prototype.create = function () {
    this.preCreate();

    this.bricks = this.game.add.group();
    this.bricks.enableBody = true;
    this.bricks.physicsBodyType = Phaser.Physics.ARCADE;

    var brick;

    for (var y = 0; y < 4; y++) {
        for (var x = 0; x < 15; x++) {
            brick = this.bricks.create(120 + (x * 36), 100 + (y * 52), 'breakout', 'brick_' + (y + 1) + '_1.png');
            brick.body.bounce.set(1);
            brick.body.immovable = true;
        }
    }

    this.barriers = this.game.add.group();
    this.barriers.enableBody = true;
    this.barriers.physicsBodyType = Phaser.Physics.ARCADE;

    var barrier;

    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 2; j++) {
            barrier = this.barriers.create(120 + (i * 245), 50 + (j * 250), 'breakout', 'paddle_big.png');
            barrier.body.bounce.set(1);
            barrier.body.immovable = true;
        }
    }
};

stageThird.prototype.update = function () {
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
        this.game.physics.arcade.collide(this.ball, this.barriers, this.ballHitBarrier, null, this);
    }
};

stageThird.prototype.getNextStage = function () {
    return "gameEnd";
};