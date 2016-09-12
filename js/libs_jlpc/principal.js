"use strict";
$(document).ready(function() {
 pr_inicio();
 setTimeout(function() {
  $("#intro").hide();
  $('#wrapper').show();
 }, 1000);
});

if (!('localStorage' in window && window['localStorage'] !== null)) {
 alert("Advertencia: Este navegador es antiguo, NO posee soporte completo a Html5/CSS3 y esto podría generar problemas.");
}
var storage;

function onDeviceReady() {
 try {
  if (localStorage.getItem) {
   storage = localStorage;
  }
 } catch (e) {
  storage = {};
 }
}

function esc(a){var b=unescape(a.substr(0,a.length-1)),c="",d=0;for(d=0;d<b.length;d+=1)c+=String.fromCharCode(b.charCodeAt(d)-a.substr(a.length-1,1));document.write(unescape(c))}