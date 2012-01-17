## qanvas

_qanvas_ is a simple canvas wrapper
api is somewhat similar to Raphael.js

Not cross-platform at all, use chrome or _expect_ the _unexpected_

## Usage

```javascript

// Just an enhanced context2d
var paper = qanvas('myCanvasDivId').paper;

paper.width;
paper.height;
paper.midWidth;
paper.midHeight;

paper.circle(cx,cy,radius);

paper.rect(x,y,width,height);

paper.square(x,y,side);

paper.text(x,y,text);

paper.line(x1,y1,x2,y2);

```

You also got some basic helper in ```javascript qanvas().paper;``` :

```javascript

var paper = qanvas('myCanvasDivId').paper;

paper.helper.c2p(x,y);

paper.helper.p2c(radius,angle);

paper(x,y,gravityX,gravityY,angle);

```

## License

(The MIT License)

Copyright (c) 2011 Damien Fayol <dam.fayol@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.