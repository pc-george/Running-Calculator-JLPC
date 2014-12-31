
/* 
Autor: Jorge Luis Pérez Canto
Fecha: 29/12/2014
Copyright © 2015. Todos los derechos reservados.
*/

$( document ).ready(function() {
    //console.log( "ready!" );
    $("#registros").hide();
    $("#acerca").hide();

    $('#fecha').val(new Date().toDateInputValue());

    $("input").off("change");
    $("select").off("change");

    //Cambio de tamaño de la ventana
    var id;
    $(window).resize(
        function() {
            clearTimeout(id);
            id = setTimeout(AlturaMenu, 500);
        }
    );
    AlturaMenu();
});

if ("ontouchstart" in document.documentElement)
{
  // Es un dispositivo táctil.
}
else
{
  // No es un dispositivo táctil.
}

window.addEventListener("orientationchange", function() {
    // Hacer algo cuando cambia la orientación
    //alert(window.orientation);
    AlturaMenu();
}, false);

function AlturaMenu() {
    var maxHeight = 0;
    var heights = $(".altoSpan").map(function() {
        return $(this).height();
    }).get(), maxHeight = Math.max.apply(null, heights);
    $(".alto100").height(maxHeight);

    var maxHeight = 0;
    var heights = $(".alto100").map(function() {
        return $(this).height();
    }).get(), maxHeight = Math.max.apply(null, heights);

    $(".alto100").height(maxHeight);
    console.log("AlturaMenu() " + heights + " / " + maxHeight);
}

window.onload = function ()
{
    // Validación de campos
    var fecha_lv = new LiveValidation('fecha');
    fecha_lv.add(Validate.Presence);

    var distancia_lv = new LiveValidation('distancia');
    distancia_lv.add(Validate.Presence);
    distancia_lv.add(Validate.Numericality, {minimum:0});
    var hrs_lv = new LiveValidation('hrs');
    hrs_lv.add(Validate.Numericality,{minimum:0, onlyInteger:true});
    var min_lv = new LiveValidation('min');
    min_lv.add(Validate.Numericality,{minimum:0, maximum:59, onlyInteger:true});
    var sec_lv = new LiveValidation('sec');
    sec_lv.add(Validate.Numericality,{minimum:0, maximum:59});
}


Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});


var db = null;

// Valores constantes
var razon_1km_mi = 0.62137 //mi
var razon_1km_mts = 1000; //mts


// Declaración de variables

var registros_p1;
var registros_p2;
var resultados_p1;
var resultados_p2;

var fecha;
var unidad_medida_input;
var distancia_input;
var distancia_km;
var distancia_mt;
var distancia_mi;
var horas_input;
var minutos_input;
var segundos_input;
var tiempo_min;
var hrs_min_seg_input;

var resultKm;
var result_ritmo_x_km;
var result_kph;
var result_mps;
var result_ritmo_pista;
var result_ritmo_min_double;
var resultMi;
var result_ritmo_x_milla;
var result_mph;

var condicion_error;

// Botones para mostras más o menos detalles de los resultados.
var array_btn_mas_resultados = {
    titulo : 'Ver m&aacute;s resultados en otras unidades',
    funcion : 'resultP2MasDetallado()'
}
var array_btn_menos_resultados = {
    titulo : 'Menos detalles...',
    funcion : 'resultP1MenosDetallado()'
}

var array_btn_remover_bd = {
    titulo : 'Remover BD',
    funcion : 'RemoveTaffyDB()'
}

var info_extra1 = "Verifique los datos ingresados, <br>especialmente que la unidad de medida sea la correcta.";
var info_extra2 = "Verifique que todos los campos esten llenos.";

function Inicializar1() {
    // Inicialización de variables
    fecha = new String("");
    unidad_medida_input = new String("");
    distancia_input = 0;
    distancia_km = 0;
    distancia_mt = 0;
    distancia_mi = 0;
    horas_input = 0;
    minutos_input = 0;
    segundos_input = 0;
    tiempo_min = 0;
    hrs_min_seg_input = new String("");
}

function Inicializar2() {
    resultKm = [];
    result_ritmo_x_km = new String("");
    result_kph = 0;
    result_mps = 0;
    result_ritmo_pista = new String("");
    result_ritmo_min_double = 0.0;
    resultMi = [];
    result_ritmo_x_milla = new String("");
    result_mph = 0;
}

function Inicializar3() {
    condicion_error = true;
    registros_p1 = new Array();
    registros_p2 = new Array();
    resultados_p1 = {};
    resultados_p2 = {};
}
function ocultar(bloq) {
    obj = document.getElementById(bloq);
    obj.style.display = 'none';
}

function mostrar(bloq) {
    obj = document.getElementById(bloq);
    obj.style.display = 'block';
    obj.style.visibility = "visible"
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

// Evento onload
window.addEventListener("load", function() {
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
window.addEventListener("online", function() {
    // Evento que se activa cuando detecta que estamos online
    saveStatusLocally(true);
    sendLocalStatus();
}, true);

// Evento offline
window.addEventListener("offline", function() {
    // Evento que detecta cuando perdemos la conexión
    alert("You're now offline. If you update your status, it will be sent when you go back online");
    saveStatusLocally(false);
}, true);


/*-------------------------------------------------------------------------------------------------------*/

// Función que retorna el numero 'Cero' en caso de que NO se reciba un valor numerico.
function getNum(val) {
    if (isNaN(val)) 
        return 0;
    else
        return val;
}

function maxLengthCheck(object) {
    if (object.value.length > object.maxLength)
        object.value = object.value.slice(0, object.maxLength)
}

function nada_que_hacer(str) {
    if (!window.console) {
        var log = window.opera ? window.opera.postError : alert;
        window.console = { log: function(str) { 
            log(str) 
        } };
        var debug = window.opera ? window.opera.postError : alert;
        window.console = { debug: function(str) { 
            debug(str) 
        } };
        var error = window.opera ? window.opera.postError : alert;
        window.console = { error: function(str) { 
            error(str) 
        } };        
    }
}

function truncar_decimales(n) {
    return Math[n > 0 ? "floor" : "ceil"](n);
}

function obtener2digitosMenoresDe10(param_numero) {
    var numero_str = "";
    if (param_numero < 10) {
        numero_str = "0" + param_numero;
    } else {
        numero_str = param_numero;
    }
    return numero_str;
}
function separarNumeroEnteroDecimal(param_numero) {
    var numero = parseFloat(param_numero);

    // Truncamos y obtenemos solo la parte Entera del número
    var parte_entera = parseInt(truncar_decimales(numero));

    // Obtenemos solo la parte deciamal, con una precisión de 2 dígitos
    var parte_decimal = parseFloat( (numero - parte_entera).toFixed(2) );
    
    // Si los decimales son Ceros retornamos solo la parte Entera.
    var result_numero = 0;
    if (parte_decimal == 0) {
        result_numero = parseInt(parte_entera);
    } else {
        result_numero = numero;
    }
    
    return [result_numero, parte_entera, parte_decimal];
}
// Función que convierte el tiempo recibido en 'minutos decimales' a 'horas, minutos y segundos'.
function decimal_a_hhmmss(param_ritmo_double) {
    
    var horas = 0;
    var minutos = parseFloat(param_ritmo_double);
    var segundos = 0;

    var tiempo;
    var str_segundos;
    var seg_decimal;

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
    segundos = Math.round(seg_decimal * 60);
    str_segundos = obtener2digitosMenoresDe10(segundos);

    return [horas, minutos, str_segundos];
}

// #2_rp2
function resultP2MasDetallado() {
    
    //Mostramos los resultados de la parte 2
    $('#resultados_p2').show();

    // Se agrega 'link' para llamar a función que 
    // muestra menos detalles de los resultados.
    var origen = $('#plantilla_btn_resultados').html();
    var plantilla = Handlebars.compile( origen );
    $('#btn_resultados').html( plantilla(array_btn_menos_resultados) );

    //Se mueve cursor hasta los botones de guardar y limpiar.
    $('html,body').animate({
        scrollTop: $("#btn_guardar_limpiar").offset().top
    }, 1000);
}

// #3_rp1
function resultP1MenosDetallado() {
    
    // Ocultamos los resultados de la parte 2, para dejar solo la parte 1
    $('#resultados_p2').hide();

    // Link para ver mas resultados.
    var origen = $('#plantilla_btn_resultados').html();
    var plantilla = Handlebars.compile( origen );
    $('#btn_resultados').html( plantilla(array_btn_mas_resultados) );

    $('html,body').animate({
        scrollTop: $("#btn_guardar_limpiar").offset().top
    }, 1000);
}

//#1
function mostrarResultados(unidad, ritmo_km, kph, mps, ritmo_mi, mph, pista, ritmo_double) {
    
    // Si los decimales son ceros obtenemos y mostramos solo la parte Entera.    
    var tmp_mps = separarNumeroEnteroDecimal(mps);
    mps = tmp_mps[0];
    var tmp_kph = separarNumeroEnteroDecimal(kph);
    kph = tmp_kph[0];
    var tmp_mph = separarNumeroEnteroDecimal(mph);
    mph = tmp_mph[0];

    registros_p1 = new Array();
    registros_p2 = new Array();

    // Preparamos los resultados para mostrarlos posteriormente en etiquetas html

    var array_ritmo_mi = {nombre: 'ritmo_x_mi', etiqueta: 'Ritmo (paso) por Milla',
    velocidad: ritmo_mi, unidades_de_medida: 'minutos/millas'};

    var array_ritmo_km = {nombre: 'ritmo_x_km', etiqueta: 'Ritmo (paso) por Km.', 
    velocidad: ritmo_km, unidades_de_medida: 'minutos/kil&oacute;metros'};

    var array_mph = {nombre: 'mph', etiqueta: 'Velocidad en mph', 
    velocidad: mph, unidades_de_medida: 'millas/hora'};
    
    var array_kph = {nombre: 'kph', etiqueta: 'Velocidad en kph', 
    velocidad: kph, unidades_de_medida: 'kil&oacute;metros/hora'};
    
    var array_mps = {nombre: 'mps', etiqueta: 'Velocidad en mps', 
    velocidad: mps, unidades_de_medida: 'metros/segundos'};

    var array_pista = {nombre: 'pista', etiqueta: 'Ritmo (paso) en Pista Atlética', 
    velocidad: pista, unidades_de_medida: 'minutos/vuelta'};

    // Establecemos rango de valores validos.
    var ritmo_minimo = 0.1;
    var kph_minimo = 3; //2.5
    var limite_humano_kph = 50;

    //console.debug("\nritmo_double: '" + ritmo_double + "'   Condición > " + ritmo_minimo);
    //console.debug("kph: '" + kph + "'   Condición: >= " + kph_minimo + " && <= " + limite_humano_kph);

    condicion_error = true;
    var error;

    // Si el ritmo y la velocidad estan dentro de los rangos establecidos...
    if ( (ritmo_double > ritmo_minimo) && (kph >= kph_minimo)  ) {
        if (kph <= limite_humano_kph) {

            // Dependiendo de la unidad de medida se ordenan los resultados.

            if ( unidad.localeCompare("km") == 0) {
                registros_p1.push(array_ritmo_km);
                registros_p1.push(array_kph);
                registros_p1.push(array_pista);
                registros_p2.push(array_mps);
                registros_p2.push(array_ritmo_mi);
                registros_p2.push(array_mph);
            } 
            else if ((unidad.localeCompare("mi")) == 0) {
                registros_p1.push(array_ritmo_mi);
                registros_p1.push(array_mph);
                registros_p1.push(array_pista);
                registros_p2.push(array_ritmo_km);
                registros_p2.push(array_kph);
                registros_p2.push(array_mps);
            }
            else if ((unidad.localeCompare("mt")) == 0) {
                registros_p1.push(array_pista);
                registros_p1.push(array_mps);
                registros_p1.push(array_ritmo_km);
                registros_p2.push(array_kph);
                registros_p2.push(array_mph);
                registros_p2.push(array_ritmo_mi);
            } 
            else {
                console.error("else: error en unidad: " + unidad);
            }

            var origen = $('#plantilla_btn_resultados').html();
            var plantilla = Handlebars.compile( origen );
            $("#tabla_resultados").addClass("tb");

            $('#btn_resultados').html( plantilla(array_btn_mas_resultados) );

            var array_botones = {
                funcion_guardar : "Guardar();",
                funcion_limpiar : "Limpiar();"
            }

            var origen = $('#plantilla_btn_guardar_limpiar').html();
            var plantilla = Handlebars.compile( origen );
            $('#btn_guardar_limpiar').html( plantilla(array_botones) );

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
    if (condicion_error == true) {
        var origen = $('#plantilla_error').html();
        var plantilla = Handlebars.compile( origen );

        $('#error').html( plantilla(error) );

        $('#error').show();
        $("#error").fadeTo(7500, 500).slideUp(500, function(){
            $("#alert-danger").alert('close');
        });
        $('html,body').animate({
            scrollTop: $("#error").offset().top
        }, 1000);

        //jAlert(error.msj_error, 'Error');
        
    } else {
        $("#resultados").show();
        $("#tabla_resultados").show();
    
        $('html,body').animate({
            scrollTop: $("#btn_guardar_limpiar").offset().top
        }, 1000);

        // Mostramos los resultados principales
        var source   = $("#plantilla-resultados").html();
        var plantilla = Handlebars.compile(source);

        resultados_p1 = { elementos: registros_p1 };
        resultados_p2 = { elementos: registros_p2 };

        $('#resultados_p1').html( plantilla( resultados_p1 ) );
        $('#resultados_p2').html( plantilla( resultados_p2 ) );

        $("#tabla_resultados").addClass("tb");

        //Habilitados boton para guardar
        $("#btn_guardar").attr("disabled", false);
    }

    $('#resultados_p1').show();
    $('#resultados_p2').hide();
    
}

function getRitmo(param_unidad_medida, param_distancia, param_tiempo_min) {
    
    // Declaración en inicialización de variables
    var ritmo_min_double = 0.0; //double
    var ritmo_horas = 0; // int
    var ritmo_minutos = 0; //int
    var ritmo_str_segundos = new String(""); //String Ej: '05'
    var ritmo_x_unidad = new String(""); //String min'seg"

    var str_ritmoPista = new String(""); //String min:seg
    var velocidad_unidad_x_hora = 0.0 //double
    var velocidad_unidad_x_hora_sin_ceros; // int/double
    var velocidad_metros_x_segundos = 0.0 //double
    var ritmo_hhmmss = []; // array

    // Calculo del 'Ritmo' en minutos en base a la formula: tiempo/distancia
    ritmo_min_double = (param_tiempo_min/param_distancia).toFixed(5); //para mayor exactitud no redondear.
    //console.debug("Ritmo_min_double (minutos/distancia): " + ritmo_min_double);
    
    // Conversión del Ritmo en 'minutos' a hh:minutos:segundos
    ritmo_hhmmss = decimal_a_hhmmss(ritmo_min_double);
    //console.debug("Ritmo hh,mm,ss: "+ritmo_hhmmss);
    ritmo_horas = ritmo_hhmmss[0];
    ritmo_minutos = ritmo_hhmmss[1];
    ritmo_str_segundos = ritmo_hhmmss[2];
    
    // Concatenación de las partes del ritmo (hh:mm':seg'')
    if (ritmo_horas > 0) {
        ritmo_x_unidad = ritmo_horas + " : "+ ritmo_minutos + "\' : " + ritmo_str_segundos + "\'\'";
        //ritmo_x_unidad = ritmo_horas + ":"+ ritmo_minutos + ":" + ritmo_str_segundos;
    } else {
        ritmo_x_unidad = ritmo_minutos + "\' : " + ritmo_str_segundos + "\'\'";
        //ritmo_x_unidad = ritmo_minutos + ":" + ritmo_str_segundos;
    }

    // Calculo de la Velocidad en la 'unidad de medida' por Horas, Ej: Kms/hrs (kph) ó  Mi/hrs (mph).
    velocidad_unidad_x_hora = ( (param_distancia * 60) / param_tiempo_min ).toFixed(2);
    
    // Calcular ritmo en 'pista atketica' y velocidad en metros por segundos si la unidad de medida es 'KM'
    if ((param_unidad_medida.toLowerCase().localeCompare("km")) == 0) {
        
        // Calculo de velocidad en metros por segundos
        velocidad_metros_x_segundos = ((velocidad_unidad_x_hora * 1000) / 3600).toFixed(2);

        // Calculo de ritmo en circuito de pista atletica
        var ritmo_pista_double = ((ritmo_min_double * 400) / 1000).toFixed(2);
        
        // Conversion de ritmo decimal a hh:minutos:segundos
        var ritmoPista  = decimal_a_hhmmss(ritmo_pista_double);
        if (ritmoPista[0] > 0) { // Si horas mayor a cero...
            str_ritmoPista = ritmoPista[0] + " : " + ritmoPista[1] + "\' : " + ritmoPista[2] + "\'\'";
            //str_ritmoPista = ritmoPista[0] + ":" + ritmoPista[1] + ":" + ritmoPista[2];
        } else { // Si no hay horas, solo minutos y segundos...
            str_ritmoPista = ritmoPista[1] + "\' : " + ritmoPista[2] + "\'\'";    
            //str_ritmoPista = ritmoPista[1] + ":" + ritmoPista[2];    
        }
    }

    return [ritmo_x_unidad, velocidad_unidad_x_hora, velocidad_metros_x_segundos, str_ritmoPista, ritmo_min_double];
}

function Calcular() {

    //Limpiamos resultados anteriores.
    LimpiarResultados();

    // Inicialización de variables
    Inicializar1();

    // Obtención y almacenamiento de la 'distancia' ingresada
    distancia_input = parseFloat($("#distancia").val());
    
    // Si el valor de la distancia fue ingresado, continuamos...
    if(distancia_input > 0) {

        // Obtenemos y almacenamos los valores ingresados
        fecha = $("#fecha").val();
        unidad_medida_input = $("#unidad").val().toLowerCase();
        horas_input = getNum( parseFloat($("#hrs").val()) );
        minutos_input = getNum( parseFloat($("#min").val()) );
        segundos_input = getNum( parseFloat($("#sec").val()) );
        
        hrs_min_seg_input = horas_input + ":" + minutos_input + ":" + segundos_input;
        //hrs_min_seg_input = horas_input + " : " + minutos_input + " : " + segundos_input;

        // Conversión del tiempo ingresado a 'minutos'
        tiempo_min = (horas_input * 60) + (minutos_input) + (segundos_input / 60);
        //console.debug("Horas: " + (horas_input * 60) + " (min).   Minutos: " + minutos_input + "   Segundos: " + (segundos_input / 60).toFixed(2) + " (min).");
        //console.debug("Tiempo en minutos: "+tiempo_min);
        
        if (fecha != "") {
            if (tiempo_min > 0) {

                if ((unidad_medida_input.localeCompare("km")) == 0) { // Returns 0 if the two strings are equal
                    distancia_km = distancia_input;
                    distancia_mt = distancia_km * razon_1km_mts;
                    distancia_mi = distancia_km * razon_1km_mi;
                } else if ((unidad_medida_input.localeCompare("mi")) == 0) {
                    distancia_mi = distancia_input;
                    distancia_km = distancia_mi / razon_1km_mi;
                    distancia_mt = distancia_km * razon_1km_mts;
                } else if ((unidad_medida_input.localeCompare("mt")) == 0) {
                    distancia_mt = distancia_input;
                    distancia_km = distancia_mt / razon_1km_mts;
                    distancia_mi = distancia_km * razon_1km_mi;
                } else {
                    console.error("else: error en unidad_medida: "+unidad_medida_input);
                }
                
                //Redondear distancia
                var precision = 5; //Para mayor exactitud, aumentar el numero precision.
                distancia_mi = distancia_mi.toFixed(precision); 
                distancia_km = distancia_km.toFixed(precision);
                distancia_mt = distancia_mt.toFixed(precision);
                
                // Inicialización de variables
                Inicializar2();

                // Calcular ritmo
                resultKm = getRitmo("Km", distancia_km, tiempo_min);
                result_ritmo_x_km = resultKm[0];
                result_kph = resultKm[1];
                result_mps = resultKm[2];
                result_ritmo_pista = resultKm[3];
                result_ritmo_min_double = resultKm[4];
                
                resultMi = getRitmo("Mi", distancia_mi, tiempo_min);
                result_ritmo_x_milla = resultMi[0];
                result_mph = resultMi[1];

                mostrarResultados(unidad_medida_input, result_ritmo_x_km, result_kph, result_mps, result_ritmo_x_milla, result_mph, result_ritmo_pista, result_ritmo_min_double);

                $("input").change(function() {
                    LimpiarResultados();
                });
                $("select").change(function() {
                    LimpiarResultados();
                });

            } else {//fin tiempo min
                
                var origen = $('#plantilla_error').html();
                var plantilla = Handlebars.compile( origen );
                var error;
                error = {
                    msj_error : "El tiempo ingresado NO es valido",
                    info_extra : info_extra2
                };
                $('#error').html(plantilla(error));

                $('#error').show();
                $("#error").fadeTo(7500, 500).slideUp(500, function(){
                    $("#alert-danger").alert('close');
                });
                $('html,body').animate({
                    scrollTop: $("#error").offset().top
                }, 1000);
                //jAlert(error.msj_error, 'Error');
            } 
        } else {
            var origen = $('#plantilla_error').html();
            var plantilla = Handlebars.compile( origen );
            var error;
            error = {
                msj_error : "La fecha ingresada NO es valido",
                info_extra : info_extra2
            };
            $('#error').html(plantilla(error));

            $('#error').show();
            $("#error").fadeTo(7500, 500).slideUp(500, function(){
                $("#alert-danger").alert('close');
            });
            $('html,body').animate({
                scrollTop: $("#error").offset().top
            }, 1000);
            //jAlert(error.msj_error, 'Error');
        }
    } //fin distancia
    else {
        var origen = $('#plantilla_error').html();
        var plantilla = Handlebars.compile( origen );
        var error;
        error = {
            msj_error : "La distancia ingresada NO es valida",
            info_extra : info_extra2
        };
        $('#error').html(plantilla(error));

        $('#error').show();
        $("#error").fadeTo(7500, 500).slideUp(500, function(){
            $("#alert-danger").alert('close');
        });
        $('html,body').animate({
            scrollTop: $("#error").offset().top
        }, 1000);
        //jAlert(error.msj_error, 'Error');
    }
}

function Guardar() {
    if ( (distancia_input > 0) && (condicion_error == false) ) {
        Insertar(fecha, unidad_medida_input, distancia_input, hrs_min_seg_input, tiempo_min, result_ritmo_min_double, result_ritmo_x_km, result_ritmo_x_milla, result_ritmo_pista);
        Inicializar1();
        Inicializar2();

        $('#save_ok').show();
        $("#save_ok").fadeTo(4000, 500).slideUp(500, function(){
            $('#save_ok').hide();
        });
        $('html,body').animate({
            scrollTop: $("#save_ok").offset().top
        }, 1000);
        jAlert('Datos almacenados exitosamente.', 'Operación Exitosa');

    } else {
        $('#save_error').show();
        $("#save_error").fadeTo(2000, 500).slideUp(500, function(){
            $("#alert-danger").alert('close');
        });
        $('html,body').animate({
            scrollTop: $("#save_error").offset().top
        }, 1000);
        jAlert('Los datos NO fueron almacenados.', 'Error');
    }
}

$('.alert .close').on('click', function(e) {
    $(this).parent().hide();
});

function Insertar(param_fecha, param_medida, param_distancia, param_hhmmss, param_tiempo, param_ritmo, param_ritmo_km, param_ritmo_mi, param_ritmo_pista) {
    //AbrirBD();
    
    OpenTaffyDB();
    db.insert({fecha:param_fecha, medida:param_medida, distancia:param_distancia, hhmmss:param_hhmmss, tiempo:param_tiempo, ritmo:param_ritmo, ritmo_km:param_ritmo_km, ritmo_mi:param_ritmo_mi, ritmo_pista:param_ritmo_pista });
    
    //GuardarBD();
}

function OpenTaffyDB() {
    // Si la base de datos NO se ha instanciado ni utilizado...
    if (db == null) {
        // Instanciamos una base de datos.
        db = TAFFY();
        // Almacenamos la base de datos con taffy_localStorage
        db.store("db"); // db -> taffy_db
        
        //console.debug("db instanciada.");
    }
}
function RemoveTaffyDB() {

    jConfirm("Todos los registros guardados en el dispositivo se borraran. \n¿Estas seguro que deseas continuar con la eliminacion de la base de datos?", "Advertencia!!!", function(r) {  
        if(r) {
            localStorage.removeItem('taffy_db');
            db = null;
            VerDB();
            jAlert("Se ha 'eliminado' la Base de datos y con ella todos los registros guardados anteriormente", "Operación exitosa");
        } else {
            jAlert("Se ha 'cancelado' la operación de eliminación y conservado todos los registros.", "Operación Cancelada");
            VerDB();
        }
    });
}


function AcercaDe() {
    $("#espacio").hide();

    $("#registros").hide();
    $("#entrada_de_datos").hide();
    $("#resultados").hide();

    $("#acerca").show();
    

    $("#nav-menu").removeClass("active");
    $("#nav-ver").removeClass("active");
    $("#nav-acerca").addClass("active");
}
function Home() {
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

function RemoverRegistro(param_id) {
    
    db({___id:param_id}).remove();
    VerDB();
}

function VerDB() {

    $("#espacio").hide();

    $("#entrada_de_datos").hide();
    $("#resultados").hide();
    $("#registros").show();

    $("#acerca").hide();
    
    $("#nav-menu").removeClass("active");
    $("#nav-acerca").removeClass("active");
    $("#nav-ver").addClass("active");

    OpenTaffyDB();

    var historial = new Array();

    db().each(function (record,recordnumber) {

        var array_historial_tmp = {
            fecha:  record["fecha"],
            medida: record["medida"],
            distancia: record["distancia"],
            hhmmss: record["hhmmss"],
            ritmo_km: record["ritmo_km"],
            ritmo_mi: record["ritmo_mi"],
            ritmo_pista: record["ritmo_pista"],
            id: record["___id"]
            
        };
        historial.push(array_historial_tmp);
    });

    var origen = $('#plantilla_tabla_registros').html();
    var plantilla = Handlebars.compile( origen );
    var histo = { elementos: historial };
    $('#historial').html( plantilla(histo) );

    var origen = $('#plantilla_btn_remover_bd').html();
    var plantilla = Handlebars.compile( origen );
    $('#btn_remover_bd').html( plantilla(array_btn_remover_bd) );
}

if('localStorage' in window && window['localStorage'] !== null) {
    //alert('Genial, tenemos un navegador decente que soporta LocalStorage');
} else { 
    alert('Como seguimos utilizando un navegador viejo, Santa Claus no nos traerá nada esta Navidad'); 
}

// Existe localStorage?
var storage;
try {
    if (localStorage.getItem) {
        storage = localStorage;
    }
} catch(e) {
    storage = {};
}

function AbrirBD() {

    // Si la base de datos NO se ha instanciado ni utilizado...
    if (db == null) {

        // Si se encuentra localmente alamacenada la base de datos...
        if (localStorage.getItem('db')) {
            // Obtenemos la base de datos
            var data = localStorage.db;
            // Convertimos los datos a JSON
            var dataObj = JSON.parse(data);

            // Instanciamos la base de datos con la data recuperada.
            db = TAFFY(dataObj);
        } 
        // Sino se encuentra la base de datos, se procede a crear uno nuevo,
        else {
            // Instanciamos una base de datos vacia.
            db = TAFFY();
        }
    } else {
        // La base de datos ya se encuentra instanciada
        // No es necesario volverlo abrir.  
    }
}
function GuardarBD() {
    // Alamaceno todo el contenido de la base de datos en una variable
    var recordSet=db().get();
    // Convierto el arreglo tipo JSON llamada 'recordSet' a tipo de dato String.
    var dataStr = JSON.stringify(recordSet);
    // Almaceno el string con toda la base de datos utilizando localStorage.
    localStorage.setItem('db',dataStr);
}

function EliminarBD() {
    // Elimino la base de datos almacenado localmente
    localStorage.removeItem('db');
    //localStorage.clear();
}

function LimpiarResultados() {
    
    $('.result').val("");

    $("#btn_guardar").attr("disabled", true);
    
    $('#resultados_p1').html("");
    $('#resultados_p2').html("");
    $('#btn_resultados').html("");

    $("#tabla_resultados").hide();
}
function Limpiar() {
    
    $('#form').each (function(){
        this.reset();
    });

    $('#fecha').val(new Date().toDateInputValue());

    $(':input[type=number]','#form')
        .not(':button, :submit, :reset')
        .val('')
        .removeAttr('checked')
        .removeAttr('selected');
    
    LimpiarResultados();

    $("#resultados").hide();

    Inicializar1();
    Inicializar2();
    Inicializar3();

    $('#fecha').focus();
    $("input").off("change");
    $("select").off("change");
}

