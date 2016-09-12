'use strict';var navegador=navigator.userAgent;var fragment_userAgent=[];var match=[];var device={Mobile:function(){if((match=navegador.match(/Mobile|Tablet|Phone/gi))!==null){fragment_userAgent.push(match);}
return match;},Android:function(){if((match=navegador.match(/Android/gi))!==null){fragment_userAgent.push(match);}
return match;},iOS:function(){if((match=navegador.match(/iPhone|iPad|iPod/gi))!==null){fragment_userAgent.push(match);}
return match;},Windows:function(){if((match=navegador.match(/IEMobile|Windows Phone|Windows Mobile/gi))!==null){fragment_userAgent.push(match);}
return match;},BlackBerry:function(){if((match=navegador.match(/BlackBerry|RIM|BB10/gi))!==null){fragment_userAgent.push(match);}
return match;},Symbian:function(){if((match=navegador.match(/Symbian|SymbianOS|SymbOS/gi))!==null){fragment_userAgent.push(match);}
return match;},Opera:function(){if((match=navegador.match(/Opera Mini|Opera Mobile|Opera Mobi/gi))!==null){fragment_userAgent.push(match);}
return match;},Safari:function(){if((match=navegador.match(/Mobile Safari/gi))!==null){fragment_userAgent.push(match);}
return match;},Otros:function(){if((match=navegador.match(/Sony|MOT|Nokia|samsung|Nexus|KFAPWI|webOS|wOSBrowser|Bada|LiMo|MeeGo|FxOS/gi))!==null){fragment_userAgent.push(match);}
return match;},pantallaMovil:function(){return(window.innerWidth<=960&&window.innerHeight<=640);},Desktop:function(){return(window.innerWidth>=1024&&window.innerHeight>=600);},any_mobile:function(){fragment_userAgent=[];match=[];var mobile=true;device.Mobile();device.Android();device.iOS();device.Windows();device.BlackBerry();device.Symbian();device.Opera();device.Safari();device.Otros();$("#userAgent").append("navigator.userAgent: ["+navegador+"]");if(fragment_userAgent.length>0){mobile=true;}else{if(device.Desktop()){mobile=false;console.log("NO MOBILE DEVICE DETECTED");}else{console.log("UNKNOWN DEVICE");mobile=false;}}
function dialogOpen(){$("#noMovil").dialog({title:"Advertencia",modal:true,fluid:true,show:"scale",hide:"explode",dialogClass:'no-close',buttons:{"Ok":function(){location.href="index_emulador.html";}},closeOnEscape:false,open:function(event,ui){$(this).parent().children().children('.ui-dialog-titlebar-close').hide();},});}
if(mobile){location.href="index_rwd.html";}else{setTimeout(function(){dialogOpen();},2000);}
return mobile;}};