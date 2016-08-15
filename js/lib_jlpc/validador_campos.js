"use strict";
    // Validación de campos

    function validar_campos() {

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
    }