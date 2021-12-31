//imports
importScripts('js/sw-utils.js'); //para que importScripts no de un error lo agregamos en el archivo .jshintrc


const STATIC_CACHE      = 'static-V2';
const DYNAMIC_CACHE     = 'dynamic-v1';
const INMUTABLE_CACHE   = 'inmutable-v1';

//creamos el APP_SHELL: contiene todo lo necesario para mi aplicacion
const APP_SHELL = [
'/',
'index.html',
'css/style.css',
'img/favicon.ico',
'img/avatars/hulk.jpg',
'img/avatars/spiderman.jpg',
'img/avatars/ironman.jpg',
'img/avatars/thor.jpg',
'img/avatars/wolverine.jpg',
'js/app.js',
'js/sw-utils.js'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
    ];


//LLEVAMOS A CABO LA INSTALACION DEL SERVICEWORKER
    self.addEventListener('install',e =>{
        //almacenamos el APP_SHELL y APP_SHELL_INMUTABLE en sus respectivos lugares

        const cacheStatic = caches.open(STATIC_CACHE).then(cache =>{
            cache.addAll(APP_SHELL);
        });

        const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache =>{
            cache.addAll(APP_SHELL_INMUTABLE);
        });
        
        e.waitUntil(Promise.all([cacheStatic,cacheInmutable]));
    });

//PROCESO PARA QUE CADA VEZ QUE SE CAMBIE EL SERVICEWORKER BORRE LOS CACHES ANTERIORES QUE NO VAN A SERVIR
    self.addEventListener('activate',e => {

        const respuesta = caches.keys().then(keys => {
    
            keys.forEach(key => {
    
                // static-v..
                if(key !== STATIC_CACHE && key.includes('static')){
    
                    return caches.delete(key);
                }    
    
            });
            
        });
    
        e.waitUntil( respuesta );
    });

    //IMPLEMENTAMOS LA ESTRATEGIA DEL CACHE
    //CACHE ONLY
    self.addEventListener('fetch', e=>{

        //verifico en la cache si existe la request
        const respuesta = caches.match(e.request).then(res =>{
            if(res){
                return res;
            }else{
                return fetch(e.request).then(newRes =>{
                    //necesito entonces almacenarlo en el cache dinamico
                    return actualizarCacheDinamico(DYNAMIC_CACHE, e.request, newRes);

                });
            }

        });

        
        
        e.respondWith(respuesta);


    });
