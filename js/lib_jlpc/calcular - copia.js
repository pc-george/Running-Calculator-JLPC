/*jslint node: true, vars: true, plusplus: true, devel: true, nomen: true*/
/*global define */

"use strict";

/* 
Autor: Jorge Luis Pérez Canto
Fecha: 29/12/2014
Actualización No. 1: 16/07/2015
Copyright © 2014. Todos los derechos reservados.
*/


function alturaMenu() {
    
    var maxHeight, heights;

    maxHeight = 0;
    heights = $(".altoSpan").map(function () {
        return $(this).height();
    }).get();
    maxHeight = Math.max.apply(null, heights);
    $(".alto100").height(maxHeight);

    maxHeight = 0;
    heights = $(".alto100").map(function () {
        return $(this).height();
    }).get();
    maxHeight = Math.max.apply(null, heights);

    $(".alto100").height(maxHeight);
    //console.log("alturaMenu() " + heights + " / " + maxHeight);
}

//Declaración de variables globales:

var del_reg = false;
//var v_width = "auto";

var fecha = "", evento = "", unidad_medida_input = "", distancia_input = 0, distancia_km = 0, distancia_mt = 0, distancia_mi = 0, horas_input = 0, minutos_input = 0, segundos_input = 0.0, tiempo_min = 0, hrs_min_seg_input = "";

var resultKm = [], result_ritmo_x_km = "", result_kph = 0, result_mps = 0, result_ritmo_pista = "", result_ritmo_min_double = 0.0, result_ritmo_pista100 = "", resultMi = [], result_ritmo_x_milla = "", result_mph = 0;

var condicion_error = true, registros_p1 = [], registros_p2 = [], resultados_p1 = {}, resultados_p2 = {};

function inicializar1() {
    
    // Inicialización de variables
    fecha = "";
    evento = "";
    unidad_medida_input = "";
    distancia_input = 0;
    distancia_km = 0;
    distancia_mt = 0;
    distancia_mi = 0;
    horas_input = 0;
    minutos_input = 0;
    segundos_input = 0.0;
    tiempo_min = 0;
    hrs_min_seg_input = "";
}

function inicializar2() {
    
    resultKm = [];
    result_ritmo_x_km = "";
    result_kph = 0;
    result_mps = 0;
    result_ritmo_pista = "";
    result_ritmo_min_double = 0.0;
    resultMi = [];
    result_ritmo_x_milla = "";
    result_mph = 0;
}

function inicializar3() {
    
    condicion_error = true;
    registros_p1 = [];
    registros_p2 = [];
    resultados_p1 = {};
    resultados_p2 = {};
}

function ocultar(bloq) {
    
    var obj = document.getElementById(bloq);
    obj.style.display = 'none';
}

function mostrar(bloq) {
    
    var obj = document.getElementById(bloq);
    obj.style.display = 'block';
    obj.style.visibility = "visible";
}

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

function limpiarResultados() {
    
    
    $('.result').val("");

    $("#btn_guardar").attr("disabled", true);
    
    $('#resultados_p1').html("");
    $('#resultados_p2').html("");
    $('#btn_resultados').html("");

    $("#tabla_resultados").hide();
}
function Limpiar() {
    
    
    $('#form').each(function () {
        this.reset();
		console.log("form each reset");
    });

    $('#fecha').val(new Date().toDateInputValue());

    $(':input[type=number]', '#form')
        .not(':button, :submit, :reset')
        .val('')
        .removeAttr('checked')
        .removeAttr('selected');
    
    limpiarResultados();

    $("#resultados").hide();
	$('#resultados_p1').hide();

    inicializar1();
    inicializar2();
    inicializar3();

    //$('#fecha').focus();
	//$("input").off("change");
    
	$("input#distancia").off("change");
	$("input#hrs").off("change");
	$("input#min").off("change");
	$("input#sec").off("change");
	
    $("select").off("change");
}

$(document).ready(function () {
    
    $("#registros").hide();
    $("#acerca").hide();

    $('#fecha').val(new Date().toDateInputValue());

    //$("input").off("change");
	
	$("input#distancia").off("change");
	$("input#hrs").off("change");
	$("input#min").off("change");
	$("input#sec").off("change");

    $("select").off("change");

    //Cambio de tamaño de la ventana
    var id;
    $(window).resize(
        function () {
            clearTimeout(id);
            id = setTimeout(alturaMenu, 500);
        }
    );
    alturaMenu();
});

Date.prototype.toDateInputValue = function () {
	var local = new Date(this);
	local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
	return local.toJSON().slice(0, 10);
};

window.addEventListener("orientationchange", function () {
    
    // Hacer algo cuando cambia la orientación
    //alert(window.orientation);
    alturaMenu();
}, false);

function getAnio() {
    
    var fecha, anio_actual;
    
    fecha = new Date();
    anio_actual = fecha.getFullYear();
    if (anio_actual < 2015) {
        anio_actual = 2015;
    }
    return anio_actual;
}


window.onload = function () {
    
    // Validación de campos
    var fecha_lv, distancia_lv, hrs_lv, min_lv, sec_lv;
    
    fecha_lv = new LiveValidation('fecha');
    fecha_lv.add(Validate.Presence);
	
    distancia_lv = new LiveValidation('distancia');
    distancia_lv.add(Validate.Presence);
    distancia_lv.add(Validate.Numericality, {minimum: 0});
	
    hrs_lv = new LiveValidation('hrs');
    hrs_lv.add(Validate.Numericality, {minimum: 0, onlyInteger: true});
    
    min_lv = new LiveValidation('min');
    min_lv.add(Validate.Numericality, {minimum: 0, maximum: 59, onlyInteger: true});
    
    sec_lv = new LiveValidation('sec');
    sec_lv.add(Validate.Numericality, {minimum: 0.00, maximum: 59.99});
};





var db = null;

// Valores constantes
var razon_1km_mi = 0.62137; //mi
var razon_1km_mts = 1000; //mts


// Declaración de variables

var registros_p1;
var registros_p2;
var resultados_p1;
var resultados_p2;

var fecha;
var evento;
var unidad_medida_input;
var distancia_input;
var distancia_km;
var distancia_mt;
var distancia_mi;
var horas_input;
var minutos_input;
var segundos_input;
var hrs_min_seg_input;

var resultKm;
var result_ritmo_x_km;
var result_kph;
var result_mps;
var result_ritmo_pista;
var result_ritmo_pista100;
var resultMi;
var result_ritmo_x_milla;
var result_mph;

var condicion_error;

// Botones para mostras más o menos detalles de los resultados.
var array_btn_mas_resultados = {
    titulo : 'M&aacute;s resultados en otras unidades',
    funcion : 'resultP2MasDetallado()'
};
var array_btn_menos_resultados = {
    titulo : 'Menos detalles...',
    funcion : 'resultP1MenosDetallado()'
};

var array_btn_remover_bd = {
    titulo : 'Remover BD',
    funcion : 'removeTaffyDB()'
};

var info_extra1 = "Verifique los datos ingresados, <br>especialmente que la unidad de medida sea la correcta.";
var info_extra2 = "Verifique que todos los campos esten llenos.";



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


/*-------------------------------------------------------------------------------------------------------*/

// Función que retorna el numero 'Cero' en caso de que NO se reciba un valor numerico.
function getNum(val) {
    
    if (isNaN(val)) {
        return 0;
    } else {
        return val;
    }
}

function maxLengthCheck(object) {
    
    if (object.value.length > object.maxLength) {
        object.value = object.value.slice(0, object.maxLength);
    }
}

function nada_que_hacer(str) {
    
    if (!window.console) {
        
        var log, debug, error;
        
        log = window.opera ? window.opera.postError : alert;
        window.console = { log: function (str) {
            log(str);
        } };
        
        debug = window.opera ? window.opera.postError : alert;
        window.console = { debug: function (str) {
            debug(str);
        } };
        
        error = window.opera ? window.opera.postError : alert;
        window.console = { error: function (str) {
            error(str);
        } };
    }
}

function truncar_decimales(n) {
    
    return Math[n > 0 ? "floor" : "ceil"](n);
}

function obtener2digitosMenoresDe10(param_numero) {
    
	param_numero = Math.round(param_numero);
	
    var numero_str = "";
    if (param_numero < 10) {
        numero_str = "0" + param_numero;
    } else {
        numero_str = param_numero;
    }
    return numero_str;
}
function separarNumeroEnteroDecimal(param_numero) {
    
    var numero, parte_entera, parte_decimal, result_numero;
    
    numero = parseFloat(param_numero);
    
    // Truncamos y obtenemos solo la parte Entera del número
    parte_entera = parseInt(truncar_decimales(numero), 10);
    
    // Obtenemos solo la parte deciamal, con una precisión de 5 dígitos
    parte_decimal = parseFloat((numero - parte_entera).toFixed(5));
    
    // Si los decimales son Ceros retornamos solo la parte Entera.
    result_numero = 0;
    if (parte_decimal === 0) {
        result_numero = parseInt(parte_entera, 10);
    } else {
        result_numero = numero;
    }
    
	var arr = param_numero.toString().split(".");
	var entero = arr[0];
	var decimal = arr[1];
	
	if ((decimal === undefined) || (decimal == null)) {
		decimal = parte_decimal;
	}
	
	/*
	console.log("result_numero: " + result_numero);
	console.log("parte_entera: " + parte_entera);
	console.log("parte_decimal: " + parte_decimal);
	console.log("decimal: " + decimal);
	*/
	
    return [result_numero, parte_entera, parte_decimal, decimal];
}

function separar_hhmmss(param_hhmmss) {
	var arr = param_hhmmss.toString().split(":");
	
	var horas = 0, minutos = 0, segundos = 0.0;
	
	horas = parseInt(arr[0]);
	minutos = parseInt(arr[1]);
	segundos = parseFloat(arr[2]);
	
	return [horas, minutos, segundos];
}


// Función que convierte el tiempo recibido en 'minutos decimales' a 'horas, minutos y segundos'.
function decimal_a_hhmmss(param_ritmo_double) {
    
    var horas, minutos, segundos, tiempo, str_segundos, seg_decimal;
    
    horas = 0;
    minutos = parseFloat(param_ritmo_double);
    segundos = 0.0;
    
    // Convertimos los minutos a Horas:minutos
    while (minutos >= 60) {
        horas += 1;
        minutos -= 60;
    }

    // Llamamos función para separar los minutos en su parte entera y deciamal
    tiempo = separarNumeroEnteroDecimal(minutos);
    minutos = tiempo[1];
    seg_decimal = tiempo[2];

    // Convertimos los decimales a segundos.
	segundos = seg_decimal * 60;
	
    return [horas, minutos, segundos];
}

// #2_rp2
function resultP2MasDetallado() {
    
    //Mostramos los resultados de la parte 2
    $('#resultados_p2').show();

    // Se agrega 'link' para llamar a función que muestra menos detalles de los resultados.
    var origen, plantilla;
    origen = $('#plantilla_btn_resultados').html();
    plantilla = Handlebars.compile(origen);
    $('#btn_resultados').html(plantilla(array_btn_menos_resultados));

    //Se mueve cursor hasta los botones de guardar y limpiar.
    $('html,body').animate({
        scrollTop: $("#resultados_p2").offset().top
    }, 500);
}

// #3_rp1
function resultP1MenosDetallado() {
    
    var origen, plantilla;
    // Link para ver mas resultados.
    origen = $('#plantilla_btn_resultados').html();
    plantilla = Handlebars.compile(origen);
    $('#btn_resultados').html(plantilla(array_btn_mas_resultados));

    $('html,body').animate({
        //scrollTop: $("#btn_guardar_limpiar").offset().top
        scrollTop: $("#btn_calcular").offset().top
    }, 300);

    // Ocultamos los resultados de la parte 2, para dejar solo la parte 1
    $('#resultados_p2').hide();
}

//#1
function mostrarResultados(unidad, ritmo_km, kph, mps, ritmo_mi, mph, pista, ritmo_double, pista100) {
    
    var origen, plantilla, error, tmp_mps, tmp_kph, tmp_mph, array_ritmo_mi, array_ritmo_km, array_mph, array_kph, array_mps, array_pista, array_pista100, ritmo_minimo, kph_minimo, limite_humano_kph, array_botones, source;
    
    // Si los decimales son ceros obtenemos y mostramos solo la parte Entera.    
    tmp_mps = separarNumeroEnteroDecimal(mps);
    mps = tmp_mps[0];
    
    tmp_kph = separarNumeroEnteroDecimal(kph);
    kph = tmp_kph[0];
    
    tmp_mph = separarNumeroEnteroDecimal(mph);
    mph = tmp_mph[0];

    registros_p1 = [];
    registros_p2 = [];

    // Preparamos los resultados para mostrarlos posteriormente en etiquetas html
    
    array_ritmo_mi = {nombre: 'ritmo_x_mi', etiqueta: 'Ritmo por Milla', velocidad: ritmo_mi, unidades_de_medida: 'minutos/millas'};

    array_ritmo_km = {nombre: 'ritmo_x_km', etiqueta: 'Ritmo por Km.', velocidad: ritmo_km, unidades_de_medida: 'minutos/kil&oacute;metros'};

    array_mph = {nombre: 'mph', etiqueta: 'Velocidad en Mph', velocidad: mph, unidades_de_medida: 'Millas/hora'};
    
    array_kph = {nombre: 'kph', etiqueta: 'Velocidad en kph', velocidad: kph, unidades_de_medida: 'kil&oacute;metros/hora'};
    
    array_mps = {nombre: 'mps', etiqueta: 'Velocidad en mps', velocidad: mps, unidades_de_medida: 'metros/segundos'};

    array_pista = {nombre: 'pista', etiqueta: 'Ritmo en pista oval de 400 m', velocidad: pista, unidades_de_medida: 'minutos/vuelta'};
	
	array_pista100 = {nombre: 'pista100', etiqueta: 'Ritmo en 100 metros planos', velocidad: pista100, unidades_de_medida: 'Segundos . centésima'};

    // Establecemos rango de valores validos.
    ritmo_minimo = 0.1;
    kph_minimo = 3; //2.5
    limite_humano_kph = 50;
    
    //console.debug("\nritmo_double: '" + ritmo_double + "'   Condición > " + ritmo_minimo);
    //console.debug("kph: '" + kph + "'   Condición: >= " + kph_minimo + " && <= " + limite_humano_kph);

    condicion_error = true;

    // Si el ritmo y la velocidad estan dentro de los rangos establecidos...
    if ((ritmo_double > ritmo_minimo) && (kph >= kph_minimo)) {
        if (kph <= limite_humano_kph) {

            // Dependiendo de la unidad de medida se ordenan los resultados.

            if (unidad.localeCompare("km") === 0) {
                registros_p1.push(array_ritmo_km);
                registros_p1.push(array_pista);
				registros_p1.push(array_pista100);
				
				registros_p2.push(array_kph);
                registros_p2.push(array_mps);
                registros_p2.push(array_ritmo_mi);
                registros_p2.push(array_mph);
            } else if ((unidad.localeCompare("mi")) === 0) {
                registros_p1.push(array_ritmo_mi);
                registros_p1.push(array_pista);
				registros_p1.push(array_pista100);
				
				registros_p2.push(array_mph);
                registros_p2.push(array_ritmo_km);
                registros_p2.push(array_kph);
                registros_p2.push(array_mps);
            } else if ((unidad.localeCompare("m") === 0) || (unidad.localeCompare("mt") === 0)) {
				registros_p1.push(array_pista100);
                registros_p1.push(array_pista);
                registros_p1.push(array_ritmo_km);
				
				registros_p2.push(array_mps);
                registros_p2.push(array_kph);
                registros_p2.push(array_mph);
                registros_p2.push(array_ritmo_mi);
            } else {
                console.error("else: error en unidad: " + unidad);
            }
            
            origen = $('#plantilla_btn_resultados').html();
            plantilla = Handlebars.compile(origen);
            $("#tabla_resultados").addClass("tb");

            $('#btn_resultados').html(plantilla(array_btn_mas_resultados));

            array_botones = {
                etiqueta_guardar: "Guardar",
                funcion_guardar : "guardar1();",
                icono_guardar: "./img/32/save-32.png",
                //icono_guardar: "./img/32/floppy_disk_save-32.png",
                btn_guardar: "btn-success",
                etiqueta_limpiar: "Limpiar",
                funcion_limpiar : "Limpiar();",
                //icono_limpiar: "./img/32/1417013741_remove-sign-32.png",
                icono_limpiar: "./img/32/1420174804_clear_left.png",
                
                btn_limpiar: "btn-warning"
            };

            origen = $('#plantilla_btn_guardar_limpiar').html();
            plantilla = Handlebars.compile(origen);
            $('#btn_guardar_limpiar').html(plantilla(array_botones));

            condicion_error = false;

        } else {
            condicion_error = true;
            error = {
                msj_error : "Error: Resultados fuera de los límites humanos.",
                info_extra : info_extra1
            };
        }
    } else {
        condicion_error = true;
        error = {
            msj_error : "Error: Resultados fuera de rango.",
            info_extra : info_extra1
        };
    }

    // En caso de que los valores esten fuera de rango, preparamos un mensaje de error en lugar del resultado.
    if (condicion_error === true) {
        origen = $('#plantilla_error').html();
        plantilla = Handlebars.compile(origen);

        $('#error').html(plantilla(error));

        $('#error').show();
        $("#error").fadeTo(7500, 500).slideUp(500, function () {
            $("#alert-danger").alert('close');
        });
        $('html,body').animate({
            scrollTop: $("#error").offset().top
        }, 500);
        
    } else {
        $("#resultados").show();
        $("#tabla_resultados").show();
    
        $('html,body').animate({
            //scrollTop: $("#btn_guardar_limpiar").offset().top
            scrollTop: $("#btn_calcular").offset().top
        }, 500);

        // Mostramos los resultados principales
        source   = $("#plantilla-resultados").html();
        plantilla = Handlebars.compile(source);

        resultados_p1 = { elementos: registros_p1 };
        resultados_p2 = { elementos: registros_p2 };

        $('#resultados_p1').html(plantilla(resultados_p1));
        $('#resultados_p2').html(plantilla(resultados_p2));

        $("#tabla_resultados").addClass("tb");

        //Habilitados boton para guardar
        $("#btn_guardar").attr("disabled", false);
    }

    $('#resultados_p1').show();
    $('#resultados_p2').hide();
    
}

function getRitmo(param_unidad_medida, param_distancia, param_tiempo_min) {
    
    var ritmo_min_double, ritmo_horas, ritmo_minutos, ritmo_str_segundos, ritmo_x_unidad, str_ritmoPista, str_ritmoPista100, velocidad_unidad_x_hora, velocidad_unidad_x_hora_sin_ceros, velocidad_metros_x_segundos, ritmo_hhmmss, ritmo_pista_double, ritmo_pista100_double, ritmoPista, ritmoPista100;
    
    // Inicialización de variables
    ritmo_min_double = 0.0; //double
    ritmo_horas = 0; // int
    ritmo_minutos = 0; //int
    ritmo_str_segundos = ""; //String Ej: '05'
    ritmo_x_unidad = ""; //String min'seg"

    str_ritmoPista = ""; //String min:seg
	str_ritmoPista100 = ""; //String min:seg
    velocidad_unidad_x_hora = 0.0; //double
    velocidad_metros_x_segundos = 0.0; //double
    ritmo_hhmmss = []; // array

    // Calculo del 'Ritmo' en minutos en base a la formula: tiempo/distancia
    ritmo_min_double = (param_tiempo_min / param_distancia); //para mayor exactitud no redondear.
    
    // Conversión del Ritmo en 'minutos' a hh:minutos:segundos
    ritmo_hhmmss = decimal_a_hhmmss(ritmo_min_double);
    ritmo_horas = ritmo_hhmmss[0];
    ritmo_minutos = ritmo_hhmmss[1];
    ritmo_str_segundos = obtener2digitosMenoresDe10(ritmo_hhmmss[2]);
    
    // Concatenación de las partes del ritmo (hh:mm':seg'')
    if (ritmo_horas > 0) {
        ritmo_x_unidad = obtener2digitosMenoresDe10(ritmo_horas) + " : " + obtener2digitosMenoresDe10(ritmo_minutos) + "\' : " + obtener2digitosMenoresDe10(ritmo_str_segundos) + "\'\'";
    } else {
        ritmo_x_unidad = obtener2digitosMenoresDe10(ritmo_minutos) + "\' : " + obtener2digitosMenoresDe10(ritmo_str_segundos) + "\'\'";
    }

    // Calculo de la Velocidad en la 'unidad de medida' por Horas, Ej: Kms/hrs (kph) ó  Mi/hrs (mph).
    velocidad_unidad_x_hora = parseFloat(((param_distancia * 60) / param_tiempo_min).toFixed(2));
    
    // Calcular ritmo en 'pista atletica' y velocidad en metros por segundos si la unidad de medida es 'KM'
    if ((param_unidad_medida.toLowerCase().localeCompare("km")) === 0) {
        
        // Calculo de velocidad en metros por segundos
        velocidad_metros_x_segundos = parseFloat(((velocidad_unidad_x_hora * 1000) / 3600).toFixed(2));

        // Calculo de ritmo en circuito de pista atletica
        ritmo_pista_double = parseFloat(((ritmo_min_double * 400) / 1000).toFixed(5));
		ritmo_pista100_double = parseFloat(((ritmo_min_double * 100) / 1000).toFixed(5));
        
        // Conversion de ritmo decimal a hh:minutos:segundos
        ritmoPista = decimal_a_hhmmss(ritmo_pista_double);
		ritmoPista100 = decimal_a_hhmmss(ritmo_pista100_double);
		
		ritmoPista100[2] = parseFloat((ritmoPista100[2]).toFixed(2));
		var rp100_seg = separarNumeroEnteroDecimal(ritmoPista100[2]);
		ritmoPista100[2] = rp100_seg[1];
		ritmoPista100[3] = rp100_seg[3];
		
		//console.log(rp100_seg[3]);
			
		//tiempo = separarNumeroEnteroDecimal(minutos);
		
        if (ritmoPista[0] > 0) { // Si 'horas' mayor a cero...
            str_ritmoPista = obtener2digitosMenoresDe10(ritmoPista[0]) + " : " + obtener2digitosMenoresDe10(ritmoPista[1]) + "\' : " + obtener2digitosMenoresDe10(ritmoPista[2]) + "\'\'";
        } else { // Si no hay 'horas', solo 'minutos' y 'segundos'...
            str_ritmoPista = obtener2digitosMenoresDe10(ritmoPista[1]) + "\' : " + obtener2digitosMenoresDe10(ritmoPista[2]) + "\'\'";
        }
		
		var cs = 0;
		cs = obtener2digitosMenoresDe10(ritmoPista100[3]);
		
		if (ritmoPista100[0] > 0) { // Si 'horas' mayor a 'cero'...
			str_ritmoPista100 = obtener2digitosMenoresDe10(ritmoPista100[0]) + " : " + obtener2digitosMenoresDe10(ritmoPista100[1]) + "\' : " + obtener2digitosMenoresDe10(ritmoPista100[2]) + "\'\' . " + cs + " cs";
		} else { // Si no hay 'horas', solo 'minutos' y 'segundo's...
			if (ritmoPista100[1] > 0) { // Si 'minutos' mayor a 'cero'...
				str_ritmoPista100 = obtener2digitosMenoresDe10(ritmoPista100[1]) + "\' : " + obtener2digitosMenoresDe10(ritmoPista100[2]) + "\'\' . " + cs + " cs";
			} else { // Si no hay 'minutos' solo 'segundos'...
				str_ritmoPista100 = obtener2digitosMenoresDe10(ritmoPista100[2]) + "\'\' . " + cs + " cs";
			}
		}
    }
	
	ritmo_min_double = parseFloat((ritmo_min_double).toFixed(5));
	
    return [ritmo_x_unidad, velocidad_unidad_x_hora, velocidad_metros_x_segundos, str_ritmoPista, ritmo_min_double, str_ritmoPista100];
}

function calcular() {
    
    var origen, plantilla, error, precision;
    
    //Limpiamos resultados anteriores.
    limpiarResultados();

    // Inicialización de variables
    inicializar1();

    // Obtención y almacenamiento de la 'distancia' ingresada
    distancia_input = parseFloat($("#distancia").val());
    
    // Si el valor de la distancia fue ingresado, continuamos...
    if (distancia_input > 0) {

        // Obtenemos y almacenamos los valores ingresados
        unidad_medida_input = $("#unidad").val().toLowerCase();
        horas_input = getNum(parseFloat($("#hrs").val()));
        minutos_input = getNum(parseFloat($("#min").val()));
		
		
		segundos_input = getNum(parseFloat($("#sec").val()));
		var sec_arr = segundos_input.toString().split(".");
		var sec_entero = sec_arr[0];
		var sec_decimal = sec_arr[1];
		if ((sec_decimal === undefined) || (sec_decimal == null)) {
			sec_decimal = 0;
		}
        
        hrs_min_seg_input = obtener2digitosMenoresDe10(horas_input) + ":" + obtener2digitosMenoresDe10(minutos_input) + ":" + obtener2digitosMenoresDe10(sec_entero) + "." + obtener2digitosMenoresDe10(sec_decimal);

        // Conversión del tiempo ingresado a 'minutos'
        tiempo_min = (horas_input * 60) + (minutos_input) + (segundos_input / 60);
        
        if (tiempo_min > 0) {

            if ((unidad_medida_input.localeCompare("km")) === 0) { // Returns 0 if the two strings are equal
                distancia_km = distancia_input;
                distancia_mt = distancia_km * razon_1km_mts;
                distancia_mi = distancia_km * razon_1km_mi;
            } else if ((unidad_medida_input.localeCompare("mi")) === 0) {
                distancia_mi = distancia_input;
                distancia_km = distancia_mi / razon_1km_mi;
                distancia_mt = distancia_km * razon_1km_mts;
            } else if ((unidad_medida_input.localeCompare("m") === 0) || (unidad_medida_input.localeCompare("mt") === 0)) {
                distancia_mt = distancia_input;
                distancia_km = distancia_mt / razon_1km_mts;
                distancia_mi = distancia_km * razon_1km_mi;
            } else {
                console.error("else: error en unidad_medida: " + unidad_medida_input);
            }
            
            //Redondear distancia
            precision = 5; //Para mayor exactitud, aumentar el numero precision.
            distancia_mi = parseFloat(distancia_mi.toFixed(precision));
            distancia_km = parseFloat(distancia_km.toFixed(precision));
            distancia_mt = parseFloat(distancia_mt.toFixed(precision));
            
            // Inicialización de variables
            inicializar2();

            // Calcular ritmo
            resultKm = getRitmo("Km", distancia_km, tiempo_min);
            result_ritmo_x_km = resultKm[0];
            result_kph = resultKm[1];
            result_mps = resultKm[2];
            result_ritmo_pista = resultKm[3];
            result_ritmo_min_double = resultKm[4];
			result_ritmo_pista100 = resultKm[5];
            
            resultMi = getRitmo("Mi", distancia_mi, tiempo_min);
            result_ritmo_x_milla = resultMi[0];
            result_mph = resultMi[1];
			
			tiempo_min = parseFloat((tiempo_min).toFixed(5));
			
            mostrarResultados(unidad_medida_input, result_ritmo_x_km, result_kph, result_mps, result_ritmo_x_milla, result_mph, result_ritmo_pista, result_ritmo_min_double, result_ritmo_pista100);
			
			
            //$("input").change(function () {
			
			$("input#distancia").change(function () {
                limpiarResultados();
            });
			$("input#hrs").change(function () {
                limpiarResultados();
            });
			$("input#min").change(function () {
                limpiarResultados();
            });
			$("input#sec").change(function () {
                limpiarResultados();
            });
			
			$("input#distancia").focus(function () {
                limpiarResultados();
            });
			$("input#hrs").focus(function () {
                limpiarResultados();
            });
			$("input#min").focus(function () {
                limpiarResultados();
            });
			$("input#sec").focus(function () {
                limpiarResultados();
            });
			
			
            $("select").change(function () {
                limpiarResultados();
            });
			
        } else {//fin tiempo min
            
            origen = $('#plantilla_error').html();
            plantilla = Handlebars.compile(origen);
            error = {
                msj_error : "El tiempo ingresado NO es valido",
                info_extra : info_extra2
            };
            $('#error').html(plantilla(error));

            $('#error').show();
            $("#error").fadeTo(7500, 500).slideUp(500, function () {
                $("#alert-danger").alert('close');
            });
            $('html,body').animate({
                scrollTop: $("#error").offset().top
            }, 500);
        }
    } else {
        origen = $('#plantilla_error').html();
        plantilla = Handlebars.compile(origen);
        error = {
            msj_error : "La distancia ingresada NO es valida",
            info_extra : info_extra2
        };
        $('#error').html(plantilla(error));

        $('#error').show();
        $("#error").fadeTo(7500, 500).slideUp(500, function () {
            $("#alert-danger").alert('close');
        });
        $('html,body').animate({
            scrollTop: $("#error").offset().top
        }, 500);
    }
}


function openTaffyDB() {
    
    // Si la base de datos NO se ha instanciado ni utilizado...
    if (db === null) {
        // Instanciamos una base de datos.
        db = TAFFY();
        // Almacenamos la base de datos con taffy_localStorage
        db.store("db"); // db -> taffy_db
        
        //console.debug("db instanciada.");
    }
}

function verDB() {
    
    var origen, plantilla, historial, histo;
    
    $("#espacio").hide();

    $("#entrada_de_datos").hide();
    $("#resultados").hide();
    $("#registros").show();

    $("#acerca").hide();
    
    $("#nav-menu").removeClass("active");
    $("#nav-acerca").removeClass("active");
    $("#nav-ver").addClass("active");

    openTaffyDB();

    historial = [];

    db().each(function (record, recordnumber) {
        var db_1reg = {
            fecha:  record.fecha,
            unidad: record.unidad,
            distancia: record.distancia,
            hhmmss: record.hhmmss,
			horas: record.tiempo.horas,
			minutos: record.tiempo.minutos,
			segundos: record.tiempo.segundos,
			tot_tiempo_min: record.tot_tiempo_min,
			ritmo_km_dec: record.ritmo_km_dec,
			ritmo_km: record.ritmo_km,
            ritmo_mi: record.ritmo_mi,
            ritmo_pista: record.ritmo_pista,
            nombre_evento: record.nombre_evento,
            id: record["___id"]
        };
		
		
		//---------------------------------------------------------------------------
		
		// Compatibilidad con versiones anteriores para poder procesar los registros antiguos en la nueva versión
		
		if ((db_1reg.ritmo_km_dec == null) || (db_1reg.ritmo_km_dec === undefined)) {
			if ((db_1reg.nombre_evento == null) || (db_1reg.nombre_evento === undefined)){
				db_1reg.nombre_evento = db({___id:db_1reg.id}).first().evento;
				db({___id:db_1reg.id}).update({nombre_evento: db_1reg.nombre_evento});
			}
			if ((db_1reg.unidad == null) || (db_1reg.unidad === undefined)){
				db_1reg.unidad = db({___id:db_1reg.id}).first().medida;
				if (db_1reg.unidad == "mt") {
					db_1reg.unidad = "m";
				}
				db({___id:db_1reg.id}).update({unidad: db_1reg.unidad});
			}
			
			if ((db_1reg.tot_tiempo_min == null) || (db_1reg.tot_tiempo_min === undefined)){
				db_1reg.tot_tiempo_min = parseFloat(db({___id:db_1reg.id}).first().tiempo);
				db_1reg.tot_tiempo_min = parseFloat((db_1reg.tot_tiempo_min).toFixed(5));
				db({___id:db_1reg.id}).update({tot_tiempo_min: db_1reg.tot_tiempo_min});
			}
			if ((db_1reg.ritmo_km_dec == null) || (db_1reg.ritmo_km_dec === undefined)){
				db_1reg.ritmo_km_dec = parseFloat(db({___id:db_1reg.id}).first().ritmo);
				db_1reg.ritmo_km_dec = parseFloat((db_1reg.ritmo_km_dec).toFixed(5));
				db({___id:db_1reg.id}).update({ritmo_km_dec: db_1reg.ritmo_km_dec});
			}
			
			var horas = 0, minutos = 0, segundos = 0.0;
			if (db_1reg.hhmmss != "") {
				var hh_mm_ss = separar_hhmmss(db_1reg.hhmmss);
				horas = hh_mm_ss[0];
				minutos = hh_mm_ss[1];
				segundos = hh_mm_ss[2];
				db({___id:db_1reg.id}).update({tiempo:{horas: horas, minutos: minutos, segundos: segundos}});
				
				db({___id:db_1reg.id}).update({hhmmss: obtener2digitosMenoresDe10(horas) + ":" + obtener2digitosMenoresDe10(minutos) + ":" + obtener2digitosMenoresDe10(segundos)});
			}
			
			db({___id:db_1reg.id}).update({ritmo_pista100m: null});
		}
		//----------------------------------------------------------------------------
		
        historial.push(db_1reg);
    });
	
    origen = $('#plantilla_tabla_registros').html();
    plantilla = Handlebars.compile(origen);
    histo = { elementos: historial };
    $('#historial').html(plantilla(histo));

    origen = $('#plantilla_btn_remover_bd').html();
    plantilla = Handlebars.compile(origen);
    $('#btn_remover_bd').html(plantilla(array_btn_remover_bd));
	
}

function removeTaffyDB() {
    

    jConfirm("Si continua todos los registros guardados en el dispositivo se borraran. \n¿Esta de acuerdo en proseguir con la eliminación de la base de datos?", "Advertencia!!!", function (r) {
        if (r) {
            localStorage.removeItem('taffy_db');
            db = null;
            verDB();
        } else {
            //jAlert("Se ha 'cancelado' la operación y conservado todos los registros.", "Operación Cancelada");
            verDB();
        }
    });
}

function guardarEvento() {
    

    jConfirm("Si continua todos los registros guardados en el dispositivo se borraran. \n¿Esta de acuerdo en proseguir con la eliminación de la base de datos?", "Advertencia!!!", function (r) {
        if (r) {
            //accion guardar
            verDB();
        } else {
            jAlert("Se ha 'cancelado' la operación, datos NO guardados.", "Operación Cancelada");
            verDB();
        }
    });
}

function insertar(param_fecha, param_medida, param_distancia, param_hhmmss, param_tiempo, param_ritmo, param_ritmo_km, param_ritmo_mi, param_ritmo_pista, result_ritmo_pista100, param_evento) {
	
	var horas, minutos, segundos;
	if (param_hhmmss != "") {
		var hh_mm_ss = separar_hhmmss(param_hhmmss);
		horas = hh_mm_ss[0];
		minutos = hh_mm_ss[1];
		segundos = hh_mm_ss[2];
	} else {
		horas = horas_input;
		minutos = minutos_input;
		segundos = segundos_input;
	}
		
    openTaffyDB();
    db.insert({fecha: param_fecha, unidad: param_medida, distancia: param_distancia, hhmmss: param_hhmmss, tiempo:{horas: horas, minutos: minutos, segundos: segundos}, tot_tiempo_min: param_tiempo, ritmo_km_dec: param_ritmo, ritmo_km: param_ritmo_km, ritmo_mi: param_ritmo_mi, ritmo_pista: param_ritmo_pista, ritmo_pista100m: result_ritmo_pista100, nombre_evento: param_evento });
}

function guardar1() {
	$('div#guardar_evento').dialog('open');
}
function guardar() {
    var origen, plantilla, error, array_botones;
    fecha = $("#fecha").val();
    evento = $("#evento").val();
	
    if (fecha !== "") {
        if ((distancia_input > 0) && (condicion_error === false)) {
			tiempo_min = parseFloat(tiempo_min);
			result_ritmo_min_double = parseFloat(result_ritmo_min_double);
            insertar(fecha, unidad_medida_input, distancia_input, hrs_min_seg_input, tiempo_min, result_ritmo_min_double, result_ritmo_x_km, result_ritmo_x_milla, result_ritmo_pista, result_ritmo_pista100, evento);
            inicializar1();
            inicializar2();
			
            $('#save_ok').show();
            $("#save_ok").fadeTo(4000, 500).slideUp(500, function () {
                $('#save_ok').hide();
            });
            $('html,body').animate({
                scrollTop: $("#save_ok").offset().top
            }, 500);
			
            origen = $('#plantilla_btn_resultados').html();
            plantilla = Handlebars.compile(origen);
            $("#tabla_resultados").addClass("tb");
			
            $('#btn_resultados').html(plantilla(array_btn_mas_resultados));
			
            array_botones = {
                etiqueta_guardar: "Ver Registro",
                funcion_guardar : "verDB();",
                icono_guardar: "./img/32/1417013300_list-alt-32.png",
                btn_guardar: "btn-info",
                etiqueta_limpiar: "Nuevo",
                funcion_limpiar : "Limpiar();",
                icono_limpiar: "./img/32/1420175486_edit-32.png",
                btn_limpiar: "btn-warning"
            };
			
            origen = $('#plantilla_btn_guardar_limpiar').html();
            plantilla = Handlebars.compile(origen);
            $('#btn_guardar_limpiar').html(plantilla(array_botones));
        } else {
            $('#save_error').show();
            $("#save_error").fadeTo(2000, 500).slideUp(500, function () {
                $("#alert-danger").alert('close');
            });
            $('html,body').animate({
                scrollTop: $("#save_error").offset().top
            }, 500);
            //jAlert('Los datos NO fueron almacenados.', 'Error');
        }
    } else {
        origen = $('#plantilla_error').html();
        plantilla = Handlebars.compile(origen);
        error = {
            msj_error : "La fecha ingresada NO es valido",
            info_extra : info_extra2
        };
        $('#error').html(plantilla(error));

        $('#error').show();
        $("#error").fadeTo(7500, 500).slideUp(500, function () {
            $("#alert-danger").alert('close');
        });
        $('html,body').animate({
            scrollTop: $("#error").offset().top
        }, 500);
    }
	$("div#guardar_evento").dialog('close');
}

function reg(oID) {
	
	console.debug("id: " + oID);
	Limpiar();
	
	var fecha, nombre_evento, unidad, distancia, hrs, min, sec, tot_tiempo_min, ritmo_km_dec, ritmo_km, ritmo_mi, ritmo_pista, ritmo_pista100m;
	
	if (del_reg == false) {
		fecha = db({___id:oID}).first().fecha;
		nombre_evento = db({___id:oID}).first().nombre_evento;
		unidad = db({___id:oID}).first().unidad;
		distancia = db({___id:oID}).first().distancia;
		hrs = db({___id:oID}).first().tiempo.horas;
		min = db({___id:oID}).first().tiempo.minutos;
		sec = db({___id:oID}).first().tiempo.segundos;
		
		$('#fecha').val(fecha);
		$('#evento').val(nombre_evento);
		$('#unidad').val(unidad);
		$('#distancia').val(distancia);
		$('#hrs').val(hrs);
		$('#min').val(min);
		$('#sec').val(sec);
		
		home();
		calcular();
	}
	del_reg = false;
}

$('.alert .close').on('click', function (e) {
    
    $(this).parent().hide();
});


function acercaDe() {
    
    $("#espacio").hide();

    $("#registros").hide();
    $("#entrada_de_datos").hide();
    $("#resultados").hide();

    $("#acerca").show();
    

    $("#nav-menu").removeClass("active");
    $("#nav-ver").removeClass("active");
    $("#nav-acerca").addClass("active");
}
function home() {
    
    $("#espacio").show();
    $("#registros").hide();
    $("#entrada_de_datos").show();
    $("#resultados").show();
    $("#tabla_resultados").show();

    $("#acerca").hide();

    $("#nav-acerca").removeClass("active");
    $("#nav-ver").removeClass("active");
    $("#nav-menu").addClass("active");
}

function removerRegistro(param_id) {
    console.log("remove(param_id: " + param_id + ")");
    db({___id:param_id}).remove();
	del_reg = true;
    verDB();
}

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

function abrirBD() {
    var data, dataObj;
    
    // Si la base de datos NO se ha instanciado ni utilizado...
    if (db === null) {
        // Si se encuentra localmente alamacenada la base de datos...
        if (localStorage.getItem('db')) {
            // Obtenemos la base de datos
            data = localStorage.db;
            // Convertimos los datos a JSON
            dataObj = JSON.parse(data);

            // Instanciamos la base de datos con la data recuperada.
            db = TAFFY(dataObj);
        } else { // Sino se encuentra la base de datos, se procede a crear uno nuevo,
            // Instanciamos una base de datos vacia.
            db = TAFFY();
        }
    }
}

function guardarBD() {
    var recordSet, dataStr;
    
    // Alamaceno todo el contenido de la base de datos en una variable
    recordSet = db().get();
    // Convierto el arreglo tipo JSON llamada 'recordSet' a tipo de dato String.
    dataStr = JSON.stringify(recordSet);
    // Almaceno el string con toda la base de datos utilizando localStorage.
    localStorage.setItem('db', dataStr);
}

function eliminarBD() {
    
    // Elimino la base de datos almacenado localmente
    localStorage.removeItem('db');
    //localStorage.clear();
}




// on window resize run function
$(window).resize(function () {
	$("div#guardar_evento").dialog( "option", "position", { my: "center", at: "center", of: window } );
});


$('#distancia').focus();

