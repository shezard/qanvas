(function() {
  root = this;
  // Usage :
  // var q = qanvas(
  //   'myCanvasId', // The canvas id
  //   true,         // fullscreen ?
  //   2,            // x-scale
  //   2);           // y scale
  // var paper = q.paper;
  // paper.rect(10,10,20,10).circle(30,30,50);
  // as you can see it's not Raphael.js, each call to any method of paper will return the paper itself , and not the created element
  // you get much less absctraction than in Raphael.js, so if you need to modify an item after it's creation, use Raphael.js instead
  root.qanvas = function(el,fullScreen,scaleX,scaleY) {
    
    // Dom Element
    var canvas = document.getElementById(el || 'canvas');
    if(!canvas) throw Error(el+' not found');
    // We extract the context2d
    var paper = canvas.getContext('2d');
    if(!paper) throw Error(el+'.getContext(\'2d\') not found'); 
    
    var screenW = Math.max((document.body.clientWidth || window.innerWidth || document.body.scrollWidth), (window.screen.availWidth || 0));
    var screenH = window.innerheight || document.body.clientHeight || document.body.scrollHeight || window.screen.availHeight;
    // We store width and height, and set it 
    var width = canvas.width = fullScreen ? screenW*(scaleX || 1) : canvas.width*(scaleX || 1),
        height = canvas.height = fullScreen ? screenH *(scaleY || 1) : canvas.height*(scaleY || 1);
    
    // faster access cache
    var pi = Math.PI,
        pir = pi/180,
        cos = Math.cos,
        sin = Math.sin;
      
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
          paper.arc(cx,cy,radius,0,pi*2,true);
          paper.closePath();
          paper.stroke();
          paper.fill();
          return this
        },
        halfCircle : function(cx,cy,radius,angle,ox,oy) {
          if(angle) angle = pir*angle
          paper.beginPath();
          if(ox && oy) {
            var oxy = this.helper.convert(cx,cy,ox,oy,angle);
            paper.arc(oxy[0],oxy[1],radius,angle,angle+pi,true);
          } else {
            paper.arc(cx,cy,radius,(angle || 0),(angle || 0)+pi,true);
          }
          paper.closePath();
          paper.stroke();
          paper.fill();
          return this;
        },
        ellipse : function(cx,cy,width,height,angle,ox,oy) {
          var xy = [cx + height, cy - width], // C1
              xwy = [cx + height, cy + width], // C2
              xy2 = [cx - height, cy + width], // C3
              xwy2 = [cx - height, cy - width], // C4
              xwyh = [cx, cy + width], // A2
              xyh = [cx, cy - width];  // A1
          
          if(angle) {
            angle = pir*angle;
            var ox = ox || cx,
                oy = oy || cy;
          
            xy =  this.helper.convert(cx + height,cy - width,ox,oy,angle);
            xwy = this.helper.convert(cx + height,cy + width,ox,oy,angle); 
            xy2 =  this.helper.convert(cx - height,cy + width,ox,oy,angle);
            xwy2 = this.helper.convert(cx - height,cy - width,ox,oy,angle); 
            xwyh = this.helper.convert(cx,cy + width,ox,oy,angle); 
            xyh = this.helper.convert(cx,cy - width,ox,oy,angle); 
          }
          
          var t = xy.concat(xwy.concat(xwyh)),
              t2 = xy2.concat(xwy2.concat(xyh));
          paper.beginPath();
          paper.moveTo.apply(paper,xyh); // A1
          paper.bezierCurveTo.apply(paper,t); // Bezier 1
          paper.bezierCurveTo.apply(paper,t2); // Bezier 2
          paper.closePath();
          paper.stroke();
          paper.fill();
          return this;
        },
        halfEllipse : function(cx,cy,width,height,angle,ox,oy) {
          var xy = [cx + height, cy - width], // C1
              xwy = [cx + height, cy + width], // C2
              xwyh = [cx, cy + width], // A2
              xyh = [cx, cy - width];  // A1
          
          if(angle) {
            angle = pir*angle;
            var ox = ox || cx,
                oy = oy || cy;
          
            xy =  this.helper.convert(cx + height,cy - width,ox,oy,angle);
            xwy = this.helper.convert(cx + height,cy + width,ox,oy,angle); 
            xwyh = this.helper.convert(cx,cy + width,ox,oy,angle); 
            xyh = this.helper.convert(cx,cy - width,ox,oy,angle); 
          }
          
          var t = xy.concat(xwy.concat(xwyh));
          paper.beginPath();
          paper.moveTo.apply(paper,xyh); // A1
          paper.bezierCurveTo.apply(paper,t); // Bezier
          paper.closePath();
          paper.stroke();
          paper.fill();
          return this;
        },
        square : function(x,y,side,angle,ox,oy) {
          var xy = [x,y];
              xwy = [x+side,y],
              xwyh = [x+side,y+side],
              xyh = [x,y+side];
          
          if(angle) {
            angle = pir*angle;
            var ox = ox || x+side/2,
                oy = oy || y+side/2;
          
            xy =  this.helper.convert(x,y,ox,oy,angle);
            xwy = this.helper.convert(x+side,y,ox,oy,angle); 
            xwyh = this.helper.convert(x+side,y+side,ox,oy,angle); 
            xyh = this.helper.convert(x,y+side,ox,oy,angle); 
          }
          paper.beginPath();
          paper.moveTo.apply(paper,xy);
          paper.lineTo.apply(paper,xwy);
          paper.lineTo.apply(paper,xwyh);
          paper.lineTo.apply(paper,xyh);
          paper.closePath();
          paper.stroke();
          paper.fill();
          return this;
        },
        rect : function(x,y,width,height,angle,ox,oy) {
          var xy = [x,y],
              xwy = [x+width,y],
              xwyh = [x+width,y+height],
              xyh = [x,y+height];
          
          if(angle) {
            angle = pir*angle;
            var ox = ox || x+width/2,
                oy = oy || y+height/2;
          
            xy =  this.helper.convert(x,y,ox,oy,angle);
            xwy = this.helper.convert(x+width,y,ox,oy,angle); 
            xwyh = this.helper.convert(x+width,y+height,ox,oy,angle); 
            xyh = this.helper.convert(x,y+height,ox,oy,angle); 
          }
          paper.beginPath();
          paper.moveTo.apply(paper,xy);
          paper.lineTo.apply(paper,xwy);
          paper.lineTo.apply(paper,xwyh);
          paper.lineTo.apply(paper,xyh);
          paper.closePath();
          paper.stroke();
          paper.fill();
          return this;
        },
        quadri : function(x1,y1,x2,y2,x3,y3,x4,y4,angle,ox,oy) {
          var xy = [x1,y1];
              xwy = [x2,y2],
              xwyh = [x3,y3],
              xyh = [x4,y4];
          
          if(angle) {
            angle = pir*angle;
            var ox = ox || (x1+x2+x3+x4)/4,
                oy = oy || (y1+y2+y3+y4)/4;

            xy =  this.helper.convert(x1,y1,ox,oy,angle);
            xwy = this.helper.convert(x2,y2,ox,oy,angle); 
            xwyh = this.helper.convert(x3,y3,ox,oy,angle); 
            xyh = this.helper.convert(x4,y4,ox,oy,angle); 
          }
          paper.beginPath();
          paper.moveTo.apply(paper,xy);
          paper.lineTo.apply(paper,xwy);
          paper.lineTo.apply(paper,xwyh);
          paper.lineTo.apply(paper,xyh);
          paper.closePath();
          paper.stroke();
          paper.fill();
          return this
        },
        text : function(x,y,text) {
          paper.fillText(text,x,y);
          return this;
        },
        image : function(x,y,src) {
          var i = new Image();
          i.src = src;
          i.onload = function() {
            paper.drawImage(this,x,y);
          }
        },
        line : function(x1,y1,x2,y2,angle,ox,oy) {
          var xy = [x1,y1],
              xy2 = [x2,y2];
              
          if(angle) {
            angle = pir*Math.PI;
            var ox = ox || (x1+x2)/2,
                oy = oy || (y1+y2)/2;
                
            xy = this.helper.convert(x1,y1,ox,oy,angle);
            xy2 = this.helper.convert(x2,y2,ox,oy,angle);
          }
          paper.beginPath();
          paper.moveTo.apply(paper,xy);
          paper.lineTo.apply(paper,xy2);
          paper.closePath();
          paper.stroke();
          paper.fill();
          return this;
        },
        helper : {
          c2p : function(x,y) {
            var r = Math.sqrt(x*x+y*y),
                a = Math.atan(y/x);
            if(x < 0 && y >= 0) a += pi // second quadrand
            if(x < 0 && y < 0) a += pi // third
            if(x >= 0 && y < 0) a += 2*pi  // fourth
            return [r,a];
          },
          p2c : function(r,a) {
            var x = r*cos(a),
                y = r*sin(a);
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
        fill : function(fillStyle) {
          if(!fillStyle) throw Error('missing arguments');
          paper.fillStyle = fillStyle;
          return this;
        },
        stroke : function(strokeStyle) {
          if(!strokeStyle) throw Error('missing arguments');
          paper.strokeStyle = strokeStyle;
          return this;
        }, 
        style : function(style) {
          if(style && typeof style !== 'object') throw TypeError('style should be an object, but it\'s a '+typeof style);   
          for(var prop in style) {
            if(paper.hasOwnProperty(prop) || typeof paper[prop] !== 'function') {
              paper[prop] = style[prop];
            }
          }
          return this;
        } ,
        fastStyle : function(prop,value) {
          if(!prop || !value) throw Error('missing arguments');
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