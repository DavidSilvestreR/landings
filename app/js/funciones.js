$(document).ready(function(){
	$('select').material_select();
	$('.slider').slider();

	$("#coverimg").click(function(){
  		$('#iframe').attr("src","https://www.youtube.com/embed/GqwjTlljQH0?rel=0&controls=0&showinfo=0&autoplay=1");
  		
  		setTimeout(function(){ $("#coverimg").fadeOut(); }, 1000);
  	});

	 $(function() {
	 	$("#contact").submit(function(e) {
	 		e.preventDefault();
	 	}).validate({
	 		rules: {
		        fullname: {required: true},
		        mail: {required: true},
		        phone: {required: true,minlength:8},
		        grado: {requred: true}
		    },
		    messages:{
		    	fullname: {
		    		required: "*Ingresa tu nombre"

		    	},
		        mail: {
		        	required: "*Ingresa tu correo electrónico",
		        	email: "*Ingresa un correo valido"
		        },
		        phone: {
		        	required: "*Ingresa tu teléfono",
		        	minlength: "*Ingresa un nuemro valido"
		        },
		        grado: {
		        	required: "*Ingresa tu ultimo grado de estudio"
		        }

		    },
		    errorElement:"span",
		submitHandler: function(form) {
			$.ajax({
            type: "POST",
            url: "../resources/datalead.php",
            data: $(form).serialize(),
            timeout: 3000,
            success: function(data) {
            	
            	setTimeout(function(){ window.location.href = "/gracias"; }, 1000);
            },
            error: function(data) {
            	console.log("error");
            	console.log(data);
            }
        });
			return false;
      }
  });
});
});