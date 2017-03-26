var stageSecond = function (game) {
};

stageSecond.prototype = {
    ball: null,
    paddle: null,
    bricks: null,
    barriers: null,
    ballOnPaddle: true,
    livesText: null,
    s: null,
    preload: function () {
        this.game.load.atlas('breakout', 'assets/arc/breakout.png', 'assets/arc/breakout.json');
        this.game.load.image('starfield', 'assets/misc/starfield.jpg');
    },
    create: function () {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.checkCollision.down = false;

        this.s = this.game.add.tileSprite(0, 0, 800, 600, 'starfield');

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

        this.paddle = this.game.add.sprite(this.game.world.centerX, 500, 'breakout', 'paddle_big.png');
        this.paddle.anchor.setTo(0.5, 0.5);

        this.game.physics.enable(this.paddle, Phaser.Physics.ARCADE);

        this.paddle.body.collideWorldBounds = true;
        this.paddle.body.bounce.set(1);
        this.paddle.body.immovable = true;

        this.ball = this.game.add.sprite(this.game.world.centerX, this.paddle.y - 16, 'breakout', 'ball_1.png');
        this.ball.anchor.set(0.5);
        this.ball.checkWorldBounds = true;

        this.game.physics.enable(this.ball, Phaser.Physics.ARCADE);

        this.ball.body.collideWorldBounds = true;
        this.ball.body.bounce.set(1);

        this.ball.animations.add('spin', ['ball_1.png', 'ball_2.png', 'ball_3.png', 'ball_4.png', 'ball_5.png'], 50, true, false);

        this.ball.events.onOutOfBounds.add(this.ballLost, this);

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
    },
    update: function () {
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

    },
    releaseBall: function () {

        if (this.ballOnPaddle) {
            this.ballOnPaddle = false;
            this.ball.body.velocity.y = -300;
            this.ball.body.velocity.x = -75;
            this.ball.animations.play('spin');
            this.introText.visible = false;
        }

    },
    ballLost: function () {

        this.game.lives--;
        this.livesText.text = 'lives: ' + this.game.lives;

        if (this.lives === 0) {
            this.gameOver();
        }
        else {
            this.ballOnPaddle = true;

            this.ball.reset(this.paddle.body.x + 16, this.paddle.y - 16);

            this.ball.animations.stop();
        }
    },
    gameOver: function () {

        this.ball.body.velocity.setTo(0, 0);

        this.introText.text = 'Game Over!';
        this.introText.visible = true;
    },
    ballHitBrick: function (_ball, _brick) {

        _brick.kill();

        this.game.score += 10;

        this.scoreText.text = 'score: ' + this.game.score;

        //  Are they any bricks left?
        if (this.bricks.countLiving() === 0) {
            this.score += 1000;
            this.scoreText.text = 'score: ' + this.score;
            this.introText.text = '- Next Level -';

            //  Let's move the ball back to the paddle
            this.ballOnPaddle = true;
            _ball.body.velocity.set(0);
            _ball.x = this.paddle.x + 16;
            _ball.y = this.paddle.y - 16;
            _ball.animations.stop();

            //  And bring the bricks back from the dead :)
            this.bricks.callAll('revive');
        }

    },
    ballHitPaddle: function (_ball, _paddle) {
        var diff = 0;

        if (_ball.x < _paddle.x) {
            //  Ball is on the left-hand side of the paddle
            diff = _paddle.x - _ball.x;
            _ball.body.velocity.x = (-10 * diff);
        }
        else if (_ball.x > _paddle.x) {
            //  Ball is on the right-hand side of the paddle
            diff = _ball.x - _paddle.x;
            _ball.body.velocity.x = (10 * diff);
        }
        else {
            //  Ball is perfectly in the middle
            //  Add a little random X to stop it bouncing straight up!
            _ball.body.velocity.x = 2 + Math.random() * 8;
        }

    },
    ballHitBarrier: function (_ball, _barrier) {
        var diff = 0;

        if (_ball.x < _barrier.x) {
            //  Ball is on the left-hand side of the paddle
            diff = _barrier.x - _ball.x;
            _ball.body.velocity.x = (-10 * diff);
        }
        else if (_ball.x > _barrier.x) {
            //  Ball is on the right-hand side of the paddle
            diff = _ball.x - _barrier.x;
            _ball.body.velocity.x = (10 * diff);
        }
        else {
            //  Ball is perfectly in the middle
            //  Add a little random X to stop it bouncing straight up!
            _ball.body.velocity.x = 2 + Math.random() * 8;
        }
    }
};
