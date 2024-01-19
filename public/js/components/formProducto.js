import Position from "../data/Position.js"
import Gender from "../data/Gender.js"
import Month from "../data/Month.js"

import calendar from "./calendar.js"
import options from "./options.js"

export default (add = true, data = {})=>{
    const api =(uri = '')=> window.dataApp.api + uri
    const paramQueries = (query = {}) => Object.keys(query).map(key => `${ key }=${ query[key] }`).join('&')

    const params    = window.dataLib.params
    const Icon      = window.dataApp.icon

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
                            <input type="hidden" name="img">
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
                            <input type="text" name="sap" placeholder="sap" autocomplete="off">
                        </div>
                        <div class="div_RRjPQLY">
                            <input type="text" name="ean" placeholder="ean" autocomplete="off">
                        </div> 
                        <div class="div_RRjPQLY">
                            <input type="text" name="description" placeholder="descripcion" autocomplete="off">
                        </div>
                        <div class="div_RRjPQLY">
                            <input type="text" name="datetime_expirate" placeholder="fecha de vencimiento" autocomplete="off">
                        </div>
                        <div class="div_RRjPQLY">
                            <input type="text" name="id_categoria" placeholder="categoria" autocomplete="off">
                        </div>
                        <div class="div_RRjPQLY">
                            <input type="text" name="id_marca" placeholder="marca" autocomplete="off">
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
        datetime_expirate : calendar( data.datetime_expirate ),
        id_categoria : options( 'categoria', data.id_categoria ),
        id_marca   : options( 'marca', data.id_marca )
    }

    let fileImage = null

    if( !add ) {

        form.querySelectorAll('input').forEach(element => {
            
            if( element.name == 'img' ) {
                if( data[ element.name ] ) {
                    containerImageElement.innerHTML = `
                        <div class="div_4RCIRxr">
                            <img src="${ api(`/storage/productos/${ data[ element.name ] }`) }" class="img_zEgR0X2" alt="img-producto">
                            <button type="button" class="button_C96kN0x" >${ Icon.get('fi fi-rr-cross-small') }</button>
                        </div>
                    `
                }
            }

            if( element.name == 'datetime_expirate' ) {
                const datetime = new Date( data[ element.name ] )
                element.value = `${ datetime.getDate() } ${ Month[ datetime.getMonth() ] } ${ datetime.getFullYear() }`
            }

            else if( element.name == 'id_categoria' ) {
                const categoria = JSON.parse( data.data_categoria ).name
                element.value = categoria
            }

            else if( element.name == 'id_marca' ) {
                const marca = JSON.parse( data.data_marca ).name
                element.value = marca
            }
 
            else if( element.name == 'status' ) {
                element.checked = data[ element.name ]
            }

            else {
                element.value = data[ element.name ] ?? ''
            }

            
        })

    }

    Array.from([ form.datetime_expirate, form.id_categoria, form.id_marca ]).forEach(element => {
        element.setAttribute( 'data-value', data[ element.name ] ?? '')
        element.setAttribute( 'readonly', '')

        element.addEventListener('click', ()=> {
            main.append( elements[ element.name ] )
        })
    })

    elements.datetime_expirate.addEventListener('_change', (e)=> {
        const datetime = new Date( e.detail.datetime ) 
        form.datetime_expirate.value = `${ datetime.getDate() } ${ Month[ datetime.getMonth() ] } ${ datetime.getFullYear() }`
        form.datetime_expirate.dataset.value = e.detail.datetime 
    })

    elements.id_categoria.addEventListener('_change', (e)=> {
        const data = e.detail.data
        form.id_categoria.value = data.name
        form.id_categoria.dataset.value = data.id
    })

    elements.id_marca.addEventListener('_change', (e)=> {
        const data = e.detail.data
        form.id_marca.value = data.name
        form.id_marca.dataset.value = data.id
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

            form.img.value = ''
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
                        <button type="button" class="button_C96kN0x pointer" >${ Icon.get('fi fi-rr-cross-small') }</button>
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
            img : form.img.value,
            sap : form.sap.value ?? null,
            ean : form.ean.value ?? '',
            description : form.description.value ?? '',
            id_categoria : form.id_categoria.dataset.value ?? '',
            id_marca : form.id_marca.dataset.value ?? '',
            datetime_expirate : form.datetime_expirate.dataset.value,
            status   : form.status.checked ? 1 : 0
        }

        const queries = {
            token : localStorage.getItem('auth-token'),
            id    : params.id
        }

        const submit = () =>{
            if( add ) {
                delete queries.id
                
                fetch( api(`/api/producto?${ paramQueries(queries) }`), { method : 'POST', body : JSON.stringify( data ) } )
                    .then( res => res.json() )
                    .then(res => {
                        console.log(res)
                        ElementComponent.dispatchEvent(new CustomEvent('_submit', { detail: { status : res.status } }))
                        if(res.status ) {
                            fileImage = null
                            elementAlert.show({ message : 'Agregado correctamente', name : 'success' })
                        } 
                        else elementAlert.show({ message : res.message ?? 'Error al agregar', name : 'warning'  }) 
                    })
            } else {
               
                fetch( api(`/api/producto?${ paramQueries(queries) }`),  { method : 'PATCH', body : JSON.stringify( data ) } )
                    .then( res => res.json() )
                    .then(res => {
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
            fetch(api('/api/files?to=product'), {
                method : 'POST',
                body   : objectFormData({
                    file : fileImage
                })
            })
                .then(res => res.json())
                .then(res => {
                    if( res.status ) {
                        data.img = res.name
                        submit()
                    }
                })
        } else {
            submit()
        }
    })

  
    return ElementComponent
}
