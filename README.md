# Explorador de contenido aleatorio

La página muestra una cita con su autor, una foto de un perro, una foto de un gato y un dato curioso. Cada tarjeta tiene un botón para pedir contenido nuevo.

## Repositorio

[ExploradorContenido en GitHub](https://github.com/sergioagulerapantoja-ctrl/ExploradorContenido)

## Integrantes

- [Completar nombre y apellido]

## Tecnologías

HTML para la estructura, CSS para el diseño adaptable y JavaScript para las consultas con `fetch` y `async/await`.

## Cómo ejecutarlo

1. Descarga y extrae el ZIP.
2. Abre una terminal en la carpeta `ExploradorContenido`. Con Python 3 instalado, ejecuta `python -m http.server 8090`. En Windows también puedes usar `py -m http.server 8090` y en macOS o Linux, `python3 -m http.server 8090`.
3. Abre [http://localhost:8090](http://localhost:8090) en el navegador. La página necesita conexión a Internet para consultar las APIs.

## APIs utilizadas

Todas las consultas de la tabla usan el método GET.

| API | Endpoint | Campos que usa la página |
| --- | --- | --- |
| [DummyJSON](https://dummyjson.com/docs/quotes) | `https://dummyjson.com/quotes/random` | `quote` y `author` |
| [Dog CEO](https://dog.ceo/dog-api/documentation/random) | `https://dog.ceo/api/breeds/image/random` | `message` |
| [CATAAS](https://cataas.com/) | `https://cataas.com/cat?json=true` | `url`, o `id` para formar `https://cataas.com/cat/{id}` |
| [Useless Facts](https://uselessfacts.jsph.pl/) | `https://uselessfacts.jsph.pl/api/v2/facts/random?language=en` | `text` |

## Cómo funciona

Al abrir la página, las cuatro tarjetas consultan su API. Cada clic vuelve a consultar solo la API de ese botón. Mientras llega la respuesta, la tarjeta muestra «Cargando...» y deshabilita el botón. Si la consulta o la foto falla, muestra un mensaje, conserva el contenido anterior si ya lo había y habilita el botón para reintentar.

## Preguntas de reflexión

1. **¿Qué es un endpoint y cuál usé para cada API?** Es la dirección a la que la aplicación envía una solicitud para pedir un recurso. Los cuatro endpoints GET que usé están en la tabla.
2. **¿Qué diferencia hay entre recibir JSON y recibir directamente una imagen?** El JSON contiene datos con campos que JavaScript puede leer. Por ejemplo, CATAAS devuelve `url` al pedir `?json=true`. Al abrir esa URL se recibe una imagen, que el navegador muestra con un elemento `img`.
3. **¿Qué hacen `await` y `response.json()`?** `await` espera el resultado de una promesa dentro de la función asíncrona. `response.json()` lee el cuerpo y transforma el JSON en valores de JavaScript. En `consultarJson` espero tanto la respuesta de `fetch` como la lectura del cuerpo.
4. **¿Por qué verifico `response.ok` si ya uso `try/catch`?** Una respuesta HTTP como 404 o 500 puede llegar normalmente a `fetch`. Si `ok` es falso, lanzo un error para que el `catch` de la tarjeta muestre el mensaje. Los fallos de red también llegan a ese `catch`.
5. **¿Cómo se actualiza una sección sin recargar la página?** Cada botón tiene un evento de clic que llama a la función de su tarjeta. Cuando termina la consulta, cambio el texto con `textContent` o reemplazo la imagen con `replaceChildren` dentro de esa misma tarjeta.

## Evidencias

- [Las cuatro tarjetas funcionando](evidencias/01-pagina-funcionando.png)
- [Error controlado y botón disponible para reintentar](evidencias/02-error-controlado.png)
