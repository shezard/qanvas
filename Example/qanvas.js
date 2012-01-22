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
  root.qanvas = function(el,fullScreen) {
    
    // Dom Element
    var canvas = document.getElementById(el);
    if(!canvas) throw Error(el+' not found');
    // We extract the context2d
    var paper = canvas.getContext('2d');
    if(!paper) throw Error(el+'.getContext(\'2d\') not found'); 
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
        halfCircle : function(cx,cy,radius,angle) {
          if(angle) angle = Math.PI/180*angle
          paper.beginPath();
          paper.arc(cx,cy,radius,(angle || 0),(angle || 0)+Math.PI,true);
          paper.closePath();
          paper.stroke();
          paper.fill();
          return this
        },
        halfEllipse : function(cx,cy,width,height,angle,ox,oy) {
          if(angle) angle = Math.PI/180*angle
          var xy = [cx + width/2, cy - height/2]; // C1
          var xwy = [cx + width/2, cy + height/2]; // C2
          var xwyh = [cx, cy + height/2]; // A2
          var xyh = [cx, cy - height/2];  // A1
          
          if(angle) {
            var ox = ox || cx
            var oy = oy || cy;
          
            xy =  this.helper.convert(cx + width/2,cy - height/2,ox,oy,angle);
            xwy = this.helper.convert(cx + width/2,cy + height/2,ox,oy,angle); 
            xwyh = this.helper.convert(cx,cy + height/2,ox,oy,angle); 
            xyh = this.helper.convert(cx,cy - height/2,ox,oy,angle); 
          }
          
          var t = xy.concat(xwy.concat(xwyh));
          paper.beginPath();
          paper.moveTo.apply(paper,xyh); // A1
          paper.bezierCurveTo.apply(paper,t); // Bezier
          paper.closePath();
          paper.stroke();
          paper.fill();
          return this
        },
        square : function(x,y,side,angle,ox,oy) {
          if(angle) angle = Math.PI/180*angle
          var xy = [x,y];
          var xwy = [x+side,y];
          var xwyh = [x+side,y+side];
          var xyh = [x,y+side];
          
          if(angle) {
            var ox = ox || x+side/2;
            var oy = oy || y+side/2;
          
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
          return this
        },
        rect : function(x,y,width,height,angle,ox,oy) {
          if(angle) angle = Math.PI/180*angle
          var xy = [x,y];
          var xwy = [x+width,y];
          var xwyh = [x+width,y+height];
          var xyh = [x,y+height];
          
          if(angle) {
            var ox = ox || x+width/2;
            var oy = oy || y+height/2;
          
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
          return this
        },
        quadri : function(x1,y1,x2,y2,x3,y3,x4,y4,angle,ox,oy) {
          if(angle) angle = Math.PI/180*angle
          var xy = [x1,y1];
          var xwy = [x2,y2];
          var xwyh = [x3,y3];
          var xyh = [x4,y4];
          
          if(angle) {
            var ox = ox || (x1+x2+x3+x4)/4;
            var oy = oy || (y1+y2+y3+y4)/4;

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