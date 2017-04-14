var stageFirst = function (game) {
};

stageFirst.prototype = Object.create(stage.prototype);

stageFirst.prototype.create = function () {
    this.preCreate();

    this.bricks = this.game.add.group();
    this.bricks.enableBody = true;
    this.bricks.physicsBodyType = Phaser.Physics.ARCADE;

    var brick;

    for (var y = 0; y < 1; y++) {
        for (var x = 0; x < 15; x++) {
            brick = this.bricks.create(120 + (x * 36), 200 + (y * 52), 'breakout', 'brick_' + (y + 1) + '_1.png');
            brick.body.bounce.set(1);
            brick.body.immovable = true;
        }
    }
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

stageFirst.prototype.getNextStage = function () {
    return "stageSecond";
};
