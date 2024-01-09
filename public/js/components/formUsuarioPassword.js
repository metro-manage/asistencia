export default (add = true )=>{

    const api =(uri = '')=> window.dataApp.api + uri
    const paramQueries = (query = {}) => Object.keys(query).map(key => `${ key }=${ query[key] }`).join('&')

    const params    = window.dataLib.params
    const Icon      = window.dataApp.icon

    const ElementComponent = ele.create(`
        <div class="div_txGdK5a">
            <div id="closeElement" class="div_0jRV4oo"></div>
            <div class="div_5S0v3rr scroll-y">
                <div class="div_6K15oiR">
                    <h3>Actualizar</h3>
                    <button type="button" id="buttonCloseElement" class="button_0530xdO pointer">${ Icon.get('fi fi-rr-cross-small') }</button>
                </div>
                <form id="form" class="form_Wjg689O" autocomplete="off">
                    <div class="div_3N51Srm">
                        <div class="div_RRjPQLY">
                            <input type="password" name="password" placeholder="Contraseña" autocomplete="off">
                        </div> 
                    </div>
                    <div class="div_jmyxzzW">
                        <button type="submit" class="pointer">Actualizar</button>
                    </div>
                </form>
            </div>
        </div>
    `)

    const element = ele.object( ElementComponent.querySelectorAll('[id]'), 'id', true )
    const { closeElement , form, buttonCloseElement} = element

    const elementAlert = new Alert(document.getElementById('root'))

    closeElement.addEventListener('click', ()=> {
        ElementComponent.remove()
    })

    buttonCloseElement.addEventListener('click', ()=> {
        ElementComponent.remove()
    })

    form.addEventListener('submit', e=> {
        e.preventDefault()

        const data = {
            password : form.password.value ?? ''
        }

        form.password.value = ''

        const queries = {
            token : localStorage.getItem('auth-token'),
            uid_user    : params.id
        }

        fetch( api(`/api/auth?${ paramQueries( queries ) }`), { method : 'PATCH', body : JSON.stringify( data ) } )
                .then( res => res.json() )
                .then(res => {
                    ElementComponent.dispatchEvent(new CustomEvent('_submit', { detail: { status : res } }))
                    if(res) elementAlert.show({ message : 'actualizado correctamente', name : 'success' })
                    else elementAlert.show({ message : 'no se pudo actualizar', name : 'warning' })
                })
                 
    })

    return ElementComponent
}