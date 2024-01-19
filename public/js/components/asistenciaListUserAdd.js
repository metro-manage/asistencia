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
                        <span class="pointer focus" data-type="no-agregados">${ Icon.get('fi fi-rr-users') }</span>
                    </div>
                    <input type="text" class="input_qsHnP2S" placeholder="buscar" style="display:none">
                </div>
                <div id="elementItem" class="div_yi13dGk scroll-y">
                    <div id="elementItemData" class="div_5d6X5X2"></div>
                </div>
            </div>
        </div>
    `)

    const elements = ele.object( ElementComponent.querySelectorAll('[id]'), 'id', true )
    const { closeElement, tabsElement, elementItem, elementItemData } = elements

    const elementHelp = document.createElement('div')
    
    const elementOptionAsistencisUser = option('asistencia_user', ['add'])

    closeElement.addEventListener('click', ()=> {
        ElementComponent.remove()
    })

    elementOptionAsistencisUser.addEventListener('_click', e => {
        const action = e.detail.action

        const queries = {
            token : localStorage.getItem('auth-token')
        }

        if( action == 'add' ) {
            fetch( api(`/api/asistencia-user?${ paramQueries( queries ) }`), { method : 'POST', body : JSON.stringify({ id_asistencia : params.id, uid_user : elementOptionAsistencisUser.getAttribute('data-uid'), status : 1 }) } )
                .then( res => res.json() )
                .then( res => {
                    if( res ) dataLoad( 'no-agregados' )
                } )
        } 
    })

    tabsElement.addEventListener('click', e => {
        const span = e.target.closest('span')

        if( span ) {
            ( tabsElement.querySelector('.focus') || elementHelp ).classList.remove('focus')
            span.classList.add('focus')

            dataLoad( span.getAttribute('data-type') )
        }
    })

    elementItemData.addEventListener('click', e => {
        const button = e.target.closest('button')

        if( button ) {

            elementOptionAsistencisUser.setAttribute('data-uid', button.getAttribute('data-uid'))
            main.append( elementOptionAsistencisUser )
           
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

            return `
                <div class="div_nb14LIz">
                    <img src="${ api(`/storage/user/${ data.avatar || 'avatar.png' }`) }">
                    <span>${ data.fullname } ${ data.lastname }</span>
                    <button class="button_0530xdO" data-uid="${ data.uid }">${ Icon.get('fi fi-rr-menu-dots-vertical') }</button>
                </div>
            `
            
        } ).join('')

        elementItem.innerHTML = ''
        elementItem.append( elementItemData )
    }

    const dataLoad =( type )=>{

        const queries = {
            token : localStorage.getItem('auth-token'),
            query : [0, 2].join(','),
            id_asistencia : params.id,
        }

        if( type == 'no-agregados' ) { 
            queries.status = 1

            fetch( api(`/api/user?${ paramQueries( queries ) }`) )
                .then( res => res.json() )
                .then( dataRender )
        }
    }

    dataLoad( 'no-agregados' )
    
    return ElementComponent
}
