
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
