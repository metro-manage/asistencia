import option from "./option.js"

export default ()=>{

    const api =(uri = '')=> window.dataApp.api + uri
    const paramQueries = (query = {}) => Object.keys(query).map(key => `${ key }=${ query[key] }`).join('&')

    const Icon = window.dataApp.icon
    const params = window.dataLib.params

    const ElementComponent = ele.create(`
        <div class="div_42I5qPU">
            <div id="closeElement" class="div_17oF1YJ"></div>
            <div class="div_FS22BJ7">
                <div class="div_82XMPG6">
                    <div id="tabsElement" class="div_Sp09eL8">
                        <span class="pointer focus" data-type="agregados">${ Icon.get('fi fi-rr-users') }</span>
                        <span class="pointer" data-type="removidos">${ Icon.get('fi fi-rr-user-slash') }</span> 
                    </div>
                    <input type="text" class="input_qsHnP2S" placeholder="buscar" style="display:none">
                </div>
                <div id="elementItem" class="div_yi13dGk scroll-y">
                    <div id="elementItemData" class="div_5d6X5X2" data-type="agregados"></div>
                </div>
            </div>
        </div>
    `)

    const elements = ele.object( ElementComponent.querySelectorAll('[id]'), 'id', true )
    const { closeElement, tabsElement, elementItem, elementItemData } = elements

    const main = document.getElementById('main')

    const elementHelp = document.createElement('div')
    const elementOptionAsistencisUser1 = option('asistencia_user', ['remove'])
    const elementOptionAsistencisUser2 = option('asistencia_user', ['set', 'delete'])

    elementOptionAsistencisUser1.addEventListener('_click', e => {
        const action = e.detail.action

        const queries = {
            token : localStorage.getItem('auth-token'),
            id : elementOptionAsistencisUser1.getAttribute('data-id')
        }

        if( action == 'remove' ) {
            fetch( api(`/api/asistencia-user?${ paramQueries( queries ) }`), { method : 'PATCH', body : JSON.stringify({ status : 2 }) } )
                .then( res => res.json() )
                .then( res => {
                    if( res ) dataLoad( elementItemData.getAttribute('data-type') )
                })
        } 
    })

    elementOptionAsistencisUser2.addEventListener('_click', e => {
        const action = e.detail.action

        const queries = {
            token : localStorage.getItem('auth-token'),
            id : elementOptionAsistencisUser2.getAttribute('data-id')
        }

        if( action == 'delete' ) {
            fetch( api(`/api/asistencia-user?${ paramQueries( queries ) }`), { method : 'DELETE' } )
                .then( res => res.json() )
                .then( res => {
                    if( res ) dataLoad( elementItemData.getAttribute('data-type') )
                })
        }

        else if( action == 'set' ) {
            fetch( api(`/api/asistencia-user?${ paramQueries( queries ) }`), { method : 'PATCH', body : JSON.stringify({ status : 1 }) } )
                .then( res => res.json() )
                .then( res => {
                    if( res ) dataLoad( elementItemData.getAttribute('data-type') )
                })
        }
    })

    closeElement.addEventListener('click', ()=> {
        ElementComponent.remove()
    })

    tabsElement.addEventListener('click', e => {
        const span = e.target.closest('span')

        if( span ) {
            ( tabsElement.querySelector('.focus') || elementHelp ).classList.remove('focus')
            span.classList.add('focus')

            elementItemData.setAttribute('data-type', span.getAttribute('data-type'))
            dataLoad( span.getAttribute('data-type') )
        }
    })

    elementItemData.addEventListener('click', e => {
        const button = e.target.closest('button')

        if( button ) {

            if( elementItemData.getAttribute('data-type') == 'agregados' ) {

                elementOptionAsistencisUser1.setAttribute('data-id', button.getAttribute('data-id'))
                main.append( elementOptionAsistencisUser1 )

            }

            else if( elementItemData.getAttribute('data-type') == 'removidos' ) {

                elementOptionAsistencisUser2.setAttribute('data-id', button.getAttribute('data-id'))
                main.append( elementOptionAsistencisUser2 )
                
            }

           
        }
    })

    const dataRender =( Data = [] )=>{
        if( !Data.length ) {
            return elementItem.innerHTML = `
                <div class="div_80euglIeYkNE39v">
                    ${ Icon.get('icon-light box-empty') }
                    <h3>Lista vacia</h3>
                </div>
            `
        }

        elementItemData.innerHTML = Data.map( data => {
            data.data_user = JSON.parse( data.data_user )

            return `
                <div class="div_nb14LIz">
                    <img src="${ api(`/storage/user/${ data.data_user.avatar || 'avatar.png' }`) }">
                    <span>${ data.data_user.fullname } ${ data.data_user.lastname }</span>
                    <button class="button_0530xdO" data-id="${ data.id }">${ Icon.get('fi fi-rr-menu-dots-vertical') }</button>
                </div>
            `
            
        } ).join('')

        elementItem.innerHTML = ''
        elementItem.append( elementItemData )
    }

    const dataLoad =( type )=>{

        const queries = {
            token : localStorage.getItem('auth-token'),
            query : 1,
            query_limit : 50,
            id_asistencia : params.id,
        }

        if( type == 'agregados' ) { 
            queries.status = 1

            fetch( api(`/api/asistencia-user?${ paramQueries( queries ) }`) )
                .then( res => res.json() )
                .then( dataRender )
        }
        else if( type == 'removidos' ) {
            queries.status = 2

            fetch( api(`/api/asistencia-user?${ paramQueries( queries ) }`) )
                .then( res => res.json() )
                .then( dataRender )
        }
    }

    dataLoad( 'agregados' )
    
    return ElementComponent
}

  