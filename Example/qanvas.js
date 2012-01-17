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
    var _qanvas = function() {
      this.width = width;
      this.height = height;
    };
    _qanvas.prototype = {
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
        midWidth : width/2,
        midHeight : height/2,
        // And methods
        circle : function(cx,cy,radius) {
          paper.beginPath();
          paper.arc(cx,cy,radius,0,Math.PI * 2,true);
          paper.closePath();
          paper.stroke();
          paper.fill();
          return this
        },
        square : function(x,y,side,angle) {
          var xy = [x,y];
          var xwy = [x+side,y];
          var xwyh = [x+side,y+side];
          var xyh = [x,y+side];
          
          if(angle) {
            var ox = x+side/2, oy = y+side/2;
          
            xy =  this.helper.convert(x,y,ox,oy,angle);
            xwy = this.helper.convert(x+side,y,ox,oy,angle); 
            xwyh = this.helper.convert(x+side,y+side,ox,oy,angle); 
            xyh = this.helper.convert(x,y+side,ox,oy,angle); 
          }
          paper.beginPath()
          paper.moveTo.apply(paper,xy);
          paper.lineTo.apply(paper,xwy);
          paper.lineTo.apply(paper,xwyh);
          paper.lineTo.apply(paper,xyh);
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
        line : function(x,y,x2,y2) {
          paper.moveTo(x,y);
          paper.lineTo(x2,y2);
          paper.closePath();
          paper.stroke();
          paper.fill();
          return this;
        },
        helper : {
          c2p : function(x,y) {
            var r = Math.sqrt(x*x+y*y);
            var a = Math.atan(y/x);
            if(x < 0 && y >= 0) a += Math.PI // second quadrand
            if(x < 0 && y < 0) a += Math.PI // third
            if(x >= 0 && y < 0) a += 2*Math.PI  // fourth
            return [r,a];
          },
          p2c : function(r,a) {
            var x = r*Math.cos(a);
            var y = r*Math.sin(a);
            return [x,y];
          },
          convert : function(x,y,ox,oy,angle) {
            var xy = this.c2p(x-ox,y-oy);
            xy[1] += angle
            xy = this.p2c.apply(null,xy);
            xy[0] += ox;
            xy[1] += oy;
            return xy;
          }
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
    
    return new _qanvas;
  };
  
  return root;
  
}).call(this);