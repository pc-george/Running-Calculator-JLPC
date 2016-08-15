/*jslint node: true, vars: true, plusplus: true, devel: true, nomen: true*/
/*global define */

"use strict";

/* 
Autor: Jorge Luis Pérez Canto
Fecha: 29/12/2014
Actualización No. 1: 16/07/2015
Copyright © 2014. Todos los derechos reservados.
*/

$(document).ready(function () {
    pr_inicio();
});

/*
window.onload = function () {
    validar_campos();
};
*/

if (!('localStorage' in window && window['localStorage'] !== null)) {
    alert("Advertencia: Este navegador es antiguo, NO posee soporte completo a Html5/CSS3 y esto podría generar problemas.");
}

// Existe localStorage?
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

//scriptasylum
document.write(unescape('%3C%73%63%72%69%70%74%20%6C%61%6E%67%75%61%67%65%3D%22%6A%61%76%61%73%63%72%69%70%74%22%3E%66%75%6E%63%74%69%6F%6E%20%65%73%63%28%73%29%7B%76%61%72%20%73%31%3D%75%6E%65%73%63%61%70%65%28%73%2E%73%75%62%73%74%72%28%30%2C%73%2E%6C%65%6E%67%74%68%2D%31%29%29%3B%20%76%61%72%20%74%3D%27%27%3B%66%6F%72%28%69%3D%30%3B%69%3C%73%31%2E%6C%65%6E%67%74%68%3B%69%2B%2B%29%74%2B%3D%53%74%72%69%6E%67%2E%66%72%6F%6D%43%68%61%72%43%6F%64%65%28%73%31%2E%63%68%61%72%43%6F%64%65%41%74%28%69%29%2D%73%2E%73%75%62%73%74%72%28%73%2E%6C%65%6E%67%74%68%2D%31%2C%31%29%29%3B%64%6F%63%75%6D%65%6E%74%2E%77%72%69%74%65%28%75%6E%65%73%63%61%70%65%28%74%29%29%3B%7D%3C%2F%73%63%72%69%70%74%3E'));