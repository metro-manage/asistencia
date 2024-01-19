import routesPublic from "./routesPublic.js";
import routesPrivate from "./routesPrivate.js";

import login from "../pages/login.js";
import inicio from "../pages/inicio.js" 

import asistencia from "../pages/asistencia.js";
import asistenciaId from "../pages/asistenciaId.js"; 
import usuarioMe from "../pages/usuarioMe.js";

export default ()=>{
    const Route = new Hash()

    Route.param('/', ()=> routesPrivate( inicio ))
    Route.param('/login', ()=> routesPublic( login ))
    Route.param('/asistencia', ()=> routesPrivate( asistencia ))
    Route.param('/asistencia/:id', (params)=> routesPrivate( asistenciaId, params ))
    Route.param('/usuario/me', ()=> routesPrivate( usuarioMe ))
    
    const main = ele.create('<main class="main" id="main"></main>')

    main.append( Route.dispatch() )
    
    addEventListener('hashchange', ()=> {
        main.innerHTML = ''
        main.append( Route.dispatch() )
    })

    return main

} 