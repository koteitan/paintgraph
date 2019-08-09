// fields--------------------
var N=6;
var linelist;
//entry point--------------------
window.onload = function(){
  initGraph();
  initDraw();
  procDraw();
}
//graph------------------
var linelist=[];
var initGraph=function(){
  // input N
  N=parseInt(form0.size.value);
  // remove duplicate lines
  linelist=[];
  for(var x0=0;x0<=N;x0++){
    for(var y0=0;y0<=N;y0++){
      for(var x1=0;x1<=N;x1++){
        for(var y1=0;y1<=N;y1++){
          if(x0==x1 && y0==y1) continue;
          isec = vertex2isec([x0,y0,x1,y1]);
          var isDuplicated = false;
          for(var i=0;i<linelist.length;i++){
            if(linelist[i].isEqual(isec)){
              isDuplicated = true;
              break;
            }
          }
          if(!isDuplicated) linelist.push(isec);
        }
      }
    }
  }
}
var reduceFraction = function(input){
  [n,d]=input;
  if(d<0){
    n=-n;
    d=-d;
  }
  for(var r=[n,d].min();r>1;r--){
    if(n%r==0 && d%r==0){
      n/=r;
      d/=r;
    }
  }
  return [n,d];
}
var vertex2isec=function(input){
  [x0,y0,x1,y1]=input;
  var dx,dy;
  [dy,dx]=reduceFraction([y1-y0,x1-x0]); // dy/dx
  if(dx==0) dy=1;
  if(dy==0) dx=1;
  return [
    [dy,dx],// x0+dxs = a dy+dys = 0
    reduceFraction([x0*dy-dx*y0, dy]), // intersection to y=0
    reduceFraction([y0*dx-dy*x0, dx]), // intersection to x=0
  ];
}
//game loop ------------------
var procAll=function(){
  procEvent();
  if(isRequestedDraw){
    procDraw();
    isRequestedDraw = false;
  }
}
// html ----------------------------
window.onresize = function(){ //browser resize
  var wx,wy;
  wx= [(document.documentElement.clientWidth-10)*0.99, 320].max();
  wy= [(document.documentElement.clientHeight-200), 20].max();
  wx=wy=[wx,wy].min();
  document.getElementById("outcanvas").width = wx;
  document.getElementById("outcanvas").height= wy;
};
// graphics ------------------------
var ctx;
var can;
var gS;
var gW;
var isRequestedDraw = false;
var frameRate = 60; //[fps]
//init
var initDraw=function(){
  can = document.getElementById("outcanvas");
  ctx = can.getContext('2d');
}
//proc
var procDraw = function(){
  //background
  ctx.fillStyle="white";
  ctx.fillRect(0,0,can.width, can.height);
}
