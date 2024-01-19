import option from "../components/option.js"
import confirm from "../components/confirm.js"

import formUsuario from "../components/formUsuario.js"
import formUsuarioPassword from "../components/formUsuarioPassword.js"

import Gender from "../data/Gender.js"
import Position from "../data/Position.js"
import Month from "../data/Month.js"

export default ( params )=>{

    const api =(uri = '')=> window.dataApp.api + uri
    const paramQueries = (query = {}) => Object.keys(query).map(key => `${ key }=${ query[key] }`).join('&')

    const Icon = window.dataApp.icon

    const Title = [
        { key : 'avatar', title : null },
        { key : 'fullname', title : 'Nombre' },
        { key : 'lastname', title : 'Apellido' },
        { key : 'email', title : 'Correo' },
        { key : 'phone', title : 'Telefono' },
        { key : 'birthday', title : 'Fecha de nacimiento' },
        { key : 'gender', title : 'Genero' },
        { key : 'position', title : 'Posicion' },
    ]

    const ElementComponent = ele.create(`
        <div class="div_FJZ0jdm">

            <header id="header" class="header_N8p7RP6">
                    
                <div class="div_349Zfgp scroll-h">
                    <a href="#/usuario" class="button_0530xdO pointer">${ Icon.get('fi fi-rr-angle-left') }</a>
                    <h4 class="text-ellipsis">Informacion de usuario</h4>
                </div>

                <div id="elementButton" class="div_div_wEan0TY">
                    <button id="buttonOption" class="button_0530xdO pointer">${ Icon.get('fi fi-rr-menu-dots-vertical') }</button>
                </div>

            </header>

            <div id="elementItem" class="div_f0Au33C scroll-y" style="padding:15px">

                <div id="elementItemLoad" class="element-loader" style="--color:var(--color-letter)"></div>
                <div id="elementItemNull" class="div_CgtrSP7">
                    ${ Icon.get('icon-light box-empty') }
                    <h3>El usuario no existe</h3>
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
        main    : document.getElementById('main'),
        form    : '',
        form2   : formUsuarioPassword(),
        option  : option('usuario', ['*']),
        confirm : confirm( { message : '¿ Desea Eliminar ?' } ),
    }

    elements.option.addEventListener('_click', e => {
        const action = e.detail.action

        elements.main.append(
            action == 'update' ? elements.form : '',
            action == 'update_password' ? elements.form2 : '',
            action == 'delete' ? elements.confirm : ''
        )
    })

    elements.confirm.addEventListener('_click', ()=> {

        const queries = {
            token : localStorage.getItem('auth-token'),
            uid    : params.id
        }

        fetch( api(`/api/user?${ paramQueries( queries ) }`), { method : 'DELETE' } )
            .then( res => res.json() )
            .then(res => {
                if(res) {
                    location.hash = '#/usuario'
                }
                else elementAlert.show({ message : 'Error al eliminar' })
            }) 

    })

    elements.form2.addEventListener('_submit', () => {
        elements.form2.remove() 
    })

    buttonOption.addEventListener('click', ()=> {
        elements.main.append( elements.option )
    })

    const dataRenderElementItemData =( data = {} )=>{

        elementItemData.innerHTML = Title.map( title => {
            
            if( title.key == 'avatar' ) {
                
                return `
                    <div class="div_juBP4RD scroll-x" style="padding:15px">
                        <div class="div_5D21Kk4">
                            <img src="${ api(`/storage/user/${ data[ title.key  ] || 'avatar.png' }`) }">
                        </div>
                    </div>
                `
            }

            else if( title.key == 'birthdate' ) {

                const datetime = new Date( data[ title.key  ] )

                return `
                    <div class="div_juBP4RD scroll-x">
                        <div class="div_juBP4RD">
                            <div class="div_20gl6i6">
                                <span>${ title.title }</span>
                                <p>${ datetime.getDate() } ${ Month[ datetime.getMonth() ] } ${ datetime.getFullYear() }</p>
                            </div>
                        </div>
                    </div>
                `
            }

            else if( title.key == 'gender' ) {

                return `
                    <div class="div_juBP4RD">
                        <div class="div_20gl6i6">
                            <span>${ title.title }</span>
                            <p>${ (Gender.find( gender => gender.id ==  data[ title.key  ]) ?? {}).name ?? '-' }</p>
                        </div>
                    </div>
                `

            }

            else if( title.key == 'position' ) {

                return `
                    <div class="div_juBP4RD">
                        <div class="div_20gl6i6">
                            <span>${ title.title }</span>
                            <p>${ Position.find( position => position.id ==  data[ title.key  ]).name }</p>
                        </div>
                    </div>
                `

            }

            return `
                <div class="div_juBP4RD">
                    <div class="div_20gl6i6">
                        <span>${ title.title }</span>
                        <p>${ data[ title.key  ] || '-' }</p>
                    </div>
                </div>
            `

        }).join('')

        if( elements.form == '' ) {
            elements.form = formUsuario( false, data )

            elements.form.addEventListener('_submit', e => {
                elements.form.remove()
    
                if (e.detail.status) {
                    dataLoadElementItem()
                }
            })

        }

        return elementItemData
    }

    const dataRenderElementItem =( data = null )=>{

        header.append(
            data && Object.keys(data).length ? elementButton : '' 
        )

        elementItem.innerHTML = ''
        elementItem.append(
            data === 0 ? elementItemLoad : '',
            data === null ? elementItemNull : '',
            data && Object.keys(data).length ? dataRenderElementItemData( data ) : ''
        )

    }

    const dataLoadElementItem =()=>{

        elementItem.innerHTML = '<div class="container-loader"><span class="loader"></span></div>'

        const queries = {
            token : localStorage.getItem( 'auth-token' ),
            query : 0,
            query_limit : 'one',
            uid    : params.id,
        }

        fetch( api(`/api/user?${ paramQueries( queries ) }`) )
            .then( res => res.json() )
            .then( dataRenderElementItem )

    }

    dataRenderElementItem( 0 )
    dataLoadElementItem()

    Array.from([ elementButton ]).forEach( element => element.remove() )
    
    return ElementComponent

}