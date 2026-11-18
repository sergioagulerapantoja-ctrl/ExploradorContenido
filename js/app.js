async function consultarJson(url) {
  const respuesta = await fetch(url, {
    cache: "no-store",
    signal: AbortSignal.timeout(12000)
  });

  if (!respuesta.ok) {
    throw new Error(`HTTP ${respuesta.status}`);
  }

  return await respuesta.json();
}

function leerTexto(valor) {
  if (typeof valor !== "string" || !valor.trim()) {
    throw new Error("La respuesta no contiene el texto esperado.");
  }

  return valor;
}

async function cargarImagen(url, descripcion) {
  const imagen = new Image();
  imagen.alt = descripcion;
  imagen.src = url;
  let temporizador;

  try {
    const esperaMaxima = new Promise((resolve, reject) => {
      temporizador = setTimeout(() => reject(new Error("La imagen tardó demasiado.")), 15000);
    });
    await Promise.race([imagen.decode(), esperaMaxima]);
    return imagen;
  } catch (error) {
    imagen.removeAttribute("src");
    throw error;
  } finally {
    clearTimeout(temporizador);
  }
}

async function consultarCita(contenido) {
  const respuesta = await consultarJson("https://dummyjson.com/quotes/random");
  const cita = leerTexto(respuesta.quote);
  const autor = leerTexto(respuesta.author);

  contenido.querySelector("[data-quote]").textContent = cita;
  contenido.querySelector("[data-author]").textContent = autor;
}

async function consultarPerro(contenido) {
  const respuesta = await consultarJson("https://dog.ceo/api/breeds/image/random");
  const url = leerTexto(respuesta.message);
  const imagen = await cargarImagen(url, "Foto de un perro de Dog CEO");

  contenido.replaceChildren(imagen);
}

async function consultarGato(contenido) {
  const respuesta = await consultarJson("https://cataas.com/cat?json=true");
  const ruta = respuesta.url || `/cat/${encodeURIComponent(leerTexto(respuesta.id))}`;
  const url = new URL(ruta, "https://cataas.com");
  const imagen = await cargarImagen(url.href, "Foto de un gato de CATAAS");

  contenido.replaceChildren(imagen);
}

async function consultarDato(contenido) {
  const respuesta = await consultarJson("https://uselessfacts.jsph.pl/api/v2/facts/random?language=en");
  contenido.querySelector("[data-fact]").textContent = leerTexto(respuesta.text);
}

function activarTarjeta(id, consultar, mensajeDeError) {
  const tarjeta = document.getElementById(id);
  const contenido = tarjeta.querySelector(".card__content");
  const estado = tarjeta.querySelector(".card__status");
  const boton = tarjeta.querySelector("button");

  async function actualizar() {
    boton.disabled = true;
    contenido.setAttribute("aria-busy", "true");
    estado.classList.remove("is-error");
    estado.textContent = "Cargando...";

    try {
      await consultar(contenido);
      estado.textContent = "";
    } catch {
      estado.classList.add("is-error");
      estado.textContent = mensajeDeError;
    } finally {
      contenido.setAttribute("aria-busy", "false");
      boton.disabled = false;
    }
  }

  boton.addEventListener("click", actualizar);
  actualizar();
}

activarTarjeta("citas", consultarCita, "No se pudo cargar la cita. Intenta nuevamente.");
activarTarjeta("perros", consultarPerro, "No se pudo cargar la foto del perro. Intenta nuevamente.");
activarTarjeta("gatos", consultarGato, "No se pudo cargar la foto del gato. Intenta nuevamente.");
activarTarjeta("datos", consultarDato, "No se pudo cargar el dato. Intenta nuevamente.");
