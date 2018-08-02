const Particle = require('./Particle');
const random = require('../random');

const MAX_SPEED = 4;
const MIN_SPEED = 1;

const MIN_SIZE = 8;
const MAX_SIZE = 32;

const MIN_LUMINENCE = 0.2;
const MAX_LUMINENCE = 0.8;

const MIN_LIFETIME = 60 * 3;
const MAX_LIFETIME = 60 * 12;

const CHANCE_SPAWN_2_NEW_ON_DEATH = 0.25;
const CHANCE_SPAWN_1_NEW_ON_DEATH = 0.75;

const MIN_CHANGE_DIRECTION = - ((2 * Math.PI) / 360) * 60;
const MAX_CHANGE_DIRECTION = ((2 * Math.PI) / 360) * 60;

const MAX_ROTATION_DIFF = ((2 * Math.PI) / 360) * 1;
const ROTATION_DIFF_INCREASE = ((2 * Math.PI) / 360) * 0.5;

const MIN_GROWTH = 0.8;
const MAX_GROWTH = 1.2;

const INCREASE_GROWTH = 0.01;

const DRAW_DEBUG = false;

function getRGBA(arr) {
  if(typeof arr == 'object' && arr instanceof Array) {
    if(arr.length == 4) {
      return 'rgba(' + 
      arr[0] + 
      ', ' + 
      arr[1] +
      ', ' + 
      arr[2] +
      ', ' +
      arr[3] +
      ')';
    } else return 'white';
  } else return 'white';
}

module.exports = class Firefly extends Particle {
  constructor(x, y, props) {
    super(x, y);

    this.style = { };
    this.style.colors = { };
    this.style.colors.baseColor = getRGBA(props && props.style && props.style.caseColor ? props.style.baseColor : [0, 200, 255, 0.75]);

    this.state = { };

    // float values
    this.state.direction = props && props.direction ? props.direction : random.rangeFloat(-2 * Math.PI, 2 * Math.PI);
    this.state.speed = props && props.speed ? props.speed : random.rangeFloat(MIN_SPEED, MAX_SPEED);
    this.state.luminence = props && props.luminence ? props.luminence : random.rangeFloat(MIN_LUMINENCE, MAX_LUMINENCE);
    this.state.size = props && props.size ? props.size : random.rangeFloat(MIN_SIZE, MAX_SIZE);
    this.state.growth = 1;
    this.state.chargedChangeDirection = props && props.chargedChangeDirection ? props.chargedChangeDirection : random.rangeFloat(MIN_CHANGE_DIRECTION, MAX_CHANGE_DIRECTION);
    this.state.rotationDiff = 0;

    // int values
    this.state.lifetime = props && props.lifetime ? props.lifetime : random.rangeInt(MIN_LIFETIME, MAX_LIFETIME);
    this.state.growing = props && props.growing ? props.growing : random.chance(0.5);

    // chances
    this.state.chance = {};

    this.state.chance.changeDirection = props && props.chance && props.chance.changeDirection ? props.chance.changeDirection : 0.25;
  
    this.spawnNew = this.spawnNew.bind(this);
  }

  spawnNew() {
    window.addParticle(new Firefly(
      random.rangeFloat(0, window.innerWidth),
      random.rangeFloat(0, window.innerHeight)));
  }

  act() {
    // this.state.lifetime--;

    if(this.state.isDying) {
      // do some smooth death
    } else {
      if(this.state.lifetime > 0) {
        // is alive, can do stuff
  
        // do the direction thingy
        if(this.state.chargedChangeDirection != 0) {
          if(this.state.chargedChangeDirection < 0) {
            if(this.state.chargedChangeDirection + this.state.rotationDiff >= 0) {
              this.state.direction += this.state.chargedChangeDirection;
              
              this.state.chargedChangeDirection = 0;
            } else {
              this.state.direction -= this.state.rotationDiff;
              
              this.state.chargedChangeDirection += this.state.rotationDiff;
            }
          }
          if(this.state.chargedChangeDirection > 0) {
            if(this.state.chargedChangeDirection - this.state.rotationDiff <= 0) {
              this.state.direction += this.state.chargedChangeDirection;

              this.state.chargedChangeDirection = 0;
            } else {
              this.state.direction += this.state.rotationDiff;

              this.state.chargedChangeDirection -= this.state.rotationDiff;
            }
          }

          if(this.state.rotationDiff < MAX_ROTATION_DIFF) {
            this.state.rotationDiff += ROTATION_DIFF_INCREASE;
          }  
        } else {
          if(random.chance(this.state.chance.changeDirection)) {
            if(this.state.chargedChangeDirection < 0) {
              this.state.chargedChangeDirection -= random.rangeFloat(MIN_CHANGE_DIRECTION, MAX_CHANGE_DIRECTION);
            }
            if(this.state.chargedChangeDirection > 0) {
              this.state.chargedChangeDirection += random.rangeFloat(MIN_CHANGE_DIRECTION, MAX_CHANGE_DIRECTION);
            }
            if(this.state.chargedChangeDirection == 0) {
              this.state.chargedChangeDirection = random.rangeFloat(MIN_CHANGE_DIRECTION, MAX_CHANGE_DIRECTION);
            }
          }
        }
  
        // do the growth thingy
        if(this.state.growing) {
          // grows
          if(this.state.growth < MAX_GROWTH) {
            this.state.growth += INCREASE_GROWTH;
          } else {
            // change growth to shrink
            this.state.growing = false;
          }
        } else {
          // shrinks
          if(this.state.growth > MIN_GROWTH) {
            this.state.growth -= INCREASE_GROWTH;
          } else {
            this.state.growing = true;
          }
        }

        // modify the size
        if(this.state.growing) {
          if(this.size < MAX_SIZE) {
            this.size *= this.state.growth;
          } else {
            this.state.growing = false;
          }
        } else {
          if(this.size > MIN_SIZE) {
            this.size /= this.state.growth;
          } else {
            this.state.growing = true;
          }
        }
  
        // move your light mr firefly!
        this.x += Math.cos(this.state.direction) * this.state.speed;
        this.y += Math.sin(this.state.direction) * this.state.speed;

        if(this.x < 0) {
          this.x = window.innerWidth;
        }
        if(this.x > window.innerWidth) {
          this.x = 0;
        }
        if(this.y < 0) {
          this.y = window.innerHeight;
        }
        if(this.y > window.innerHeight) {
          this.y = 0;
        }
      } else {
        // rest in piece little firefly
  
        this.state.isDying = true;
  
        if(random.chance(CHANCE_SPAWN_1_NEW_ON_DEATH)) {
          this.spawnNew();
        } else {
          if(random.chance(CHANCE_SPAWN_2_NEW_ON_DEATH)) {
            this.spawnNew();
            this.spawnNew();
          }
        }
      }
    }
  }

  draw(ctx) {
    ctx.fillStyle = this.style.colors.baseColor;

    console.log(this.style.colors.baseColor)
    ctx.strokeStyle = this.style.colors.baseColor;
    // ctx.beginPath();
    // ctx.arc(Math.trunc(this.x), Math.trunc(this.y), 
    // this.state.size, 
    // this.state.direction -(0.66 * Math.PI) , this.state.direction + (0.66 * Math.PI));
    // ctx.arc(Math.trunc(this.x), Math.trunc(this.y), 
    // this.state.size / 2, 
    // this.state.direction -(0.33 * Math.PI) , this.state.direction + (0.33 * Math.PI));
    // ctx.stroke();

    ctx.beginPath();
    ctx.arc(
      Math.trunc(this.x), Math.trunc(this.y), 
      this.state.size * 2,
      0,
      2 * Math.PI
    )
    var grad = ctx.createRadialGradient(
      this.x, this.y,
      this.state.size * 0.33 * this.state.luminence,
      this.x, this.y,
      this.state.size * 3 * this.state.luminence
    );
    grad.addColorStop(0, this.style.colors.baseColor)
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fill();

    if(DRAW_DEBUG) {
      ctx.fillStyle = 'white';
      var fontSize = 16;
      ctx.font = fontSize + "px Hack";
      var x = this.x + this.state.size + 4;
      ctx.fillText(
        '+dir: ' +
        Math.round(
          (360 / (2 * Math.PI)) * this.state.chargedChangeDirection * 100) / 100 
          + '°',
          x,
          this.y - (fontSize + 2));
      ctx.fillText(
        '=dir: ' +
        Math.round(
          (360 / (2 * Math.PI)) + this.state.chargedChangeDirection * 100) / 100
          + '°',
          x,
          this.y);
    }
  }
}