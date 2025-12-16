
const catalogo = document.querySelector('.catalogo');
const boton_incremental = document.querySelector('.boton_incremental');
const boton_decremental = document.querySelector('.boton_decremental');

var respuesta_next = "";
var respuesta_preview = "";
var url_principal = `https://pokeapi.co/api/v2/pokemon/?offset=0&limit=12`;



//Se extrae los elementos en orden de paginacion
const consultar_paginacion = async function(url_principal){

    try{
        let result_Urls = [];
        //consultar
        let peticion_paginacion= await fetch(url_principal);
        
               
        //convertir JSON
        let respuesta = await peticion_paginacion.json();
        //console.log('respuesta: ',respuesta);
        //results: Array(10) [ {…}, {…}, {…}, … ]0: Object { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" }
        let respuesta_results  = respuesta.results
        respuesta_next = respuesta.next;
        respuesta_preview = respuesta.previous;
        //[result_Nombres] [result_URLs]
        respuesta_results.map(n=>{
            result_Urls.push(n.url);
        })

       //se invoca la consulta 2 desde la primera
        consultar_datos(result_Urls);
      
             
    }catch(e){
        console.log('Error encontrado: ',e)
    }

}

//Se extraen los datos a renderizar
const consultar_datos = async function(lsu){ 
    //Mapea la lista de urls devueltas por consulta 1 y la variable se convierte en una lista de peticiones fetch
    let lista_url_fetch = lsu.map(url=>{
        return fetch(url)
    })

    try{
        //Esperamos a que se procesen los fetch y los convertimos a promesas 1 a 1
        let lista_promises = await Promise.all(lista_url_fetch);
        //Esperamos  a que se procese lo anterior y convertimos el listado de promesas en json 1 a 1 mapeando
        let lista_peticiones_json = lista_promises.map(lu=>{
             return lu.json();
        })

        //Se procesa la lista_peticiones_json y se espera a que cada una se resuelva 

        let resul_json = await Promise.all(lista_peticiones_json);

        //devolvemos las respuestas en formato json
        //console.log('respuesta 2: ',resul_json);

         //renderizar       
       
         render_data(resul_json)
       

    }catch(e){
        console.log('Segundo aviso Error : ',e);
    }
        
}

//invocacion
consultar_paginacion(url_principal);

//botones

boton_incremental.addEventListener('click',()=>{
    respuesta_next != null ? consultar_paginacion(respuesta_next) : consultar_paginacion(`https://pokeapi.co/api/v2/pokemon/?offset=0&limit=12`);
})

boton_decremental.addEventListener('click',()=>{
    respuesta_preview != null ? consultar_paginacion(respuesta_preview) : consultar_paginacion(`https://pokeapi.co/api/v2/pokemon/?offset=0&limit=12`);
})


//funciones auxiliares
//esta funcion para renderiza todos los datos necesarios
function render_data(pokemonDataArray) {
    // 1. Inicializar la cadena de acumulación
    let cardsHTML = '';
    
    // 2. Limpiar el contenedor antes de empezar
    catalogo.innerHTML = ''; 

    // Usamos forEach o map para iterar y acumular (sin tocar el DOM aún)
    pokemonDataArray.forEach(pokemon => {
        // Asumiendo que has extraído estas variables antes de llamar a render_images
        // o que las extraes aquí directamente del objeto 'pokemon'.
        
        const ls_id = pokemon.id;
        const ls_nombres = pokemon.name;
        const ls_imagenes = pokemon.sprites.front_default;
        const ls_habilidades_principales = pokemon.abilities[0].ability.name;
        const ls_experiencia = pokemon.base_experience;
        const ls_estaturas = pokemon.height;


        // Acumulación de la cadena de texto (¡Rápido!)
        cardsHTML += `
            <div class="element">
                <h5 class="number">#${ls_id}</h5>
                <img src="${ls_imagenes}" alt="${ls_nombres}">
                <h3>Nombre: ${ls_nombres}</h3>
                <h4>Habilidad: ${ls_habilidades_principales}</h4>
                <h4>Ex: ${ls_experiencia}</h4>
                <h4>Estatura: ${ls_estaturas}</h4>
            </div>
        `;
    });

    // 3. Asignación final al DOM (¡Una sola vez!)
    // Envolvemos todo en el contenedor del catálogo.
    catalogo.innerHTML = cardsHTML; 
}



 