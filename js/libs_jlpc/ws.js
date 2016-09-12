"use strict";function saveStatusLocally(txt){window.localStorage.setItem("status",txt);}
function readStatus(){return window.localStorage.getItem("status");}
function sendLocalStatus(){var status=readStatus();if(status){window.localStorage.removeItem("status");}}
window.addEventListener("load",function(){if(navigator.onLine){saveStatusLocally(true);sendLocalStatus();}else{saveStatusLocally(false);}},true);window.addEventListener("online",function(){saveStatusLocally(true);sendLocalStatus();},true);window.addEventListener("offline",function(){saveStatusLocally(false);},true);