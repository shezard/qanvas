window.onload = function() {
  
  // We get our qanvas, and we want it fullScreen
  var q = qanvas('canvas',true);
 
  // And our paper
  var paper = q.paper;
  
  
  // Set some utils function
  var utils = {
    hex : function(r) {
      return (r%16).toString(16);
    },
    rand : function(r) {
      return Math.floor(Math.random()*r) + 1;
    }
  };
  
  // We draw the background
  paper.style({stroke:'none',fill:'#222'}).rect(0,0,paper.width,paper.height);
  
  // We draw some text
  paper.fill('#fff').text(40,40,'Example 1');
  //And a circle
  paper.circle(65,70,10);
  
  // A rect this time
  paper.fill('#fff').text(120,40,'Example 2');
  paper.rect(135,60,30,10);
  
  // And a square
  paper.text(200,40,'Example 3');
  paper.square(215,60,20);
  
  // We setup the 4th example
  paper.text(280,40,'Example 4');
  paper.style({font:'20pt sans-serif'});
  
  // Some storage
  var dance = {
    // Initial values
    letter : 'D',
    color : '#f00',
    // Determine next color
    r2g2b : function(c) {
      switch(c) {
        case '#f00' : return '#0f0';
        case '#0f0' : return '#00f';
        case '#00f' : return '#f00';
      }
    },
    // Determine next letter
    dance : function(l) {
      switch(l) {
        case 'D' : return 'a';
        case 'a' : return 'n';
        case 'n' : return 'c';
        case 'c' : return 'e';
        case 'e' : return 'D';
      }
    }
  }
  
  // A simple loop
  setInterval(function() {
    // Clear an area
    paper.clear(280,45,40,40);
    // Redraw the background
    paper.fastStyle('font','20px sans-serif');
    paper.fastStyle('fillStyle','#222').square(280,45,40);
    // Draw the letter with given color
    paper.fastStyle('fillStyle',dance.color).text(290,70,dance.letter);
    // Iterate over letter & color
    dance.letter = dance.dance(dance.letter);
    dance.color = dance.r2g2b(dance.color);
  // Loop every 200ms
  },200);
  
  // We setup the 5th example
  paper.style({font:'10px sans-serif'});
  paper.text(360,40,'Example 5');
  
  // Some storage
  var r = 0;
  
  setInterval(function() {
    r++;
    paper.fastStyle('fillStyle','#'+utils.hex(r)+utils.hex(r)+utils.hex(r));
    paper.circle(380,50+r%50,r%10);
  },20);
  
  
  // We setup the 6th example
  paper.text(440,40,'Example 6');
  paper.style({fill:'#fff',stroke:'#fff'});
  
  // Some storage
  var grid = [[0,0,0],[0,0,0],[0,0,0]];
  
  // A simple loop
  setInterval(function() {
    paper.clear(440,45,90,90);
    var l = grid.length;
    for(;l--;) {
      var l2 = grid[l].length
      for(;l2--;) {
        var col = grid[l][l2]*255
        paper.fastStyle('fillStyle','rgb('+col+','+col+','+col+')');
        paper.square(440+l*30,45+l2*30,30);
      }
    }
  },50);
  
  // Event listener
  q.listen('click',function(x,y) {
    if(x >= 440 && x <= 530 && y >= 45 && y <= 135) {
      var realX = Math.floor((x-440)/30), realY = Math.floor((y-45)/30);
      grid[realX] && grid[realX][realY] && grid[realX][realY] ? grid[realX][realY] = 0 : grid[realX][realY] = 1
    }
  });
};