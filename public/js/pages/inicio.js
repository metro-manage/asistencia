import asistenciaMark from "../components/asistenciaMark.js"

export default ()=>{

    const api =(uri = '')=> window.dataApp.api + uri
    const paramQueries = (query = {}) => Object.keys(query).map(key => `${ key }=${ query[key] }`).join('&') 

    const Icon = window.dataApp.icon
    const user = window.dataApp.user

    const ElementComponent = ele.create(`
        <div class="div_f0Au33C scroll-y">
            <div class="div_gZrdl0h">             
                <div class="div_1fG5J8C">
                    <h4>Asistencia</h4>
                    <div id="elementItemData" class="div_W8h9OQ7"> 
                        <div class="div_0EjqIvF">
                            <div class="div_gvk64p8">
                                asistencia
                                <span data-render-to="total_asistencia">-</span>
                            </div>
                            <hr>
                            <button data-form-to="asistencia" class="button_0530xdO pointer">${ Icon.get('fi fi-rr-inventory-alt') }</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `)

    const element  = ele.object( ElementComponent.querySelectorAll('[id]'), 'id', true )
    const { elementItemData } = element

    const elements = {
        dataRenderTo    : ElementComponent.querySelectorAll('[data-render-to]'),
        dataFormTo      : ElementComponent.querySelectorAll('[data-form-to]')
    }

    const main = document.getElementById('main')

    // const elementForm   = {
    //     usuario : formUsuario(),
    //     marca : formMarca(),
    //     categoria : formCategoria(),
    //     asistencia : formAsistencia(),
    //     producto : formProducto()
    // }

    // elements.dataFormTo.forEach(element => {
    //     element.addEventListener('click', ()=> {
    //         main.append( elementForm[ element.getAttribute('data-form-to') ] )
    //     })
    // });

    elementItemData.addEventListener('click', e => {
        const button = e.target.closest('button')

        if( button ) {
            main.append( asistenciaMark( button.getAttribute('data-id-asistencia') ) )
        }
    })

    // Object.values(elementForm).forEach( element => {
    //     element.addEventListener('_submit', e => {

    //         element.remove()
    //         if( e.detail.status  ) dataLoad()

    //     })
    // } )

    const dataRender =( Data = [] )=>{
        elementItemData.innerHTML = Data.map( data => {
            return `
                <div class="div_0EjqIvF">
                    <div class="div_gvk64p8">
                        ${ data.name }
                    </div>
                    <hr>
                    <button data-id-asistencia="${ data.id_asistencia }" class="button_0530xdO pointer">${ Icon.get('fi fi-rr-inventory-alt') }</button>
                </div>
            `
        } ).join('')
    }
    
    const dataLoad =()=>{

        const queries = {
            token : localStorage.getItem( 'auth-token' ),
            query : 2,
            limit : 50,
            uid_user    : user.uid
        }

        fetch( api(`/api/asistencia?${ paramQueries( queries ) }`) )
            .then( res => res.json() )
            .then( dataRender ) 
    }

    dataLoad()

    //

    return ElementComponent
}