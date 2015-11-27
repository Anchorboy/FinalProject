"use strict";

window.addEventListener('load', function(event){
  var draw = new drawCanvas();
  draw.init();
});

var drawCanvas = (function() {
  
  var clickX = new Array();
  var clickY = new Array();
  var clickDrag = new Array();
  var paint;
  
  var convertSz = 7/3;
  
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  var clearBtn = document.getElementById("clear");
  
  function addClick(x, y, drag){
     clickX.push(x);
     clickY.push(y);
     clickDrag.push(drag);
  }
      
  function clearCanvas(){
     context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  }
      
  function redraw(){
     clearCanvas();
        
     context.strokeStyle = "#df4b26";
     context.lineJoin = "round";
     context.lineWidth = 1;
        
     for(var i=0; i<clickX.length; i++){
       context.beginPath();
       if(clickDrag[i] && i){
         context.moveTo(clickX[i-1], clickY[i-1]);
       }
       else{
         context.moveTo(clickX[i]-1, clickY[i]);
       }
       context.lineTo(clickX[i], clickY[i]);
       context.closePath();
       context.stroke();
     }
  }
  
  var self = function() {
    paint = false;
  };
  
  self.prototype = {
    
    init: function(){
      this.mouseEvent();
    },
    
    mouseEvent: function(e){
      this.mouseClick();
      this.mouseMove();
      this.clear();
    },
    
    mouseClick: function(){
      canvas.addEventListener('click', function(event){
        document.getElementById("test").innerHTML = "click";
        
        var mouseX = event.pageX - this.offsetLeft;
        var mouseY = event.pageY - this.offsetTop;
        
        console.log(mouseX + " " + mouseY);
        
        paint = !paint;
        addClick(mouseX, parseInt(mouseY/convertSz));
        redraw();
      });
    },
    
    mouseMove: function(){
      canvas.addEventListener('mousemove', function(event){
        document.getElementById("test").innerHTML = "move";
        
        if(paint){
          addClick(event.pageX - this.offsetLeft, parseInt((event.pageY - this.offsetTop)/convertSz), true);
          redraw();
        }
      });
    },
    
    clear: function(){
      clearBtn.addEventListener('click', function(event){
        clearCanvas();
      });
    }
      
  };
  
  return self;
  
})(window);