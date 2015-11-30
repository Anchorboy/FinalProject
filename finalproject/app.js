"use strict";

window.addEventListener('load', function(event){
  var draw = new drawCanvas();
  draw.init();
});

var drawCanvas = (function() {
  
  var clickX = new Array();
  var clickY = new Array();
  var clickDrag = new Array();
  var color = new Array();
  var size = new Array();
  var paint;
  
  var convertSz = 350/150;
  
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  var clearBtn = document.getElementById("clear");
  var colCan = document.getElementById("colorcanvas").getContext("2d");
  
  // init value here
  var curColor = "#000000";
  var curSize = 2;
  
  // once canvas is clicked -> record every position into array
  function addClick(x, y, drag){
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(drag);
    
    color.push(curColor);
    size.push(curSize);
  }
  // reset canvas
  function clearCanvas(){
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  }
  
  function redraw(){
    clearCanvas();
        
    context.lineJoin = "round";
        
    for(var i=0; i<clickX.length; i++){
      context.beginPath();
      if(clickDrag[i] && i){
        context.moveTo(clickX[i-1], clickY[i-1]);
      }
      else{
        context.moveTo(clickX[i]-1, clickY[i]);
      }
      context.lineTo(clickX[i], clickY[i]);
      context.strokeStyle = color[i];
      context.lineWidth = size[i];
      context.closePath();
      context.stroke();
    }
  }
  
  /*
  // convert decimal numbers to hexadecimal
  function toHex(value, base){ 
    var convert = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"]; 
    if(value/base == 0) return ""; 
    else return toHex( Math.floor(value/base), base) + "" + convert[value%base]; 
  } 
  
  function oldsetColor(){
    curColor = "#";
      
    // init color value
    for(var i=1; i<=3; i++){
      var col = document.getElementById("color"+i);
      if(col.value < 0 || col.value > 255){
        col.value = 0;
      }
      var t;
      if(col.value == 0)
        t = "00";
      else if(col.value < 16)
        t = "0" + toHex(col.value, 16);
      else
        t = toHex(col.value, 16);
      
      curColor += t;
    }
      
    // record changed color every time
    color.push(curColor);
  }
  */
  
  function setColor(){
    curColor = "rgb(";
      
    // init color value
    for(var i=1; i<=3; i++){
      var col = document.getElementById("color"+i);
      if(col.value < 0 || col.value > 255){
        col.value = 0;
      }
      
      curColor += col.value;
      if(i!=3)
        curColor += ",";
    }
    
    curColor += ")";
    
    colCan.fillStyle = curColor;
    colCan.fillRect(0, 0, colCan.canvas.width, colCan.canvas.height);
    
    // record changed color every time
    color.push(curColor);
  }
  
  var self = function() {
    paint = false;
  };
  
  self.prototype = {
    
    init: function(){
      // init mouse event
      this.mouseEvent();
      this.changeColor();
      this.changeSize();
    },
    
    changeColor: function(){
      // there are 3 colors RGB
      for(var i=1; i<=3; i++){
        document.getElementById("color"+i).addEventListener('change', function(){
          setColor();
        });
      }
    },
    
    changeSize: function(){
      // 4 sizes
      for(var i=1; i<=4; i++){
        document.getElementById("size"+i).addEventListener('click', function(event){
          // just get the value from the button
          curSize = event.target.value;
          size.push(curSize);
        });
      }
    },
    
    mouseEvent: function(e){
      this.touchStart();
      this.touchEnd();
      this.touchMove();
      this.touchLeave();
      this.clear();
    },
    
    touchStart: function(){
      canvas.addEventListener('touchstart', function(event){
        document.getElementById("test").innerHTML = "touchstart";
        
        var touchX = event.changedTouches[0].pageX - this.offsetLeft;
        var touchY = event.changedTouches[0].pageY - this.offsetTop;
        
        paint = true;
        addClick(touchX, parseInt(touchY/convertSz));
        redraw();
      });
    },
    
    touchEnd: function(){
      canvas.addEventListener('touchend', function(event){
        document.getElementById("test").innerHTML = "touchend";
        
        paint = false;
      });
    },
    
    touchMove: function(){
      canvas.addEventListener('touchmove', function(event){
        document.getElementById("test").innerHTML = "touchmove";
        
        for (var i=0; i < event.changedTouches.length; i++) {
          if(paint){
            addClick(event.changedTouches[i].pageX - this.offsetLeft, parseInt((event.changedTouches[i].pageY - this.offsetTop)/convertSz), true);
            redraw();
          }
        }
        
      });
    },
    
    touchLeave: function(){
      canvas.addEventListener('touchleave', function(event){
        document.getElementById("test").innerHTML = "touchleave";
        
        paint = false;
      });
    },
    
    // clear button clicked
    clear: function(){
      clearBtn.addEventListener('click', function(event){
        clearCanvas();
        // clear all elements in clicks
        clickX.splice(0, clickX.length);
        clickY.splice(0, clickY.length);
        clickDrag.splice(0, clickDrag.length);
        color.splice(0, color.length);
        size.splice(0, size.length);
      });
    }
      
  };
  
  return self;
  
})(window);