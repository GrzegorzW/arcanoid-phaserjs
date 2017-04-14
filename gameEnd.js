var gameEnd = function (game) {
};

gameEnd.prototype = Object.create(stage.prototype);

gameEnd.prototype.create = function () {
    this.s = this.game.add.tileSprite(0, 0, 800, 600, 'starfield');

    this.introText = this.game.add.text(this.game.world.centerX, 200, 'CONGRATULATIONS', {
        font: "40px Arial",
        fill: "#ffffff",
        align: "center"
    });
    this.introText.anchor.setTo(0.5, 0.5);

    this.scoreText = this.game.add.text(this.game.world.centerX, 350, 'Your score: ' + this.game.score, {
        font: "40px Arial",
        fill: "#ffffff",
        align: "center"
    });
    this.scoreText.anchor.setTo(0.5, 0.5);

    this.introText = this.game.add.text(this.game.world.centerX, 500, '- click to play again -', {
        font: "40px Arial",
        fill: "#ffffff",
        align: "center"
    });
    this.introText.anchor.setTo(0.5, 0.5);

    this.introText = this.game.add.text(this.game.world.centerX, 530, '3', {
        font: "20px Arial",
        fill: "#ffffff",
        align: "center"
    });
    this.introText.anchor.setTo(0.5, 0.5);

    this.game.input.onDown.add(this.play, this);
};

gameEnd.prototype.play = function () {
    this.game.state.start("boot");
};

