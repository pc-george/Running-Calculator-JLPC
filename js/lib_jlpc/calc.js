"use strict";


var fecha = "", evento = "", unidad_medida_input = "", distancia_input = 0, distancia_km = 0, distancia_mt = 0, distancia_mi = 0, horas_input = 0, minutos_input = 0, segundos_input = 0.0, tiempo_min = 0, hrs_min_seg_input = "";

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


var resultKm = [], result_ritmo_x_km = "", result_kph = 0, result_mps = 0, result_ritmo_pista = "", result_ritmo_min_double = 0.0, result_ritmo_pista100 = "", resultMi = [], result_ritmo_x_milla = "", result_mph = 0;

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


var condicion_error = true, registros_p1 = [], registros_p2 = [], resultados_p1 = {}, resultados_p2 = {};

function inicializar3() {
    
    condicion_error = true;
    registros_p1 = [];
    registros_p2 = [];
    resultados_p1 = {};
    resultados_p2 = {};
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

// Valores constantes
var razon_1km_mi = 0.62137; //mi
var razon_1km_mts = 1000; //mts

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
                console.log("else: error en unidad_medida: " + unidad_medida_input);
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

