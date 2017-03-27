var boot = function (game) {
};

boot.prototype = {
    introText: null,
    s: null,
    preload: function () {
        this.game.load.image('starfield', 'assets/misc/starfield.jpg');
    },
    create: function () {
        this.s = this.game.add.tileSprite(0, 0, 800, 600, 'starfield');

        this.introText = this.game.add.text(this.game.world.centerX, 400, '-- ARC GAME --', {
            font: "40px Arial",
            fill: "#ffffff",
            align: "center"
        });
        this.introText.anchor.setTo(0.5, 0.5);

        this.game.lives = 3;
        this.game.score = 0;
        this.game.currentLevel = 1;

        this.game.input.onDown.add(this.play, this);
    },
    play: function () {
        // this.game.state.start("stageFirst");
        this.game.state.start("stageSecond");
    }
};
