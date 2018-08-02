module.exports = {
  rangeFloat: function(min, max) {
    return Math.random() * (max - min) + min;
  },
  rangeInt: function(min, max) {
    return Math.trunc(Math.random() * (max - min) + min);
  },
  chance: function(c) {
    return Math.random() < c;
  } 
}