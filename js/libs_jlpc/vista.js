"use strict";

var del_reg = false;


function ocultar(bloq) {
    
    var obj = document.getElementById(bloq);
    obj.style.display = 'none';
}

function mostrar(bloq) {
    
    var obj = document.getElementById(bloq);
    obj.style.display = 'block';
    obj.style.visibility = "visible";
}

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

function pr_inicio()
{
    $("#registros").hide();
    $("#acerca").hide();

    $('#fecha').val(new Date().toDateInputValue());
    
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
}

function limpiarResultados() {
    $('.result').val("");
    $("#btn_guardar").attr("disabled", true);
    $("#btn_guardar").hide();
    $('#resultados_p1').html("");
    $('#resultados_p2').html("");
    $('#btn_resultados').html("");
    $("#tabla_resultados").hide();
    $("#logo_tmp").show();
	$("#resultados").hide();
}

function Limpiar() { 
    $('#form').each(function () {
        this.reset();
    });
    $("#evento").val("");

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
    
    $("input#distancia").off("change");
    $("input#hrs").off("change");
    $("input#min").off("change");
    $("input#sec").off("change");
    
    $("select").off("change");
    $("#logo_tmp").show();
}


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


function reg(oID) {
    
    console.log("id: " + oID);
    Limpiar();
    
    var fecha, nombre_evento, unidad, distancia, hrs, min, sec;
    
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



// Declaración de variables

var registros_p1;
var registros_p2;
var resultados_p1;
var resultados_p2;

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
    
    //console.log("\nritmo_double: '" + ritmo_double + "'   Condición > " + ritmo_minimo);
    //console.log("kph: '" + kph + "'   Condición: >= " + kph_minimo + " && <= " + limite_humano_kph);

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
                console.log("else: error en unidad: " + unidad);
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
        $("#logo_tmp").hide();
        $("#tabla_resultados").show();
    
        $('html,body').animate({
            //scrollTop: $("#btn_guardar_limpiar").offset().top
//            scrollTop: $("#btn_calcular").offset().top
            scrollTop: $("#espacio").offset().top
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
        $("#btn_guardar").show();
    }

    $('#resultados_p1').show();
    $('#resultados_p2').hide();
    
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
//        scrollTop: $("#resultados_p2").offset().top
        scrollTop: $("#espacio").offset().top
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
//        scrollTop: $("#btn_calcular").offset().top
        scrollTop: $("#espacio").offset().top
    }, 300);

    // Ocultamos los resultados de la parte 2, para dejar solo la parte 1
    $('#resultados_p2').hide();
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



function guardar1() {
    $('div#guardar_evento').dialog('open');
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


// on window resize run function
$(window).resize(function () {
    $("div#guardar_evento").dialog( "option", "position", { my: "center", at: "center", of: window } );
});


$('#distancia').focus();
"use strict";

var del_reg = false;
