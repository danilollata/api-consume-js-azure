const url = "https://api-gkserviciosysoluciones.azurewebsites.net/api/v1/envios";
const urlRepartidores = "https://api-gkserviciosysoluciones.azurewebsites.net/api/v1/repartidores";
const urlEstados = "https://api-gkserviciosysoluciones.azurewebsites.net/api/v1/estados_envio";

const contenedor = document.querySelector("tbody");
let resultados = "";

const modalEnvio = new bootstrap.Modal(document.getElementById("modalEnvio"));
const formEnvio = document.querySelector("form");
const btnCrear = document.getElementById("btnCrear");

const remitente = document.getElementById("remitente");
const destinatario = document.getElementById("destinatario");
const direccionEnvio = document.getElementById("direccion_envio");
const fechaEnvio = document.getElementById("fecha_envio");
const repartidorId = document.getElementById("repartidor_id");
const estadoId = document.getElementById("estado_id");

let opcion = "";

// Mostrar formulario para crear nuevo envío
btnCrear.addEventListener("click", async () => {
  // Limpiar campos antes de abrir el modal
  remitente.value = "";
  destinatario.value = "";
  direccionEnvio.value = "";
  fechaEnvio.value = "";
  repartidorId.selectedIndex = 0;
  estadoId.selectedIndex = 0;

  // Cargar los repartidores y estados
  await cargarRepartidores();
  await cargarEstados();

  // Abrir el modal
  modalEnvio.show();
  opcion = "crear";
});

// Función para mostrar los envíos en la tabla
const mostrar = (envios) => {
  resultados = ""; // Limpiar resultados antes de mostrar
  envios.forEach((envio) => {
    resultados += `<tr>
                        <td>${envio.envio_id}</td>
                        <td>${envio.remitente}</td>
                        <td>${envio.destinatario}</td>
                        <td>${envio.direccion_envio}</td>
                        <td>${envio.fecha_envio}</td>
                        <td>${envio.nombre_repartidor}</td>
                        <td>${envio.apellido_repartidor}</td>
                        <td>${envio.estado}</td>
                        <td class="text-center text-nowrap"><a class="btnEditar btn btn-primary">Editar</a><a class="btnBorrar btn btn-danger ms-2">Borrar</a></td>
                      </tr>`;
  });
  contenedor.innerHTML = resultados;
};

// Obtener envíos desde la API y mostrarlos
const cargarEnvios = async () => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    mostrar(data);
  } catch (error) {
    console.error("Error al cargar los envíos:", error);
  }
};

// Llamar a la función para cargar los envíos al inicio
cargarEnvios();

// Función para agregar eventos dinámicos
const on = (element, event, selector, handler) => {
  element.addEventListener(event, (e) => {
    if (e.target.closest(selector)) {
      handler(e);
    }
  });
};

// Borrar un envío
on(document, "click", ".btnBorrar", (e) => {
  const fila = e.target.parentNode.parentNode;
  const id = fila.firstElementChild.innerHTML;
  alertify.confirm(
    "¿Desea borrar este elemento?",
    function () {
      fetch("https://api-gkserviciosysoluciones.azurewebsites.net/api/v1/envio/" + id, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then(() => {
          cargarEnvios(); // Recargar los envíos después de borrar
        });
      alertify.success("Eliminado");
    },
    function () {
      alertify.error("Cancelado");
    }
  );
});

// Cargar repartidores
const cargarRepartidores = async () => {
  const res = await fetch(urlRepartidores);
  const data = await res.json();

  repartidorId.innerHTML = '<option value="">Seleccione un repartidor</option>';
  data.forEach((rep) => {
    const nombreCompleto = `${rep.nombre} ${rep.apellido}`;
    repartidorId.innerHTML += `<option value="${rep.repartidor_id}">${nombreCompleto}</option>`;
  });
};

// Cargar estados
const cargarEstados = async () => {
  const res = await fetch(urlEstados);
  const data = await res.json();

  estadoId.innerHTML = '<option value="">Seleccione un estado</option>';
  data.forEach((est) => {
    estadoId.innerHTML += `<option value="${est.estado_id}">${est.nombre_estado}</option>`;
  });
};

// Editar un envío
on(document, "click", ".btnEditar", async (e) => {
  const fila = e.target.parentNode.parentNode;

  idForm = fila.children[0].innerHTML; // El ID de la fila
  const remitenteForm = fila.children[1].innerHTML;
  const destinatarioForm = fila.children[2].innerHTML;
  const direccionEnvioForm = fila.children[3].innerHTML;
  const fechaEnvioForm = fila.children[4].innerHTML;
  const nombreRepartidorForm = fila.children[5].innerHTML;
  const apellidoRepartidorForm = fila.children[6].innerHTML;
  const estadoForm = fila.children[7].innerHTML;

  // Asignar los valores del envío a los campos del formulario
  remitente.value = remitenteForm;
  destinatario.value = destinatarioForm;
  direccionEnvio.value = direccionEnvioForm;
  fechaEnvio.value = fechaEnvioForm;

  // Cargar los repartidores y estados
  await cargarRepartidores();
  await cargarEstados();

  // Seleccionar el repartidor en base al nombre completo
  const nombreCompleto = `${nombreRepartidorForm} ${apellidoRepartidorForm}`;
  for (let option of repartidorId.options) {
    if (option.text.trim() === nombreCompleto.trim()) {
      repartidorId.value = option.value;
      break;
    }
  }

  // Seleccionar el estado
  for (let option of estadoId.options) {
    if (option.text.trim() === estadoForm.trim()) {
      estadoId.value = option.value;
      break;
    }
  }

  // Cambiar la opción a "editar"
  opcion = "editar";

  // Abrir el modal
  modalEnvio.show();
});

// Crear o editar envío
formEnvio.addEventListener("submit", (e) => {
  e.preventDefault();

  const repartidorSeleccionado = repartidorId.options[repartidorId.selectedIndex];
  const estadoSeleccionado = estadoId.options[estadoId.selectedIndex];

  // Verificamos si se ha seleccionado un repartidor y estado
  if (!repartidorSeleccionado || !estadoSeleccionado) {
    alert("Por favor, selecciona un repartidor y un estado.");
    return;
  }

  // Asegurarnos de que la fecha y hora están en formato correcto
  const fechaHora = new Date(fechaEnvio.value); // Convertir a objeto Date
  const fechaHoraFormateada = fechaHora.toISOString(); // Convertir a formato ISO

  if (opcion === "crear") {
    // Crear un nuevo envío
    fetch("https://api-gkserviciosysoluciones.azurewebsites.net/api/v1/envio", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        remitente: remitente.value,
        destinatario: destinatario.value,
        direccion_envio: direccionEnvio.value,
        fecha_envio: fechaHoraFormateada, // Usar la fecha con la hora
        repartidor_id: parseInt(repartidorId.value),
        estado_id: parseInt(estadoId.value),
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error al crear el envío: " + response.statusText);
        }
      })
      .then(() => {
        cargarEnvios(); // Recargar los envíos después de crear
      })
      .catch((error) => console.error("Error:", error));
  }

  if (opcion === "editar") {
    // Editar un envío existente
    fetch(`https://api-gkserviciosysoluciones.azurewebsites.net/api/v1/envio/${idForm}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        remitente: remitente.value,
        destinatario: destinatario.value,
        direccion_envio: direccionEnvio.value,
        fecha_envio: fechaHoraFormateada, // Usar la fecha con la hora
        repartidor_id: parseInt(repartidorId.value),
        estado_id: parseInt(estadoId.value),
      }),
    })
      .then((response) => response.json())
      .then(() => {
        cargarEnvios(); // Recargar los envíos después de editar
      })
      .catch((error) => console.error("Error al editar el envío:", error));
  }

  // Cerrar el modal
  modalEnvio.hide();
});
