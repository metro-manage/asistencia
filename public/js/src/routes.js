import routesPublic from "./routesPublic.js";
import routesPrivate from "./routesPrivate.js";

import login from "../pages/login.js";
import inicio from "../pages/inicio.js"
import inventario from "../pages/inventario.js";

import marca from "../pages/marca.js";
import marcaId from "../pages/marcaId.js";

import categoria from "../pages/categoria.js";
import categoriaId from "../pages/categoriaId.js";

import usuario from "../pages/usuario.js";
import usuarioId from "../pages/usuarioId.js";
import usuarioMe from "../pages/usuarioMe.js";

import asistencia from "../pages/asistencia.js";
import asistenciaId from "../pages/asistenciaId.js";
import asistenciaIdUserUid from "../pages/asistenciaIdUserUid.js";

import producto from "../pages/producto.js";
import productoId from "../pages/productoId.js";

export default ()=>{

    const Route = new Hash()
    Route.param('/', ()=> routesPrivate( inicio ))
    Route.param('/login', ()=> routesPublic( login ))
    Route.param('/inventario', ()=> routesPrivate( inventario ))
    Route.param('/marca', ()=> routesPrivate( marca ))
    Route.param('/marca/:id', ( params )=> routesPrivate( marcaId, params ))
    Route.param('/categoria', ()=> routesPrivate( categoria ))
    Route.param('/categoria/:id', ( params )=> routesPrivate( categoriaId, params ))
    Route.param('/usuario', ()=> routesPrivate( usuario ))
    Route.param('/usuario/me', ()=> routesPrivate( usuarioMe ))
    Route.param('/usuario/:id', (params)=> routesPrivate( usuarioId, params ))
    Route.param('/asistencia', ()=> routesPrivate( asistencia ))
    Route.param('/asistencia/:id', (params)=> routesPrivate( asistenciaId, params ))
    Route.param('/asistencia/:id/user/:uid_user', (params)=> routesPrivate( asistenciaIdUserUid, params ))
    Route.param('/producto', ()=> routesPrivate( producto ))
    Route.param('/producto/:id', (params)=> routesPrivate( productoId, params ))

    const main = ele.create('<main class="main" id="main"></main>')

    main.append( Route.dispatch() )
    
    addEventListener('hashchange', ()=> {
        main.innerHTML = ''
        main.append( Route.dispatch() )
    })

    return main
 
} 