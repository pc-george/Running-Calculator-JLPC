var db = null;

function openTaffyDB() {
    
    // Si la base de datos NO se ha instanciado ni utilizado...
    if (db === null) {
        // Instanciamos una base de datos.
        db = TAFFY();
        // Almacenamos la base de datos con taffy_localStorage
        db.store("db"); // db -> taffy_db
        
        //console.log("db instanciada.");
    }
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

function removerRegistro(param_id) {
    console.log("remove(param_id: " + param_id + ")");
    db({___id:param_id}).remove();
	del_reg = true;
    verDB();
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
