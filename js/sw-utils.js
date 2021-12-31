// este es un archivo auxiliar del serviceWorker sw.js que me permitira 
//transladacierta logica alla

//guardar en el cache dinamico
function actualizarCacheDinamico(dynamicCache, req, res){
    if(res.ok){
        return caches.open(dynamicCache).then(cache =>{
            cache.put(req, res.clone());
            return res.clone();
        });
    } else{

        return res;
    }
}


