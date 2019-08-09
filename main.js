// fields--------------------
var N;
var linelist;
//entry point--------------------
window.onload = function(){
  initGraph();
  initDraw();
  initGraph();
  procDraw();
}
var startDraw=function(){
  document.getElementById("msgout").innerHTML="now drawing...";
  initGraph();
  setTimeout(procDraw,100);
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
/* reduceFraction([n,d]) returns fraction-reduced rational number n/d. */
var reduceFraction = function(input){
  [n,d]=input;
  if(d<0){
    n=-n;
    d=-d;
  }
  if(n==0&&d==0)return[n,d];
  if(n==0)d=1;
  if(d==0)n=1;
  for(var r=[n,d].min();r>1;r--){
    if(n%r==0 && d%r==0){
      n/=r;
      d/=r;
    }
  }
  return [n,d];
}
/* [ix,iy] = vertex2isec([x0,y0,x1,y1]) converts the representation of line (x0,y0)--(x1,y1) to two intersections (ix,0)--(iy,0). 
 * in: [x0,y0,x1,y1]
 * out: [ix,iy]
 *  ix=[ix_numer, ix_denom] = intersection to y=0 is (ix_numer/ix_denom, 0).
 *  iy=[iy_numer, iy_denom] = intersection to x=0 is (0, iy_numer/iy_denom).
 *  */
var vertex2isec=function(input){
  [x0,y0,x1,y1]=input;
  var dx,dy;
  [dy,dx]=reduceFraction([y1-y0,x1-x0]); // dy/dx
  return [
    [dy,dx],
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
resize = function(){ //browser resize
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
  //pick up
  var imageData=ctx.getImageData(0,0, can.width, can.height);
  var data=imageData.data;
  var xs=imageData.width;
  var ys=imageData.height;
  //processing
  for(var xi=0;xi<xs;xi++){ 
    for(var yi=0;yi<ys;yi++){ 

      var x=xi/xs*N;
      var y=yi/ys*N;
      var f=0;
      for(var li=0;li<linelist.length;li++){
        var dy,dx,ixn,ixd,iyn,iyd;
        var [[dy,dx],[ixn,ixd],[iyn,iyd]]=linelist[li];
        var vx1,vy1,vx2,vy2;
        if(ixn==0 && iyn==0){ // (0,0)--(dx,dy)
          vx1=x;
          vy1=y;
          vx2=dx;
          vy2=dy;
        }else{ // otherwise (0,ix)--(iy,0)
          var ix=ixn/ixd;
          var iy=iyn/iyd;
          vx1=ix-x;
          vy1= 0-y;
          vx2= 0-x;
          vy2=iy-y;
        }
        outer = vx1*vy2-vy1*vx2;
        if(outer<0) f=f+1; 
      }

      var c=(f%2)*255;

      var base=(yi*xs+xi)*4;
      data[base+0]=c;
      data[base+1]=c;
      data[base+2]=c;
      data[base+3]=255;
    }//yi
  }
  //output
  ctx.putImageData(imageData,0,0);
  document.getElementById("msgout").innerHTML="done.";
}






