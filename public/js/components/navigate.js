import settingTheme from "../setting/theme.js"
import Position from "../data/Position.js"

export default ()=>{

    const api =(uri = '')=> window.dataApp.api + uri
    const paramQueries = (query = {}) => Object.keys(query).map(key => `${ key }=${ query[key] }`).join('&')

    const Icon = window.dataApp.icon

    const ElementComponent = ele.create(`
        <div class="div_qRE6Ouj">

            <div id="closeElement" class="div_EOQfId0"></div>

            <div class="div_ne1hH6r">

                <div class="div_u7bzq5P">

                    <div class="div_kCRaV9G">

                        <a id="elementUser" href="#/usuario/me" class="div_SHt2V05 pointer">
                            <img src="">
                            <div>
                                <span class="text-ellipsis">-</span>
                                <p class="text-ellipsis">-</p>
                            </div>
                        </a>
                        <hr>

                        ${ localStorage.getItem('theme') == 'light' ?
                            `<button id="buttonTheme" class="button_0530xdO pointer" data-theme="light">${ Icon.get('fi fi-rr-moon') }</button>`
                            :
                            `<button id="buttonTheme" class="button_0530xdO pointer" data-theme="dark">${ Icon.get('fi fi-rr-sun') }</button>`
                        }

                    </div>
                    <div class="div_211TG0a scroll-y">
                    
                        <div class="div_068U4VO">
                            <a class="a_rx39DYh pointer" href="#/">
                                ${ Icon.get('fi fi-rr-house-blank') }
                                <span class="text-ellipsis">Inicio</span>
                            </a>

                            <a class="a_rx39DYh pointer" href="#/inventario">
                                ${ Icon.get('fi fi-rr-box-circle-check') }
                                <span class="text-ellipsis">Inventario</span>
                            </a>

                            <a class="a_rx39DYh pointer" href="#/asistencia">
                                ${ Icon.get('fi fi-rr-inventory-alt') }
                                <span class="text-ellipsis">Asistencia</span>
                            </a>
                            
                            <a class="a_rx39DYh pointer" href="#/usuario">
                                ${ Icon.get('fi fi-rr-users') }
                                <span class="text-ellipsis">Usuario</span>
                            </a>
                        </div>
                    
                    </div>
                    <div class="div_N0za9z1">

                        <button id="buttonLogout" class="a_rx39DYh pointer">
                            ${ Icon.get('fi fi-rr-exit') }
                            <span>Salir</span>
                        </button>
                    
                    </div>

                </div>

            </div>

        </div>
    `)

    const elements = ele.object( ElementComponent.querySelectorAll('[id]'), 'id', true )
    const { closeElement, buttonTheme, elementUser, buttonLogout } = elements

    const icon = {
        sun : Icon.get('fi fi-rr-sun'),
        moon: Icon.get('fi fi-rr-moon')
    }

    closeElement.addEventListener('click', ()=> {
        ElementComponent.remove()
    })

    buttonTheme.addEventListener('click', ()=> {
        const theme = buttonTheme.getAttribute('data-theme')
        buttonTheme.setAttribute('data-theme', theme == 'light' ? 'dark' : 'light')
        buttonTheme.innerHTML = theme == 'light' ? icon.sun : icon.moon

        localStorage.setItem('theme', theme == 'light' ? 'dark' : 'light')
        settingTheme()
    })

    buttonLogout.addEventListener('click', ()=> {
        const queries = {
            token : localStorage.getItem('auth-token'),
            action: 'logout'
        }

        fetch(api(`/api/auth?${ paramQueries( queries ) }`), { method : 'POST' })
            .then( res => res.json() )
            .then( res => {
                if( res ) {
                    localStorage.removeItem('auth-token')
                    location.hash = '#/login'
                }
            } ) 
    })

    addEventListener('popstate', ()=> {
        ElementComponent.remove()

        elementUser.innerHTML = `
            <img src="${ api(`/storage/user/${ window.dataApp.user.avatar || 'avatar.png' }`) }">
            <div>
                <span class="text-ellipsis">${ window.dataApp.user.fullname }</span>
                <p class="text-ellipsis">${ Position.find( position => position.id ==  window.dataApp.user.position).name }</p>
            </div>
        `
    })

    return ElementComponent
}