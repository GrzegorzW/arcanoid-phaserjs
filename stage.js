var stage = function (game) {
};

stage.prototype = {
    ball: null,
    paddle: null,
    bricks: null,
    barrier: null,
    barriers: null,
    ballOnPaddle: true,
    livesText: null,
    s: null,
    explosions: null,
    preload: function () {
        this.game.load.atlas('breakout', 'assets/arc/breakout.png', 'assets/arc/breakout.json');
        this.game.load.image('starfield', 'assets/misc/starfield.jpg');
        this.game.load.spritesheet('kaboom', 'assets/arc/explode.png', 128, 128);
    },
    setupExplosion: function (explosion) {
        explosion.anchor.x = 0.5;
        explosion.anchor.y = 0.5;
        explosion.animations.add('kaboom');

    },
    createBall: function() {
        this.ball = this.game.add.sprite(this.game.world.centerX, this.paddle.y - 16, 'breakout', 'ball_1.png');
        this.ball.anchor.set(0.5);
        this.ball.checkWorldBounds = true;

        this.game.physics.enable(this.ball, Phaser.Physics.ARCADE);

        this.ball.body.collideWorldBounds = true;
        this.ball.body.bounce.set(1);

        this.ball.animations.add('spin', ['ball_1.png', 'ball_2.png', 'ball_3.png', 'ball_4.png', 'ball_5.png'], 50, true, false);

        this.ball.events.onOutOfBounds.add(this.ballLost, this);
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

        if (this.game.lives === 0) {
            this.gameOver();
        } else {
            this.ballOnPaddle = true;
            this.ball.reset(this.paddle.body.x + 16, this.paddle.y - 16);
            this.ball.animations.stop();
        }
    },
    gameOver: function () {
        this.ball.body.velocity.setTo(0, 0);
        this.explode(this.paddle);

        this.paddle.kill();

        this.introText.text = 'Game Over!';
        this.introText.visible = true;
    },
    ballHitBrick: function (_ball, _brick) {
        this.explode(_brick);
        _brick.kill();

        this.game.score += 10;

        this.scoreText.text = 'score: ' + this.game.score;

        if (this.bricks.countLiving() === 0) {
            this.game.score += 1000;
            this.scoreText.text = 'score: ' + this.game.score;
            this.introText.text = '- Next Level -';

            this.game.state.start("stageSecond");
        }

    },
    explode: function(sprite) {
        var explosion = this.explosions.getFirstExists(false);
        explosion.reset(sprite.body.x, sprite.body.y);
        explosion.play('kaboom', 30, false, true);
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
