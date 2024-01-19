import Position from "../data/Position.js"
import Gender from "../data/Gender.js"
import Month from "../data/Month.js"

import calendar from "./calendar.js"
import options from "./options.js"

export default (add = true, data = {})=>{
    const api =(uri = '')=> window.dataApp.api + uri
    const paramQueries = (query = {}) => Object.keys(query).map(key => `${ key }=${ query[key] }`).join('&')

    const params = window.dataLib.params
    const user  = window.dataApp.user
    const Icon = window.dataApp.icon

    const ElementComponent = ele.create(`
        <div class="div_txGdK5a">
            <div id="closeElement" class="div_0jRV4oo"></div>
            <div class="div_5S0v3rr big scroll-y">
                <div class="div_6K15oiR">
                    <h3>${ add ? 'Agregar' : 'Actualizar' }</h3>
                    <button type="button" id="buttonCloseElement" class="button_0530xdO pointer">${ Icon.get('fi fi-rr-cross-small') }</button>
                </div>
                <form id="form" class="form_Wjg689O" autocomplete="off">
                    <div class="div_3N51Srm">
                        <div style="display:none">
                            <input type="hidden" name="avatar">
                        </div>
                        <div class="div_RRjPQLY scroll-x" style="padding:15px">
                            <div class="div_ds7Y513">
                                <label class="label_z8DTJA7 pointer">
                                    <input type="file" name="image" accept="image/*">
                                    <span>${ Icon.get('fi fi-rr-plus') }</span>
                                </label>
                                <div id="containerImageElement" class="div_Iaf1Qwz"></div>
                            </div>
                        </div>
                        <div class="div_RRjPQLY">
                            <input type="text" name="fullname" placeholder="nombre" autocomplete="off">
                        </div>
                        <div class="div_RRjPQLY">
                            <input type="text" name="lastname" placeholder="apellido" autocomplete="off">
                        </div> 
                        <div class="div_RRjPQLY">
                            <input type="text" name="email" placeholder="correo" autocomplete="off">
                        </div>
                        <div class="div_RRjPQLY">
                            <input type="text" name="phone" placeholder="telefono" autocomplete="off">
                        </div>
                        <div class="div_RRjPQLY">
                            <input type="text" name="password" placeholder="contraseña" autocomplete="off">
                        </div>
                        <div class="div_RRjPQLY">
                            <input type="text" name="birthdate" placeholder="fecha de nacimiento" autocomplete="off">
                        </div>
                        <div class="div_RRjPQLY">
                            <input type="text" name="position" placeholder="posicion" autocomplete="off">
                        </div>
                        <div class="div_RRjPQLY">
                            <input type="text" name="gender" placeholder="genero" autocomplete="off">
                        </div>
                        <div class="div_RRjPQLY">
                            <div class="div_UA3v267">
                                <span class="span_Q60Cjey">Habilitar</span>
                                <label class="toggle">
                                    <input type="checkbox" name="status" id="inputToogle" checked>
                                    <span></span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="div_jmyxzzW">
                        <button type="submit" class="pointer">${ add ? 'Agregar' : 'Actualizar' }</button>
                    </div>
                </form>
            </div>
        </div>
    `)

    const element = ele.object( ElementComponent.querySelectorAll('[id]'), 'id', true )
    const { closeElement , form, buttonCloseElement, containerImageElement } = element

    const main = document.getElementById('main')

    const elementAlert = new Alert( main )

    const elements = {
        birthdate : calendar( data.birthdate ),
        position : options( 'position', data.position ),
        gender   : options( 'gender', data.gender )
    }

    let fileImage = null

    if( !add ) {

        form.querySelectorAll('input').forEach(element => {


            if( element.name == 'avatar' ) {
                if( data[ element.name ] ) {
                    containerImageElement.innerHTML = `
                        <div class="div_4RCIRxr">
                            <img src="${ api(`/storage/user/${ data[ element.name ] }`) }" class="img_zEgR0X2" alt="img-producto">
                            <button type="button" class="button_C96kN0x" >${ Icon.get('fi fi-rr-cross-small') }</button>
                        </div>
                    `
                }
            }

            if( element.name == 'birthdate' ) {
                const datetime = new Date( data[ element.name ] )
                element.value = `${ datetime.getDate() } ${ Month[ datetime.getMonth() ] } ${ datetime.getFullYear() }`
            }

            else if( element.name == 'position' ) {
                element.value = Position.find( position => position.id ==  data[ element.name ]).name
            }

            else if( element.name == 'gender' ) {
                element.value = (Gender.find( gender => gender.id ==  data[ element.name ]) ?? {}).name ?? '-'
            }

            else if( element.name == 'password' ) {
                element.parentElement.remove()
            }

            else if( element.name == 'status' ) {
                element.checked = data[ element.name ]
            }

            else {
                element.value = data[ element.name ] ?? ''
            }

            
        })

    }

    Array.from([ form.birthdate, form.position, form.gender ]).forEach(element => {
        element.setAttribute( 'data-value', data[ element.name ] ?? '')
        element.setAttribute( 'readonly', '')

        element.addEventListener('click', ()=> {
            main.append( elements[ element.name ] )
        })
    })

    elements.birthdate.addEventListener('_change', (e)=> {
        const datetime = new Date( e.detail.datetime ) 
        form.birthdate.value = `${ datetime.getDate() } ${ Month[ datetime.getMonth() ] } ${ datetime.getFullYear() }`
        form.birthdate.dataset.value = e.detail.datetime 
    })

    elements.position.addEventListener('_change', (e)=> {
        const data = e.detail.data
        form.position.value = data.name
        form.position.dataset.value = data.id
    })

    elements.gender.addEventListener('_change', (e)=> {
        const data = e.detail.data
        form.gender.value = data.name
        form.gender.dataset.value = data.id
    })

    closeElement.addEventListener('click', ()=> {
        ElementComponent.remove()
    })

    buttonCloseElement.addEventListener('click', ()=> {
        ElementComponent.remove()
    })

    containerImageElement.addEventListener('click', e => {
        
        const button = e.target.closest('button')

        if( button ) {
            button.closest('.div_4RCIRxr').remove()
            fileImage = null

            form.avatar.value = ''
        }

    })

    form.image.addEventListener('change', e => {

        const files = e.target.files
        
        if( files.length ) {
            for (const file of files) {
            fileImage = file
            const fileLoad = new FileLoad(file)
            fileLoad.load(()=> {

                containerImageElement.innerHTML = `
                    <div class="div_4RCIRxr">
                        <img src="${ URL.createObjectURL(file) }" class="img_zEgR0X2" alt="img-producto">
                        <button type="button" class="button_C96kN0x" >${ Icon.get('fi fi-rr-cross-small') }</button>
                    </div>
                `

            })
            fileLoad.start()

            }
        } 
    })

    form.addEventListener('submit', e => {
        e.preventDefault()

        const data = {
            user : {
                avatar   : form.avatar.value,
                fullname : form.fullname.value ?? '',
                lastname : form.lastname.value ?? '',
                email : form.email.value ?? '',
                phone : form.phone.value ?? '',
                birthdate : form.birthdate.dataset.value ?? '',
                gender : form.gender.dataset.value ?? '',
                position : form.position.dataset.value ?? '',
                status   : form.status.checked ? 1 : 0
            }
        }

        const queries = {
            token : localStorage.getItem('auth-token'),
            uid    : params.id || user.uid
        }

        const submit = () =>{
            if( add ) {
                delete queries.uid

                data.auth =  {
                    password : form.password.value ?? ''
                }
                
                fetch( api(`/api/user?${ paramQueries(queries) }`), { method : 'POST', body : JSON.stringify( data ) } )
                    .then( res => res.json() )
                    .then(res => {
                        ElementComponent.dispatchEvent(new CustomEvent('_submit', { detail: { status : res.status } }))
                        if(res.status) {
                            fileImage = null
                            elementAlert.show({ message : 'Agregado correctamente', name : 'success' })
                        } 
                        else elementAlert.show({ message : res.message ?? 'Error al agregar', name : 'warning'  }) 
                    })
            } else {
               
                fetch( api(`/api/user?${ paramQueries(queries) }`),  { method : 'PATCH', body : JSON.stringify( data.user ) } )
                    .then( res => res.json() )
                    .then(res => {
                        console.log(res);
                        ElementComponent.dispatchEvent(new CustomEvent('_submit', { detail: { status : res.status } }))
                        if(res.status ) {
                            fileImage = null
                            elementAlert.show({ message : 'Actualizado correctamente', name : 'success' })
                        }
                        else elementAlert.show({ message : res.message ?? 'Error al actualizar', name : 'warning' })
                    }) 
            }
        }

        if( fileImage ) {
            fetch(api('/api/files?to=user'), {
                method : 'POST',
                body   : objectFormData({
                    file : fileImage
                })
            })
                .then(res => res.json())
                .then(res => {
                    if( res.status ) {
                        data.user.avatar = res.name
                        submit()
                    }
                })
        } else {
            submit()
        }
    })

  
    return ElementComponent
}
