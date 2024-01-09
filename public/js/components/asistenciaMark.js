import Asistencia from "../data/Asistencia.js"

export default ( id_asistencia = null )=>{

    const api =(uri = '')=> window.dataApp.api + uri
    const paramQueries = (query = {}) => Object.keys(query).map(key => `${ key }=${ query[key] }`).join('&')

    const Icon = window.dataApp.icon
    const user = window.dataApp.user

    const dataComponent = {
        uid_user : null
    }

    const ElementComponent = ele.create(`
        <div class="div_n76Pr7U">
            <div id="elementCloseComponent" class="div_GfaM0Ws"></div>
            <div class="div_iRbMV3T scroll-h">

                <div class="div_OdvFgf7">
                    <h3>Asistencia</h3>
                    <button id="buttonCloseComponent" class="button_0530xdO">${ Icon.get('fi fi-rr-cross-small') }</button>
                </div>

                <div id="elementItem" class="div_l46oEtr">

                    <div id="elementItemLoad" class="element-loader" style="--color:var(--color-letter)"></div>
                    <div id="elementItemNull" class="div_CgtrSP7">
                        ${ Icon.get('icon-light box-empty') }
                        <h3>La asistencia no existe</h3>
                    </div>
                    <div id="elementItemData" class="div_l46oEtr scroll-y">
                        <div id="elementItemDataItem" class="div_7uRSuQW scroll-y">
                            <div id="elementItemDataItemData" class="div_7GjGF16"></div>
                        </div>
                        <div id="elementItemDataButton" class="div_Hqv639S"></div>
                    </div>
                </div>
            </div>
        </div>
    `)

    const { 
        elementCloseComponent,
        buttonCloseComponent,

        elementItem, 
        elementItemLoad, 
        elementItemNull, 
        elementItemData,
        elementItemDataItem,
        elementItemDataItemData,
        elementItemDataButton
    } = ele.object( ElementComponent.querySelectorAll('[id]'), 'id', true )

    Array.from([elementCloseComponent, buttonCloseComponent]).forEach( element => {
        element.addEventListener('click', ()=> ElementComponent.remove())
    })

    elementItemDataButton.addEventListener('click', e => {


        const button = e.target.closest( 'button' )

        if( button ) {

            const data   = JSON.parse( button.parentElement.getAttribute('data-data') )
            const status = parseInt( button.getAttribute('data-status') )

            if( data ) {

                const queries = {
                    token : localStorage.getItem('auth-token'),
                    id    : data.id
                }

                data.detail = JSON.parse( data.detail ) 
                data.detail.push( { id : status, datetime : Date.now() } )
                data.detail = JSON.stringify( data.detail )

                const _data    = {
                    detail   : data.detail,
                    status
                }

                fetch( api(`/api/asistencia-list?${ paramQueries( queries ) }`), { method : 'PATCH', body : JSON.stringify( _data ) } )
                    .then( res => res.json() )
                    .then( dataLoadElementItem )

            } else {
                const queries = {
                    token : localStorage.getItem('auth-token')
                }

                const _data    = {
                    id_asistencia,
                    uid_user : dataComponent.uid_user,
                    datetime : datetimeToday( null ),
                    detail   : JSON.stringify( [{ id : status, datetime : Date.now() }] ),
                    status
                }

                fetch( api(`/api/asistencia-list?${ paramQueries( queries ) }`), { method : 'POST', body : JSON.stringify( _data ) } )
                    .then( res => res.json() )
                    .then( dataLoadElementItem )
            }

        }

    })

    const dataRenderElementItemData =( data = null )=>{
        
        elementItemDataItemData.innerHTML = `
            ${ data == null ? `
                <div class="div_7t97RMm">
                    <span>${ Asistencia.find( asistencia => asistencia.id == 1 ).name }</span>
                    <span>--:--:--</span>
                </div>
            ` 
            : 
                JSON.parse( data.detail ).map( detail => {

                    const datetime = new Date( detail.datetime )
                    const datetimeText = `${ datetime.getHours() > 12 ? datetime.getHours() - 12 : datetime.getHours() }:${ datetime.getMinutes() }:${ datetime.getSeconds() } ${ datetime.getHours() > 12 ? 'PM' : 'AM' }`

                    return `
                        <div class="div_7t97RMm">
                            <span>${ Asistencia.find( asistencia => asistencia.id == detail.id ).name }</span>
                            <span>${ datetimeText }</span>
                        </div>
                    `
                } ).join('')
            }
        `

        elementItemDataButton.setAttribute('data-data', JSON.stringify( data ?? null ))

        elementItemDataButton.innerHTML = `
            ${ data == null ? `
                <button class="dark" data-status="1">${ Asistencia.find( asistencia => asistencia.id == 1 ).name }</button>
            ` 
            : [1, 3].includes(data.status) ? `
                <button data-status="2">${ Asistencia.find( asistencia => asistencia.id == 2 ).name }</button>
                <button class="dark" data-status="4">${ Asistencia.find( asistencia => asistencia.id == 4 ).name }</button>
            `
            : data.status == 2 ?
            `
                <button class="dark" data-status="3">${ Asistencia.find( asistencia => asistencia.id == 3 ).name }</button>
            ` 
            : 
            '<span style="margin:auto; padding: 10px">~ Asistencia Registrada ~</span>' }
        ` 
    }

    const dataLoadElementItemData =()=>{
        
        const queries = {

            token : localStorage.getItem('auth-token'),
            query : 3,
            query_limit : 'one',
            id_asistencia,
            uid_user : user.uid,
            datetime : datetimeToday( null  )

        }

        fetch( api( `/api/asistencia-list?${ paramQueries( queries ) }` ) )
            .then( res => res.json() )
            .then( dataRenderElementItemData )

        return elementItemData
    }
    const dataRenderElementItem =( data = undefined )=>{

        if( data ) {
            dataComponent.uid_user = data.uid_user
        }

        elementItem.innerHTML = ''

        elementItem.append(
            data === undefined ? elementItemLoad : '',
            data === null ? elementItemNull : '',
            data ? dataLoadElementItemData() : ''
        )

    }

    const dataLoadElementItem =()=>{
        const queries = {
            token : localStorage.getItem('auth-token'),
            query : 3,
            query_limit : 'one',
            id_asistencia,
            uid_user : user.uid,
            datetime : datetimeToday( null  )
        }

        fetch( api( `/api/asistencia-user?${ paramQueries( queries ) }` ) )
            .then( res => res.json() )
            .then( dataRenderElementItem )
    }

    dataRenderElementItem( undefined )
    dataLoadElementItem()
    

    // elementItemRender( undefined )
    // elementItemLoad()

    return ElementComponent
}


 // const api =(uri = '')=> window.dataApp.api + uri
    // const paramQueries = (query = {}) => Object.keys(query).map(key => `${ key }=${ query[key] }`).join('&')

    // const Icon = window.dataApp.icon
    // const user = window.dataApp.user

    // const ElementComponent = ele.create(`
    //     <div class="div_n76Pr7U">
    //         <div class="div_GfaM0Ws"></div>
    //         <div class="div_iRbMV3T scroll-h">
    //             <div class="div_OdvFgf7">
    //                 <h3>Asistencia</h3>
    //                 <button class="button_0530xdO">${ Icon.get('fi fi-rr-cross-small') }</button>
    //             </div>
    //             <div id="elementItem" class="div_l46oEtr">

 
    //                 <div id="elementItemList" class="div_7uRSuQW scroll-y">
    //                     <div class="div_7GjGF16">
    //                         <div class="div_7t97RMm">
    //                             <span>Entrada</span>
    //                             <span>--:--:--</span>
    //                         </div>
    //                     </div>
    //                 </div>

    //                 <div id="elementItemButton" class="div_Hqv639S">
    //                     <button>Salida</button>
    //                     <button class="dark">Ingresar</button>
    //                 </div>

    //             </div>
    //         </div>
    //     </div>
    // `)

    // const elements = ele.object( ElementComponent.querySelectorAll('[id]'), 'id', true )
    // const { elementItem, elementItemList } = elements

    // const dataRender2 =( data = null )=>{
    //     console.log(data);
    // }

    // const dataLoad2 =()=>{
        
    //     const queries = {

    //         token : localStorage.getItem('auth-token'),
    //         query : 3,
    //         query_limit : 'one',
    //         id_asistencia : 10000,
    //         uid_user : user.uid,
    //         datetime : datetimeToday( null  )

    //     }

    //     fetch( api( `/api/asistencia-list?${ paramQueries( queries ) }` ) )
    //         .then( res => res.json() )
    //         .then(  )

    // }

    // const dataRender =( data )=>{

    //     if( !data ) {
    //         elementItem.innerHTML = `
    //             <div class="div_CgtrSP7">
    //                 ${ Icon.get('icon-light box-empty') }
    //                 <h3>La asistencia no existe</h3>
    //             </div>
    //         `
    //         return
    //     }
 
    //     dataLoad2()

    // }

    // const dataLoad =()=>{
        
    //     const queries = {

    //         token : localStorage.getItem('auth-token'),
    //         query : 3,
    //         query_limit : 'one',
    //         id_asistencia : 10000,
    //         uid_user : user.uid,
    //         datetime : datetimeToday( null  )

    //     }

    //     fetch( api( `/api/asistencia-user?${ paramQueries( queries ) }` ) )
    //         .then( res => res.json() )
    //         .then( dataRender )

    // }

    // dataLoad()

    // return ElementComponent

