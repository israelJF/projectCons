$(document).ready(function() {
  // Asigna un valor adecuado a nav_height
  const nav_height = 50; // Cambia esto al valor real que necesitas
  // Inicializar el carrusel doctorSlideshow
  $('#doctorSlideshow').owlCarousel({
    nav: true,
    dots: false,
    navText: ["<span class='mai-arrow-back'></span>", "<span class='mai-arrow-forward'></span>"],
    responsive: {
      0: {
        items: 1
      },
      576: {
        items: 2
      },
      992: {
        items: 3
      }
    }
  });

  // Desplazamiento suave
  $("a[data-role='smoothscroll']").click(function(e) {
    e.preventDefault();

    const position = $($(this).attr("href")).offset().top - nav_height;

    $("body, html").animate({
        scrollTop: position
    }, 1000 );
    return false;
  });

  // Botón de regreso arriba
  const backTop = $(".back-to-top");


  $(window).scroll(function(){
    if($(document).scrollTop() > 400) {
      backTop.css('visibility', 'visible');
    }
    else if($(document).scrollTop() < 400) {
      backTop.css('visibility', 'hidden');
    }
  });

  backTop.click(function() {
    $('html').animate({
      scrollTop: 0
    }, 1000);
    return false;
  });

  // Consejos emergentes y popovers
  $('[data-toggle="tooltip"]').tooltip();
  $('[data-toggle="popover"]').popover();

  // Animación de desplazamiento de página
  new WOW().init();
});

