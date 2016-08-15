"use strict";

// save the string
function saveStatusLocally(txt) {
    
    window.localStorage.setItem("status", txt);
    //console.log("saveStatusLocally(" + txt + ")");
}
 
// read the string
function readStatus() {
    
    return window.localStorage.getItem("status");
}

function sendLocalStatus() {
    
    // Leemos el estado en local
    var status = readStatus();
    //console.log("sendLocalStatus(" + status + ")");

    // Si hay estados
    if (status) {
        // Lo enviamos al server online
        //sendToServer(status);
        //console.log("sendToServer(" + status + ")");

        // Borramos la copia local
        window.localStorage.removeItem("status");
    }
}



// Evento onload
window.addEventListener("load", function () {
    
    // Comprobamos que estemos online
    if (navigator.onLine) {
        // Si lo estamos enviamos datos de local
        // así actualizamos los cambios hechos offline
        // en nuestro servidor online
        saveStatusLocally(true);
        sendLocalStatus();
    } else {
        saveStatusLocally(false);
    }
}, true);

// Evento online
window.addEventListener("online", function () {
    
    // Evento que se activa cuando detecta que estamos online
    saveStatusLocally(true);
    sendLocalStatus();
}, true);

// Evento offline
window.addEventListener("offline", function () {
    
    // Evento que detecta cuando perdemos la conexión
    //alert("You're now offline. If you update your status, it will be sent when you go back online");
    saveStatusLocally(false);
}, true);
