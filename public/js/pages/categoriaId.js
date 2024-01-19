import option from "../components/option.js"
import confirm from "../components/confirm.js"

import formCategoria from "../components/formCategoria.js"

export default ( params )=>{

    const api =(uri = '')=> window.dataApp.api + uri
    const paramQueries = (query = {}) => Object.keys(query).map(key => `${ key }=${ query[key] }`).join('&')

    const Icon = window.dataApp.icon

    const Title = [
        { key : 'id', title : 'ID' },
        { key : 'name', title : 'Nombre' },
        { key : 'total_producto', title : null },
    ]

    let isDataLoad = false
 
    const ElementComponent = ele.create(`
        <div class="div_FJZ0jdm">

            <header id="header" class="header_N8p7RP6">
                    
                <div class="div_349Zfgp scroll-h">
                    <a href="#/categoria" class="button_0530xdO pointer">${ Icon.get('fi fi-rr-angle-left') }</a>
                    <h4 class="text-ellipsis">Informacion de categoria</h4>
                </div>

                <div id="elementButton" class="div_div_wEan0TY">
                    <button id="buttonOption" class="button_0530xdO pointer">${ Icon.get('fi fi-rr-menu-dots-vertical') }</button>
                </div>

            </header>

            <div id="elementItem" class="div_f0Au33C scroll-y" style="padding:15px">

                <div id="elementItemLoad" class="element-loader" style="--color:var(--color-letter)"></div>
                <div id="elementItemNull" class="div_CgtrSP7">
                    ${ Icon.get('icon-light box-empty') }
                    <h3>El elemento no existe</h3>
                </div>
                <div id="elementItemData" class="div_k10Bfb0"></div>

            </div>

        </div>
    `)

    const { 
        header,
        elementButton,
        elementItem, 
        elementItemLoad,
        elementItemNull,
        elementItemData, 
        buttonOption 
    } = ele.object( ElementComponent.querySelectorAll('[id]'), 'id', true )

    const elements = {
        main  : document.getElementById('main'),
        option : option('categoria', ['*']),
        form   : '',
        confirm : confirm( { message : '¿ Desea Eliminar ?' } )
    }

    const elementAlert      = new Alert(elements.main)
 
    elements.option.addEventListener('_click', e => {

        const action = e.detail.action

        elements.main.append(
            action == 'update' ? elements.form : '',
            action == 'delete' ? elements.confirm : ''
        )

    })

    elements.confirm.addEventListener('_click', ()=> {

        const queries = {
            token : localStorage.getItem('auth-token'),
            id    : params.id
        }

        fetch( api(`/api/categoria?${ paramQueries( queries ) }`), { method : 'DELETE' } )
            .then( res => res.json() )
            .then(res => {
                if(res) {
                    location.hash = '#/categoria'
                }
                else elementAlert.show({ message : 'Error al eliminar' })
            }) 

    })

    buttonOption.addEventListener('click', ()=> {
        elements.main.append( elements.option )
    })

    const dataRenderElementItemData =( data = null )=>{

        elementItemData.innerHTML = Title.map( _data => {

            const { key, title } = _data
            const value = data[ key ]

            if( key == 'total_producto' ) {

                return `
                    <div class="div_juBP4RD">
                        <div class="div_54728o4">
                            <a href="#" class="a_QRU7rhQ">${ value } productos</a>
                        </div>
                    </div>
                `

            }

            return `
                <div class="div_juBP4RD">
                    <div class="div_20gl6i6">
                        <span>${ title }</span>
                        <p>${ value }</p>
                    </div>
                </div>
            `

        }).join('')

        if( elements.form == '' ) {
            elements.form = formCategoria( false, data )
            elements.form.addEventListener('_submit', e => {
                elements.form.remove()
                if (e.detail.status) {
                    dataLoadElementItem()
                }
            }) 
        }

        return elementItemData
    }

    const dataRenderElementItem = ( data = null ) =>{

        header.append(
            data && Object.keys( data ).length ? elementButton : ''
        )

        elementItem.innerHTML = ''
        elementItem.append(
            data === 0 ? elementItemLoad : '',
            data === null ? elementItemNull : '',
            data && Object.keys( data ).length ? dataRenderElementItemData(data) : ''
        )
        
    }

    const dataLoadElementItem = async ()=>{
        
        const queries = {
            token : localStorage.getItem('auth-token'),
            query : 1,
            query_limit : 'one',
            id    : params.id,
        }

        fetch( api(`/api/categoria?${ paramQueries( queries ) }` ))
            .then( res => res.json() )
            .then( dataRenderElementItem )
        
    }

    dataRenderElementItem(0)
    dataLoadElementItem()

    Array.from([ elementButton ]).forEach( element => element.remove() )

    return ElementComponent

}