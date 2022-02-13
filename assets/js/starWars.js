'use strict'
let starwars = document.getElementById("starWars");
let btn = document.getElementById("btnSW");
btn.addEventListener("click", botonImprimir);
function botonImprimir() {
    let url = btn.value;
    console.log(url);
    if (btn.value == 0) {
        confirm("Por favor, selecciona un personaje, May the Force Be With You");
    } else {
        fetch(url).then(respuesta => respuesta.json())
            .then(persona => {

                //Rellenamos campos
                rellenarDatos("nombre", persona.name, "p");
                rellenarDatos("AnyoNacimiento", persona.birth_year, "p");
                rellenarDatos("altura", persona.height, "p");
                rellenarDatos("genero", persona.gender, "p");
                let arrayPelis = persona.films;
                let arrayPromesas = new Array();
                for (let i = 0; i < arrayPelis.length; i++) {
                    arrayPromesas[i] = fetch(arrayPelis[i]);
                }
                Promise.all(arrayPelis.map(peli => fetch(peli)))// Aquí ha cogido el array de promesas con las películas
                    .then(respuestas => Promise.all(respuestas.map(respuesta => respuesta.json())))
                    .then(pelis => {
                        let peliculas = document.getElementById("peliculas");
                        eliminarHijos(peliculas);
                        for (let k = 0; k < pelis.length; k++) {
                            let nuevapeli = document.createElement("li");
                            nuevapeli.innerText = pelis[k].title;
                            peliculas.appendChild(nuevapeli);
                        }
                    })
                    .catch(datos => console.log("Error" + datos));

                // VEHÍCULOS 
                Promise.all(persona.vehicles.map(vehiculo => fetch(vehiculo)))// Aquí ha cogido el array de promesas con las películas
                    .then(respuestas => Promise.all(respuestas.map(respuesta => respuesta.json())))
                    .then(vehiculos => {
                        let navs = document.getElementById("vehiculos");
                        eliminarHijos(navs);
                        for (let k = 0; k < vehiculos.length; k++) {
                            console.log(vehiculos[k].name);
                            let nuevoVehiculo = document.createElement("p");
                            nuevoVehiculo.innerText = vehiculos[k].name;
                            navs.appendChild(nuevoVehiculo);
                        }
                    })
                    .catch(datos => console.log("Error" + datos));
                   
                // PLANETA 
                fetch(persona.homeworld).then(respuesta => respuesta.json())
                .then(planeta => {
                    rellenarDatos("planeta", planeta.name, "p");
                });


                // NAVES ESPACIALES
                Promise.all(persona.starships.map(nave => fetch(nave)))// Aquí ha cogido el array de promesas con las películas
                    .then(respuestas => Promise.all(respuestas.map(respuesta => respuesta.json())))
                    .then(naves => {
                        let navs = document.getElementById("naves");
                        eliminarHijos(navs);
                        for (let k = 0; k < naves.length; k++) {
                            console.log(naves[k].name);
                            let nuevaNave = document.createElement("p");
                            nuevaNave.innerText = naves[k].name;
                            navs.appendChild(nuevaNave);
                        }
                    })
                    .catch(datos => console.log("Error" + datos));
            });


    }
}
function eliminarHijos(padre) {
    while (padre.firstChild) {
        padre.removeChild(padre.firstChild);
    }
}
function limpiarCampo(id) {
    padre = document.getElementById(id);
    if (padre.hasChildNodes()) {
        padre.removeChild(padre.lastChild);
    }

}
function rellenarDatos(idPadre, textoInsertar, etiqueta) {
    // Primero borramos los hijos, ya que no queremos que se agrupen los datos
    let padre = document.getElementById(idPadre);
    if (padre.hasChildNodes()) {
        // no podemos reutilizar el otro método, ya que, en este caso, también eliminariamos la descripción
        // Podríamos cambiar la etiqueta de destino, pero he optado por hacerlo así.
        padre.removeChild(padre.lastChild);
    }

    let hijo = document.createElement(etiqueta); // Aquí decidimos que tipo de elemento queremos que sea el nuevo dato
    hijo.innerText = textoInsertar; // insertamos el texto
    padre.appendChild(hijo);
}
// LISTAR TODOS LOS PERSONAJES
function mostrarPersonajesFinal(url) {
    fetch(url).then(respuesta => respuesta.json())
        .then(listado => {
            let arrayPersonajes = listado.results;
            for (let i = 0; i < arrayPersonajes.length; i++) {
                
                let personaje = document.createElement("option");
                personaje.innerText = arrayPersonajes[i].name;
                personaje.value = arrayPersonajes[i].url;
                personaje.addEventListener("click", function cambiarNombre() {
                    let swBoton = document.getElementById("btnSW");
                    swBoton.innerText = "Información de: " + personaje.innerText;
                    swBoton.value = personaje.value;
                });
                starwars.appendChild(personaje);
            }
            if (listado.next != null) {
                mostrarPersonajesFinal(listado.next);
            }

        });
}

mostrarPersonajesFinal("https://swapi.dev/api/people/");