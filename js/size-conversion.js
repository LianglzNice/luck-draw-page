var clientwidth=parseInt(document.documentElement.clientWidth);
var ht=document.getElementsByTagName('html')[0];
var fontsize=clientwidth/320*20; 
ht.style.fontSize=fontsize+'px';

window.onresize=function(){
    clientwidth=parseInt(document.documentElement.clientWidth);
    fontsize=clientwidth/320*20;
    ht.style.fontSize=fontsize+'px';
}