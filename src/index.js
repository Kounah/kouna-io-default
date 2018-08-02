import Firefly from './Particle/Firefly';
import random from './random';



const FRAMERATE = 30;

var renderInterval;
var actInterval;

console.log(Firefly);

window.particles = [];

window.addParticle = function (p) {
  window.particles.push(p)
}

function startUp() {
  var i = 0;
  for(i = 0; i < 20; i++) {
    window.addParticle(
      new Firefly(
        random.rangeFloat(0, window.innerWidth), // somewhere on X - achsis
        random.rangeFloat(0, window.innerHeight) // somewhere on Y - achsis
      )
    );
  }
  
  var c = document.getElementById('background-canvas');
  c.width = window.innerWidth;
  c.height = window.innerHeight;
  c.style.top = 0;
  c.style.left = 0;
  c.style.position = 'absolute';


  var ctx;
  if(c.getContext) {
    ctx = c.getContext('2d');
  }
  
  function act() {
    particles.forEach(function (particle) {
      particle.act();
    });
  }
  
  function draw() {
    ctx.fillStyle = '#27373f';
    ctx.fillRect(0,0,window.innerWidth, window.innerHeight);
   
    particles.forEach(function (particle) {
      particle.draw(ctx);
    });
  }
  
  
  var renderInterval = setInterval(draw, 1000 / FRAMERATE);
  var actInterval = setInterval(act, 1000 / FRAMERATE);
}

function cleanUp() {
  window.particles = [];
  clearInterval(renderInterval);
  clearInterval(actInterval);
}

document.addEventListener("DOMContentLoaded", function() {
  startUp();
})

window.addEventListener("resize", function() {
  cleanUp();
  startUp();
})