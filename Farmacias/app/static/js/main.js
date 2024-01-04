
document.addEventListener("DOMContentLoaded", function () {
      let loginForm = document.getElementById("loginForm");
      let registerForm = document.getElementById("registerForm");
      let modalTitle = document.getElementById("modalTitle");
      let showRegisterForm = document.getElementById("showRegisterForm");
      let showLoginForm = document.getElementById("showLoginForm");

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
    });
document.addEventListener("DOMContentLoaded", function () {
  let findPharmacyLink = document.getElementById("findPharmacyLink");

  if (findPharmacyLink) {
    findPharmacyLink.addEventListener("click", function (event) {
      event.preventDefault();

      // Verificar si el navegador soporta la API de Geolocalización
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          function (position) {
            // Obtener la latitud y longitud
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;

            // Construir y redirigir a la URL de Google Maps
            window.location.href = `https://www.google.com/maps?q=${lat},${lon}`;
          },
          function (error) {
            // Manejar errores de geolocalización
            console.error("Error al obtener la ubicación: ", error.message);
          }
        );
      } else {
        // El navegador no soporta la geolocalización
        alert("Tu navegador no soporta la geolocalización.");
      }
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

$(document).ready(function () {
    console.log('Document ready event fired.');

    // Evento shown.bs.modal para el modal Cotizar Recetas
    $('#cotizarRecetasModal').on('shown.bs.modal', function (e) {
        console.log('Modal shown event fired.');
        cargarFarmaciasYMostrarModal();
    });

    // Función para cargar las farmacias y mostrar el modal
    function cargarFarmaciasYMostrarModal() {
        // Realiza una solicitud AJAX para obtener las farmacias registradas
        $.ajax({
            url: '/api/farmacias/',  // Actualiza la URL según tu configuración
            method: 'GET',
            success: function (data) {
                // Limpia el contenido actual del modal (si es necesario)
                $('#modalFarmaciasList').empty();

                // Agrega las farmacias al modal
                for (let i = 0; i < data.farmacias.length; i++) {
                    const farmacia = data.farmacias[i];
                    const farmaciaItem = '<li>' + farmacia.nombre + ' - ' + farmacia.direccion + '</li>';
                    $('#modalFarmaciasList').append(farmaciaItem);
                }
            },
            error: function (error) {
                console.log('Error al cargar las farmacias:', error);
            }
        });
    }
});


// Espera a que el documento esté completamente cargado
document.addEventListener('DOMContentLoaded', function () {
    // Selecciona el formulario de búsqueda y el campo de entrada
    const searchForm = document.querySelector('.form-inline');
    const searchInput = searchForm.querySelector('.form-control');

    // Agrega un evento de escucha para el envío del formulario
    searchForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Evita que el formulario se envíe de manera convencional

        // Obtiene el valor del campo de búsqueda
        const searchTerm = searchInput.value;

        // Realiza la lógica de búsqueda aquí (puedes redirigir a una página de resultados o hacer otras acciones)

        // Limpia el campo de búsqueda después de realizar la búsqueda
        searchInput.value = '';
    });
});


