document.addEventListener("DOMContentLoaded", function () {
    let loginForm = document.getElementById("loginForm");
    let registerForm = document.getElementById("registerForm");
    let modalTitle = document.getElementById("modalTitle");
    let showRegisterForm = document.getElementById("showRegisterForm");
    let showLoginForm = document.getElementById("showLoginForm");
    let getGPSCoordinatesButton = document.getElementById("getGPSCoordinates");
    let registerPharmacyAddressInput = document.getElementById("registerPharmacyAddress");

    if (showRegisterForm && showLoginForm) {
      showRegisterForm.addEventListener("click", function (event) {
        event.preventDefault();
        loginForm.style.display = "none";
        registerForm.style.display = "block";
        modalTitle.innerText = "Register";
      });

      showLoginForm.addEventListener("click", function (event) {
        event.preventDefault();
        registerForm.style.display = "none";
        loginForm.style.display = "block";
        modalTitle.innerText = "Login";
      });
    }

    if (getGPSCoordinatesButton && registerPharmacyAddressInput) {
      getGPSCoordinatesButton.addEventListener("click", function () {
        // Aquí puedes agregar la lógica para obtener las coordenadas GPS
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            // Llamada a la API de Geocodificación de Google Maps
            const geocodingApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAIA_zqjFMsJM_sxP9-6Pde5vVCTyJmUHM&callback=initMap`;

            fetch(geocodingApiUrl)
              .then(response => response.json())
              .then(data => {
                if (data.results && data.results.length > 0) {
                  const formattedAddress = data.results[0].formatted_address;
                  registerPharmacyAddressInput.value = formattedAddress;
                } else {
                  console.error("No se pudo obtener la dirección desde las coordenadas.");
                }
              })
              .catch(error => {
                console.error("Error al obtener la dirección:", error);
              });
          }, function (error) {
            console.error("Error obteniendo las coordenadas GPS:", error.message);
          });
        } else {
          console.error("La geolocalización no está soportada por este navegador.");
        }
      });
    }
  });
 document.addEventListener("DOMContentLoaded", function () {
    let findPharmacyLink = document.getElementById("findPharmacyLink");

    if (findPharmacyLink) {
      findPharmacyLink.addEventListener("click", function (event) {
        event.preventDefault();

        // Verificar si el navegador soporta la API de Geolocalización
        if ("geolocation" in navigator) {
          // Mostrar mensaje de carga
          showLoadingMessage();

          navigator.geolocation.getCurrentPosition(
            function (position) {
              // Ocultar mensaje de carga
              hideLoadingMessage();

              // Obtener la latitud y longitud
              let lat = position.coords.latitude;
              let lon = position.coords.longitude;

              // Mostrar el mapa con un marcador circular en la ubicación actual
              showMapWithCircle(lat, lon);

              // Enviar números de farmacias a WhatsApp
              sendNumbersToWhatsApp();
            },
            function (error) {
              // Ocultar mensaje de carga
              hideLoadingMessage();

              // Manejar errores de geolocalización
              handleGeolocationError(error);
            }
          );
        } else {
          // El navegador no soporta la geolocalización
          alert("Tu navegador no soporta la geolocalización.");
        }
      });
    }

    function showLoadingMessage() {
      console.log("Obteniendo ubicación...");
    }

    function hideLoadingMessage() {
      console.log("Ubicación obtenida.");
    }

    function showMapWithCircle(lat, lon) {
      // Crear un nuevo mapa centrado en la ubicación actual
      let map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: lat, lng: lon },
        zoom: 14, // Puedes ajustar el nivel de zoom según tus necesidades
      });

      // Crear un marcador circular en la ubicación actual
      new google.maps.Circle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        map: map,
        center: { lat: lat, lng: lon },
        radius: 500, // Radio en metros del círculo
      });
    }

    function handleGeolocationError(error) {
      console.error("Error al obtener la ubicación: ", error.message);

      if (error.code === 1) {
        alert("El usuario ha denegado el acceso a la ubicación.");
      } else if (error.code === 2) {
        alert("No se puede obtener la ubicación en este momento. Intenta nuevamente más tarde.");
      } else if (error.code === 3) {
        alert("Tiempo de espera agotado al intentar obtener la ubicación.");
      }
    }

    function sendNumbersToWhatsApp() {
      // Números de farmacias cercanas (reemplaza con tus propios números)
      let pharmacyNumbers = ["+123456789", "+987654321", "+111223344"];

      // Mensaje predefinido
      let message = "¡Hola! Estoy buscando farmacias cercanas. ¿Puedes ayudarme?";

      // Crear enlaces de WhatsApp para cada número
      pharmacyNumbers.forEach(function (number) {
        let whatsappLink = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
        window.open(whatsappLink, "_blank");
      });
    }
  });

document.addEventListener("DOMContentLoaded", function () {
  let chatDoctorForm = document.getElementById("chatDoctorForm");
  let chatMessages = document.getElementById("chatMessages");

  if (chatDoctorForm) {
    chatDoctorForm.addEventListener("submit", function (event) {
      event.preventDefault();

      // Obtener el mensaje del usuario
      let userMessage = document.getElementById("chatDoctorMessage").value;

      // Mostrar el mensaje del usuario en el contenedor de mensajes
      let userMessageElement = document.createElement("p");
      userMessageElement.textContent = `Tú: ${userMessage}`;
      chatMessages.appendChild(userMessageElement);

      let actionUrl = chatDoctorForm.getAttribute('action');
      let formData = new FormData(chatDoctorForm);
      let formDataObject = {};

      formData.forEach(function (value, key) {
        formDataObject[key] = value;
      });

      let jsonData = JSON.stringify(formDataObject);

      // Enviar la solicitud al servidor
      fetch(actionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': formDataObject['csrfmiddlewaretoken']
        },
        body: jsonData
      })
      .then(response => response.json())
      .then(data => {
        if (data && data.response !== undefined) {
          // Mostrar la respuesta del doctor en el contenedor de mensajes
          let doctorResponseElement = document.createElement("p");
          doctorResponseElement.textContent = `Doctor: ${data.response}`;
          chatMessages.appendChild(doctorResponseElement);

          // Limpiar el campo de entrada del mensaje
          document.getElementById("chatDoctorMessage").value = "";
        } else {
          // Manejar el caso en que no haya respuesta válida
          console.error('La respuesta del servidor no tiene el formato esperado:', data);
        }
      })
      .catch(error => {
        // Manejar errores en la solicitud
        console.error('Error al enviar el formulario:', error);
      });
    });
  }
});


document.addEventListener("DOMContentLoaded", function () {
    let loginForm = document.getElementById("loginForm");
    let registerForm = document.getElementById("registerForm");
    let modalTitle = document.getElementById("modalTitle");
    let showRegisterForm = document.getElementById("showRegisterForm");
    let showLoginForm = document.getElementById("showLoginForm");
    let getGPSCoordinatesButton = document.getElementById("getGPSCoordinates");
    let registerPharmacyAddressInput = document.getElementById("registerPharmacyAddress");

    if (showRegisterForm && showLoginForm) {
      showRegisterForm.addEventListener("click", function (event) {
        event.preventDefault();
        loginForm.style.display = "none";
        registerForm.style.display = "block";
        modalTitle.innerText = "Register";
      });

      showLoginForm.addEventListener("click", function (event) {
        event.preventDefault();
        registerForm.style.display = "none";
        loginForm.style.display = "block";
        modalTitle.innerText = "Login";
      });
    }

    if (getGPSCoordinatesButton && registerPharmacyAddressInput) {
      getGPSCoordinatesButton.addEventListener("click", function () {
        // Aquí puedes agregar la lógica para obtener las coordenadas GPS
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            // Llamada a la API de Geocodificación de Google Maps
            const geocodingApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAIA_zqjFMsJM_sxP9-6Pde5vVCTyJmUHM&callback=initMap`;

            fetch(geocodingApiUrl)
              .then(response => response.json())
              .then(data => {
                if (data.results && data.results.length > 0) {
                  const formattedAddress = data.results[0].formatted_address;
                  registerPharmacyAddressInput.value = formattedAddress;
                } else {
                  console.error("No se pudo obtener la dirección desde las coordenadas.");
                }
              })
              .catch(error => {
                console.error("Error al obtener la dirección:", error);
              });
          }, function (error) {
            console.error("Error obteniendo las coordenadas GPS:", error.message);
          });
        } else {
          console.error("La geolocalización no está soportada por este navegador.");
        }
      });
    }
  });
 document.addEventListener("DOMContentLoaded", function () {
    let findPharmacyLink = document.getElementById("findPharmacyLink");

    if (findPharmacyLink) {
      findPharmacyLink.addEventListener("click", function (event) {
        event.preventDefault();

        // Verificar si el navegador soporta la API de Geolocalización
        if ("geolocation" in navigator) {
          // Mostrar mensaje de carga
          showLoadingMessage();

          navigator.geolocation.getCurrentPosition(
            function (position) {
              // Ocultar mensaje de carga
              hideLoadingMessage();

              // Obtener la latitud y longitud
              let lat = position.coords.latitude;
              let lon = position.coords.longitude;

              // Mostrar el mapa con un marcador circular en la ubicación actual
              showMapWithCircle(lat, lon);

              // Enviar números de farmacias a WhatsApp
              sendNumbersToWhatsApp();
            },
            function (error) {
              // Ocultar mensaje de carga
              hideLoadingMessage();

              // Manejar errores de geolocalización
              handleGeolocationError(error);
            }
          );
        } else {
          // El navegador no soporta la geolocalización
          alert("Tu navegador no soporta la geolocalización.");
        }
      });
    }

    function showLoadingMessage() {
      console.log("Obteniendo ubicación...");
    }

    function hideLoadingMessage() {
      console.log("Ubicación obtenida.");
    }

    function showMapWithCircle(lat, lon) {
      // Crear un nuevo mapa centrado en la ubicación actual
      let map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: lat, lng: lon },
        zoom: 14, // Puedes ajustar el nivel de zoom según tus necesidades
      });

      // Crear un marcador circular en la ubicación actual
      new google.maps.Circle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        map: map,
        center: { lat: lat, lng: lon },
        radius: 500, // Radio en metros del círculo
      });
    }

    function handleGeolocationError(error) {
      console.error("Error al obtener la ubicación: ", error.message);

      if (error.code === 1) {
        alert("El usuario ha denegado el acceso a la ubicación.");
      } else if (error.code === 2) {
        alert("No se puede obtener la ubicación en este momento. Intenta nuevamente más tarde.");
      } else if (error.code === 3) {
        alert("Tiempo de espera agotado al intentar obtener la ubicación.");
      }
    }

    function sendNumbersToWhatsApp() {
      // Números de farmacias cercanas (reemplaza con tus propios números)
      let pharmacyNumbers = ["+123456789", "+987654321", "+111223344"];

      // Mensaje predefinido
      let message = "¡Hola! Estoy buscando farmacias cercanas. ¿Puedes ayudarme?";

      // Crear enlaces de WhatsApp para cada número
      pharmacyNumbers.forEach(function (number) {
        let whatsappLink = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
        window.open(whatsappLink, "_blank");
      });
    }
  });

document.addEventListener("DOMContentLoaded", function () {
  let chatDoctorForm = document.getElementById("chatDoctorForm");
  let chatMessages = document.getElementById("chatMessages");

  if (chatDoctorForm) {
    chatDoctorForm.addEventListener("submit", function (event) {
      event.preventDefault();

      // Obtener el mensaje del usuario
      let userMessage = document.getElementById("chatDoctorMessage").value;

      // Mostrar el mensaje del usuario en el contenedor de mensajes
      let userMessageElement = document.createElement("p");
      userMessageElement.textContent = `Tú: ${userMessage}`;
      chatMessages.appendChild(userMessageElement);

      let actionUrl = chatDoctorForm.getAttribute('action');
      let formData = new FormData(chatDoctorForm);
      let formDataObject = {};

      formData.forEach(function (value, key) {
        formDataObject[key] = value;
      });

      let jsonData = JSON.stringify(formDataObject);

      // Enviar la solicitud al servidor
      fetch(actionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': formDataObject['csrfmiddlewaretoken']
        },
        body: jsonData
      })
      .then(response => response.json())
      .then(data => {
        if (data && data.response !== undefined) {
          // Mostrar la respuesta del doctor en el contenedor de mensajes
          let doctorResponseElement = document.createElement("p");
          doctorResponseElement.textContent = `Doctor: ${data.response}`;
          chatMessages.appendChild(doctorResponseElement);

          // Limpiar el campo de entrada del mensaje
          document.getElementById("chatDoctorMessage").value = "";
        } else {
          // Manejar el caso en que no haya respuesta válida
          console.error('La respuesta del servidor no tiene el formato esperado:', data);
        }
      })
      .catch(error => {
        // Manejar errores en la solicitud
        console.error('Error al enviar el formulario:', error);
      });
    });
  }
});

// main.js

document.addEventListener("DOMContentLoaded", function () {
    // Resto de tu código...

    // Botón "Cotizar recetas médicas"
    let cotizarRecetasButton = document.getElementById("cotizarRecetasButton");

    if (cotizarRecetasButton) {
        cotizarRecetasButton.addEventListener("click", function () {
            // Realizar una solicitud AJAX al servidor para obtener las farmacias
            $.ajax({
                url: "{% url 'cotizar_recetas' %}", // Ajusta la ruta según tu configuración
                method: "POST",  // Cambia a POST para procesar el formulario
                data: {
                    csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                    // Otros datos del formulario si es necesario
                },
                dataType: "json",
                success: function (data) {
                    // Mostrar los resultados en el modal
                    showPharmacyResults(data);
                },
                error: function (error) {
                    console.error("Error al obtener las farmacias:", error);
                }
            });
        });
    }

    // Función para mostrar los resultados en el modal
    function showPharmacyResults(pharmacies) {
        let pharmacyResultsList = document.getElementById("pharmacyResultsList");

        // Limpiar la lista de resultados
        pharmacyResultsList.innerHTML = "";

        // Agregar cada farmacia a la lista
        pharmacies.forEach(function (pharmacy) {
            let listItem = document.createElement("li");
            listItem.textContent = pharmacy.name + " - " + pharmacy.address;
            pharmacyResultsList.appendChild(listItem);
        });

        // Mostrar el modal de resultados
        $("#pharmacyResultsModal").modal("show");
    }
});





