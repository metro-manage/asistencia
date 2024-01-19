export default (login = true)=>{

    const api =(uri = '')=> window.dataApp.api + uri
    const paramQueries = (query = {}) => Object.keys(query).map(key => `${ key }=${ query[key] }`).join('&')

    const Icon = window.dataApp.icon

    const ElementComponent = ele.create(`
        <div class="div_txGdK5a">
            <div id="closeElement" class="div_0jRV4oo"></div>
            <div class="div_5S0v3rr scroll-y">
                <div class="div_6K15oiR">
                    <h3>${ login ? 'Inicio de sesion' : 'Registro' }</h3>
                    <button type="button" id="buttonCloseElement" class="button_0530xdO pointer">${ Icon.get('fi fi-rr-cross-small') }</button>
                </div>
                <form id="form" class="form_Wjg689O" autocomplete="off">
                    <div class="div_3N51Srm">
                        ${ login ? '<input type="hidden" name="method" value="email">' : `                                      
                            <div class="div_RRjPQLY">
                                <input type="text" name="fullname" placeholder="nombre" autocomplete="off">
                            </div>
                        ` }
                        <div class="div_RRjPQLY">
                            <input type="text" name="email" placeholder="correo" autocomplete="off">
                        </div>
                        <div class="div_RRjPQLY">
                            <input type="password" name="password" placeholder="contraseña" autocomplete="off">
                        </div>
                        ${ login ? '' : `                 
                            <div class="div_RRjPQLY">
                                <input type="text" name="code" placeholder="codigo" autocomplete="off">
                            </div>
                        ` }
                    </div>
                    <div class="div_jmyxzzW">
                        <button type="submit" class="pointer">${ login ? 'Ingresar' : 'Crear cuenta' }</button>
                    </div>
                </form>
            </div>
        </div>
    `)

    const element = ele.object( ElementComponent.querySelectorAll('[id]'), 'id', true )
    const { closeElement , form, buttonCloseElement} = element

    const alert = new Alert(document.getElementById('root'))

    closeElement.addEventListener('click', ()=> {
        ElementComponent.remove()
    })

    buttonCloseElement.addEventListener('click', ()=> {
        ElementComponent.remove()
    })

    form.addEventListener('submit', e=> {
        e.preventDefault()

        if( login ) {
            const data = {
                method : form.method.value,
                value  : form.email.value,
                password : form.password.value
            }

            const queries = {
                action : 'login',
                to : 'admin'
            }

            fetch( api(`/api/auth?${ paramQueries( queries ) }`), { method : 'POST', body : JSON.stringify( data ) } )
                .then( res => res.json() )
                .then(res => {
                    if( res.status) { 
                        localStorage.setItem('auth-token', res.token)
                        location.hash = '#/'
                    } else alert.show({ message : res.message ?? 'Error al Ingresar' })

                })

        } else {
            const data = {
                auth  : {
                    password : form.password.value.trim()
                },
                user  : {
                    fullname: form.fullname.value.trim(),
                    email   : form.email.value.trim(),
                    phone   : null,
                }
    
            }

            const queries = {
                action : 'register',
                code : form.code.value
            }

            fetch( api(`/api/auth?${ paramQueries( queries ) }`), { method : 'POST', body : JSON.stringify( data ) } )
                .then( res => res.json() )
                .then(res => {

                    if(res && res.status) { 
                        localStorage.setItem('auth-token', res.token)
                        location.hash = '#/'
                    } else alert.show({ message : res.message ?? 'ocurrio un error' })

                })
 
        } 
        
    })

    return ElementComponent
}