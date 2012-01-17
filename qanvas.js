(function() {
  root = this;
  // Usage :
  // var q = qanvas('myCanvasId',true); // True if you want fullscreen
  // var paper = q.paper;
  // paper.rect(10,10,20,10).circle(30,30,50);
  // as you can see it's not Raphael.js, each call to any method of paper will return the paper itself , and not the created element
  // you get much less absctraction than in Raphael.js, so if you need to modify an item after it's creation, use Raphael.js instead
  root.qanvas = function(el,fullScreen) {
    
    // Dom Element
    var canvas = document.getElementById(el);
    if(!canvas) throw new Error(el+' not found');
    // We extract the context2d
    var paper = canvas.getContext('2d');
    if(!paper) throw new Error(el+'.getContext(\'2d\') not found'); 
    // We store width and height, and set the 
    var width = canvas.width = fullScreen ? document.body.clientWidth : canvas.width;
    var height = canvas.height = fullScreen ? document.body.clientHeight : canvas.height;
    
    // The accessible part
    var _qanvas = {
      listen : function(kind,callback) {
        canvas.addEventListener(kind, function(e) {
          // offset for webkit pageX for gecko
          callback(e.offsetX || e.pageX, e.offsetY || e.pageY);
        }, false);
      },
      paper : {
        // We set props
        width : width,
        height : height,
        hx : width/2,
        hy : height/2,
        // And methods
        circle : function(cx,cy,radius) {
          paper.beginPath();
          paper.arc(cx,cy,radius,0,Math.PI * 2,true);
          paper.closePath();
          paper.stroke();
          paper.fill();
          return this
        },
        square : function(x,y,side) {
          paper.beginPath()
          paper.moveTo(x,y);
          paper.lineTo(x,y+side);
          paper.lineTo(x+side,y+side);
          paper.lineTo(x+side,y);
          paper.closePath();
          paper.stroke();
          paper.fill();
          return this
        },
        rect : function(x,y,width,height) {
          paper.beginPath()
          paper.moveTo(x,y);
          paper.lineTo(x,y+height);
          paper.lineTo(x+width,y+height);
          paper.lineTo(x+width,y);
          paper.closePath();
          paper.stroke();
          paper.fill();
          return this
        },
        text : function(x,y,text) {
          paper.fillText(text,x,y);
          return this;
        },
        style : function(style) {
          if(style && typeof style !== 'object') throw new TypeError('style should be an object, but it\'s a '+typeof style);   
          for(var prop in style) {
            if(paper.hasOwnProperty(prop) || typeof paper[prop] !== 'function') {
              paper[prop] = style[prop];
            }
            if(paper.hasOwnProperty(prop+'Style') || typeof paper[prop+'Style'] !== 'function') {
              paper[prop+'Style'] = style[prop];
            }
          }
          console.log(paper);
          return this;
        } ,
        fastStyle : function(prop,value) {
          if(!prop || !value) new Error('missing arguments');
          paper[prop] = value;
          return this;
        },
        clear : function(x,y,width,height) {
          (arguments.length === 4) ? paper.clearRect(x,y,width,height) : paper.clearRect(0,0,this.width,this.height);
          return this;
        }
      }
    };
    
    return _qanvas;
  };
  
  return root;
  
}).call(this);