
// Función que retorna el numero 'Cero' en caso de que NO se reciba un valor numerico.
function getNum(val) {
    
    if (isNaN(val)) {
        return 0;
    } else {
        return val;
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