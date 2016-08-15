//Ajusta el tamaño de un iframe al de su contenido interior para evitar scroll
function autofitIframe(id){
	/*
	var alto = id.contentDocument.body.scrollHeight;
	var alto1 = id.contentDocument.body.offsetHeight;
	var alto2 = id.contentDocument.body.clientHeight;
	
	var altura;
	
	if (!window.opera && document.all && document.getElementById){
		id.style.height=id.contentWindow.document.body.scrollHeight;
	} else if(document.getElementById) {
		var height = (alto+alto1+alto2)/3;
		if ((height<alto)||(height<alto1)||(height<alto2)) {
			height = (alto+alto1+alto2)/2.3;
		}
		if ((height>0) && (height<400)) {
			height=height+50;
			id.style.height=height+"px";
		} else {
			id.style.height=height+"px";
		}
	}
	*/

	/*
	altura = $(window).height()-220;
	id.style.height=altura+"px";
	*/

	//var viewportHeight = $("body").innerHeight() - 200;
	var viewportHeight = $("#content").innerHeight();

	//alert(viewportHeight);

	id.style.height = viewportHeight + "px";


}
