$(document).ready(function(){
	
	$("#home").height($(window).height());

	// To compensate for fixed header
	var offsetHeight = 86;

	// Activate Bootstrap's scrollspy
	$('body').scrollspy({ target: '.navbar', offset: offsetHeight});

	// jQuery scrollTo behaviour
	$('.nav li a').click(function (event) {
	    var scrollPos = $('body').find($(this).attr('href')).offset().top - offsetHeight + 5;
	    $('body,html').animate({
	        scrollTop: scrollPos
	    }, 500, function () {
	    	if($(window).width() < 768)
	        	$(".navbar-toggle").click();
	    });
	    return false;
	});	

	// Change header when scrolling past About Us
	$('.navbar').on('activate.bs.scrollspy', function () {
  		if( $('body,html').scrollTop() >= $('#about').offset().top - offsetHeight){
  			$(".navbar-default").css('opacity', '1');
  		}
  		else{
  			if($(window).width() > 768)
  				$(".navbar-default").css('opacity', '0.9');
  		}
	})
});
	
