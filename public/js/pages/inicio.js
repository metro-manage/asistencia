import formAsistencia from "../components/formAsistencia.js"
import formCategoria from "../components/formCategoria.js"
import formMarca from "../components/formMarca.js"
import formProducto from "../components/formProducto.js"
import formUsuario from "../components/formUsuario.js"

export default ()=>{

    const api =(uri = '')=> window.dataApp.api + uri
    const paramQueries = (query = {}) => Object.keys(query).map(key => `${ key }=${ query[key] }`).join('&') 

    const Icon = window.dataApp.icon

    const ElementComponent = ele.create(`
        <div class="div_f0Au33C scroll-y" style="padding:15px">
            <div class="div_gZrdl0h">
                <div class="div_1fG5J8C">
                    <h4>Inventario</h4>
                    <div class="div_W8h9OQ7">
                        <div class="div_0EjqIvF">
                            <div class="div_gvk64p8">
                                productos
                                <span data-render-to="total_productos">-</span>
                            </div>
                            <hr>
                            <button data-form-to="producto" class="button_0530xdO pointer">${ Icon.get('fi fi-rr-plus') }</button>
                        </div>
                        <div class="div_0EjqIvF">
                            <div class="div_gvk64p8">
                            marcas
                                <span data-render-to="total_marca">-</span>
                            </div>
                            <hr>
                            <button data-form-to="marca" class="button_0530xdO pointer">${ Icon.get('fi fi-rr-plus') }</button>
                        </div>
                        <div class="div_0EjqIvF">
                            <div class="div_gvk64p8">
                                categorias
                                <span data-render-to="total_categoria">-</span>
                            </div>
                            <hr>
                            <button data-form-to="categoria" class="button_0530xdO pointer">${ Icon.get('fi fi-rr-plus') }</button>
                        </div>
                    </div>
                </div>
                <div class="div_1fG5J8C">
                    <h4>Usuario</h4>
                    <div class="div_W8h9OQ7">
                        <div class="div_0EjqIvF">
                            <div class="div_gvk64p8">
                                usuario
                                <span data-render-to="total_users">-</span>
                            </div>
                            <hr>
                            <button data-form-to="usuario" class="button_0530xdO pointer">${ Icon.get('fi fi-rr-plus') }</button>
                        </div>
                    </div>
                </div>
                <div class="div_1fG5J8C">
                    <h4>Asistencia</h4>
                    <div class="div_W8h9OQ7"> 
                        <div class="div_0EjqIvF">
                            <div class="div_gvk64p8">
                                asistencia
                                <span data-render-to="total_asistencia">-</span>
                            </div>
                            <hr>
                            <button data-form-to="asistencia" class="button_0530xdO pointer">${ Icon.get('fi fi-rr-plus') }</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `)

    const { } = ele.object( ElementComponent.querySelectorAll('[id]'), 'id', true )

    const elements = {
        dataRenderTo    : ElementComponent.querySelectorAll('[data-render-to]'),
        dataFormTo      : ElementComponent.querySelectorAll('[data-form-to]')
    }

    const main = document.getElementById('main')

    const elementForm   = {
        usuario : formUsuario(),
        marca : formMarca(),
        categoria : formCategoria(),
        asistencia : formAsistencia(),
        producto : formProducto()
    }

    elements.dataFormTo.forEach(element => {
        element.addEventListener('click', ()=> {
            main.append( elementForm[ element.getAttribute('data-form-to') ] )
        })
    });

    Object.values(elementForm).forEach( element => {
        element.addEventListener('_submit', e => {

            element.remove()
            if( e.detail.status  ) dataLoad()

        })
    } )
    
    const dataLoad =()=>{

        const queries = {
            token : localStorage.getItem('auth-token')
        }

        fetch( api(`/api/info?${ paramQueries( queries ) }`) )
            .then( res => res.json() )
            .then( data => {

                elements.dataRenderTo.forEach(element => {
                    element.textContent = data[element.getAttribute('data-render-to')] ?? '-'
                })

            } )
    }

    dataLoad()

    return ElementComponent
}