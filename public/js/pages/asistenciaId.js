import Day from "../data/Day.js"
import Month from "../data/Month.js"
import calendar from "../components/calendar.js"

import option from "../components/option.js"
import confirm from "../components/confirm.js"

import asistenciaListUser from "../components/asistenciaListUser.js"
import asistenciaListUserAdd from "../components/asistenciaListUserAdd.js"
import formAsistencia from "../components/formAsistencia.js"
 
export default ( params )=>{

    const api =(uri = '')=> window.dataApp.api + uri
    const paramQueries = (query = {}) => Object.keys(query).map(key => `${ key }=${ query[key] }`).join('&')

    const Icon = window.dataApp.icon

    const ElementComponent = ele.create(`
        <div class="div_FJZ0jdm">

            <header id="header" class="header_N8p7RP6">
                    
                <div class="div_349Zfgp scroll-h">
                    <a href="#/asistencia" class="button_0530xdO pointer">${ Icon.get('fi fi-rr-angle-left') }</a>
                    <h4 id="textAsistencia" class="text-ellipsis">-</h4>
                </div>

                <div id="elementButton" class="div_div_wEan0TY">
                    <button id="buttonOption" class="button_0530xdO pointer">${ Icon.get('fi fi-rr-menu-dots-vertical') }</button>
                </div>

            </header>

            <div id="elementItem" class="div_tbtwCa7">
                <div id="elementItemLoad" class="element-loader" style="--color:var(--color-letter)"></div>
                <div id="elementItemNull" class="div_CgtrSP7">
                    ${ Icon.get('icon-light box-empty') }
                    <h3>La asistencia no existe</h3>
                </div>
                <div id="elementItemData" class="div_tbtwCa7" style="padding:0">
                    <div id="elementItemDataCalendar" class="div_2UJxxmx">
                        <div class="div_0lsR0gb">
                            <h3 id="elementItemDataCalendarText">- - -</h3>
                            <button id="buttonCalendar" class="button_0530xdO pointer">${ Icon.get("fi fi-rr-calendar-day") }</button>
                        </div>
                        <div id="elementItemDataCalendarData" class="div_28hUF27"></div>
                    </div>
                    <div id="elementItemDataItem" class="div_HFrL1MA scroll-y">
                        <div id="elementItemDataItemLoad" class="element-loader"></div>
                        <div id="elementItemDataItemNull" class="div_CgtrSP7">
                            ${ Icon.get('icon-light box-empty') }
                            <h3>La asistencia no existe</h3>
                        </div>
                        <div id="elementItemDataItemData" class="div_Eo339cu" ></div>
                    </div>
                </div>
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
        elementItemDataItem,
        elementItemDataItemLoad,
        elementItemDataItemNull,
        elementItemDataItemData,
        elementItemDataCalendarData,
        elementItemDataCalendarText,
        buttonCalendar,
        buttonOption,
        textAsistencia
    } = ele.object( ElementComponent.querySelectorAll('[id]'), 'id', true )

    const elements = {
        main       : document.getElementById('main'),
        calendar   : calendar(),
        option     : option('asistencia', ['*']),
        form       : '',
        confirm    : confirm( { message : '¿ Desea Eliminar ?' } ),
        asistenciaListUser : asistenciaListUser(),
        asistenciaListUserAdd : asistenciaListUserAdd()
    }

    const elementAlert = new Alert(elements.main)

    elements.calendar.addEventListener('_change', e => {
        dataLoadElementItemData( e.detail.datetime )
    })

    elements.option.addEventListener('_click', e => {
        const action = e.detail.action

        elements.main.append(
            action == 'add_user' ? elements.asistenciaListUserAdd  : '',
            action == 'list_user' ? elements.asistenciaListUser  : '',
            action == 'update' ? elements.form  : '',
            action == 'delete' ? elements.confirm  : '',
        )
        
    })

    elements.confirm.addEventListener('_click', ()=> {

        const queries = {
            token : localStorage.getItem('auth-token'),
            id    : params.id
        }

        fetch( api(`/api/asistencia?${ paramQueries( queries ) }`), { method : 'DELETE' } )
            .then( res => res.json() )
            .then(res => {
                if(res) {
                    location.hash = '#/asistencia'
                }
                else elementAlert.show({ message : 'Error al eliminar' })
            }) 

    })

    buttonCalendar.addEventListener('click', ()=> {
        elements.main.append( elements.calendar )    
    })

    buttonOption.addEventListener('click', ()=> {
        elements.main.append( elements.option )
    })

    elementItemDataCalendarData.addEventListener('click', e => {
        const button = e.target.closest('button')

        if( button ) {
            dataLoadElementItemData( parseInt( button.getAttribute('data-datetime') ) )
        }
    })

    const datetimeWeek =( datetime = null )=>{
        const Datetime = datetime ? new Date( datetime ) : new Date()
        const date     = Datetime.getDate()
        const month     = Datetime.getMonth()

        return Array.from(Array(7).keys()).map( index => {
            Datetime.setDate( index == 0 ? Datetime.getDate() - Datetime.getDay() : Datetime.getDate() + 1 )
            return { day : Datetime.getDay(), date : Datetime.getDate(), focus : date == Datetime.getDate(), status :  month == Datetime.getMonth(), datetime : Datetime.getTime() }
        })
    }

    const dataRenderElementItemDataCalendarData = ( Array = [], datetime = null ) =>{
        elementItemDataCalendarData.innerHTML = Array.map( time => {
            return `
                <button class="pointer ${ time.focus ? 'focus' : '' } ${ time.status ? '' : 'off' }" data-datetime="${ time.datetime }">
                    ${ time.date }
                    <span>${ Day[ time.day ].slice(0, 3) }</span>
                </button>
            `
        }).join('')

        const Time = datetime ? new Date( datetime ) : new Date()
        elementItemDataCalendarText.textContent = `${ Time.getFullYear() } - ${ Month[ Time.getMonth() ] }`
    }

    const dataRenderElementItemDataItemData =( Data = [] )=>{
        const datetime = {
            status  : true,
            value   : null,
            text    : ''
        }

        elementItemDataItemData.innerHTML = Data.map( data => {
            data.data_user = JSON.parse( data.data_user )
            datetime.status = datetime.value != data.datetime

            if( datetime.status ) {
                datetime.value = data.datetime

                const time = new Date( data.datetime )
                datetime.text = `${ time.getFullYear() } - ${ Month[ time.getMonth() ] } - ${ time.getDate() }`

            }

            return `
                ${ datetime.status ? `
                    <div class="div_Xp8V0zq">
                        <h4>${ datetime.text }</h4>
                    </div>
                ` : '' }
                <div class="div_sWWE7xn">
                    <a href="#/asistencia/${ params.id }/user/${ data.data_user.uid }" class="a_ATa4V6t pointer">
                        <img src="${ api(`/storage/user/${ data.data_user.avatar || 'avatar.png' }`) }">
                        <span>${ data.data_user.fullname } ${ data.data_user.lastname }</span>
                        ${ Icon.get('fi fi-rr-angle-right') }
                    </a>
                </div>
            ` 
        }).join('')

        return elementItemDataItemData
    }

    const dataRenderElementItemData =( Data = [] )=>{

        elementItemDataItem.innerHTML = ''
        elementItemDataItem.append(
            Data === 0 ? elementItemDataItemLoad : '',
            Array.isArray(Data) && !Data.length ? elementItemDataItemNull : '',
            Array.isArray(Data) && Data.length ? dataRenderElementItemDataItemData( Data ) : ''
        )
 
    }

    const dataLoadElementItemData =( datetime = null )=>{

        datetime = datetimeToday( datetime )

        const queries = {
            token : localStorage.getItem('auth-token'),
            query : [1, 2].join(','),
            query_order : 'datetime, desc',
            query_limit : 50,
            id_asistencia : params.id,
            datetime : datetimeToday( datetime )
        }

        fetch( api( `/api/asistencia-list?${ paramQueries( queries ) }` ) )
            .then( res => res.json() )
            .then( dataRenderElementItemData )
 
        dataRenderElementItemDataCalendarData( datetimeWeek( datetime ), datetime )
        dataRenderElementItemData( 0 )
        return elementItemData
    }

    const dataRenderElementItem =(data = null)=>{

        const isData = data && Object.keys( data )

        header.append(
            isData ? elementButton : ''
        )
        
        elementItem.innerHTML = ''
        elementItem.append(
            data === 0 ? elementItemLoad : '',
            data === null ? elementItemNull : '',
            isData ? dataLoadElementItemData( null ) : ''
        )

        if( isData ) {
            textAsistencia.textContent = data.name
            if( elements.form == '' ) {
                elements.form = formAsistencia(false, data)
                elements.form.addEventListener('_submit', e => {
                    elements.form.remove()
                    if (e.detail.status) {
                        dataLoadElementItem()
                    }
                })
            }
        }
    }

    const dataLoadElementItem =( )=>{

        const queries = {
            token : localStorage.getItem('auth-token'),
            query : 0,
            query_limit: 'one',
            id    : params.id
        }

        fetch( api( `/api/asistencia?${ paramQueries( queries ) }` ) )
            .then( res => res.json() )
            .then( dataRenderElementItem )  
        
    }

    dataRenderElementItem( 0 )
    dataLoadElementItem()
 
    Array.from([ elementButton ]).forEach( element => element.remove() )

    return ElementComponent
}
 
 
