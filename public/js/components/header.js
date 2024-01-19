import navigate from "./navigate.js"

export default ()=>{

    const Icon = window.dataApp.icon

    const ElementComponent = ele.create(`
        <header class="header_N8p7RP6" style="display:none">
                
            <div class="div_349Zfgp scroll-h">
                <button id="buttonNavigate" class="button_0530xdO pointer">${ Icon.get('fi fi-rr-menu-burger') }</button>
                <h4 class="text-ellipsis">Inicio</h4>
            </div>
        
        </header>
    `)

    const elements = ele.object( ElementComponent.querySelectorAll('[id]'), 'id', true )
    const { buttonNavigate } = elements

    const root = document.getElementById('root')

    const elementNavigate = navigate()

    buttonNavigate.addEventListener('click', ()=> {
        root.append( elementNavigate )
    })

    const ePopstate =()=>{
        ElementComponent.removeAttribute('style')
        const page = location.hash.slice(1).split('/')[1] ?? ''
        
        if( page == '' ) {

            root.prepend( ElementComponent )

        } else {

            ElementComponent.remove()

        }

    }

    setTimeout( ePopstate )
    addEventListener('popstate', ePopstate)

    return ElementComponent
}