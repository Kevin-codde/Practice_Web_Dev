
const contar = (palabra)=>{
    //return new Promise(
        (res,rej)=>{

            setTimeout(()=>{
                palabra.length <= 5 ? res("ok") : rej("not found");
            },3000)

        }
    //)
}

let respuesta = contar("Hola mundo");

respuesta.then((res)=>{
    console.log(res);
}).catch(err=>{
    console.log(err);
}).finally(console.log("Proceso terminado"))