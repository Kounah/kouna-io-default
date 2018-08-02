module.exports = class Particle {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;

    this.act = this.act.bind(this);
    this.draw = this.draw.bind(this);
  }

  act() {
    // code for state progression here
  }

  draw(ctx) {
    // code for drawing here
  }
}