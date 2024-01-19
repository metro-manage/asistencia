import Day from "../data/Day.js"
import Month from "../data/Month.js"
import calendar from "../components/calendar.js"
import Asistencia from "../data/Asistencia.js"
 
export default ( params )=>{

    const api =(uri = '')=> window.dataApp.api + uri
    const paramQueries = (query = {}) => Object.keys(query).map(key => `${ key }=${ query[key] }`).join('&')

    const Icon = window.dataApp.icon
    const user = window.dataApp.user

    const ElementComponent = ele.create(`
        <div class="div_FJZ0jdm">

            <header class="header_N8p7RP6">
                    
                <div class="div_349Zfgp scroll-h">
                    <a href="#/asistencia" class="button_0530xdO pointer">${ Icon.get('fi fi-rr-angle-left') }</a>
                    <h4 class="text-ellipsis">Asistencia por usuario</h4>
                </div>

            </header>

            <div id="elementItem" class="div_tbtwCa7">
                <div id="elementItemLoad" class="element-loader" style="--color:var(--color-letter)"></div>
                <div id="elementItemNull" class="div_CgtrSP7">
                    ${ Icon.get('icon-light box-empty') }
                    <h3>La asistencia no existe</h3>
                </div>
                <div id="elementItemData" class="div_tbtwCa7" style="padding:0">
                    <div id="elementItemDataUser">
                        <a  href="#" class="a_v6Zrzbs pointer">
                            <img src="">
                            <span>-</span>
                            ${ Icon.get('fi fi-rr-angle-right') }
                        </a>
                    </div>
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
        elementItem, 
        elementItemLoad, 
        elementItemNull, 
        elementItemData,
        elementItemDataItem,
        elementItemDataItemLoad,
        elementItemDataItemNull,
        elementItemDataItemData,
        elementItemDataUser,
        elementItemDataCalendarData,
        elementItemDataCalendarText,
        buttonCalendar
    } = ele.object( ElementComponent.querySelectorAll('[id]'), 'id', true )

    const elements = {
        main       : document.getElementById('main'),
        calendar   : calendar()
    }

    elements.calendar.addEventListener('_change', e => {
        dataLoadElementItemData( e.detail.datetime )
    })

    buttonCalendar.addEventListener('click', ()=> {
        elements.main.append( elements.calendar )    
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
            datetime.status = datetime.value != data.datetime
            data.detail = JSON.parse( data.detail )

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
                <div class="div_609YKK1">
                    ${

                        data.detail.map( detail => {
                            const datetime = new Date( detail.datetime )
                            const datetimeText = `${ datetime.getHours() > 12 ? datetime.getHours() - 12 : datetime.getHours() }:${ datetime.getMinutes() }:${ datetime.getSeconds() } ${ datetime.getHours() > 12 ? 'PM' : 'AM' }`

                            return `
                                <div class="div_ng4hr6s"><span>${ Asistencia.find( asistencia => asistencia.id == detail.id ).name }</span><span>${ datetimeText }</span></div>
                            `

                        } ).join('')

                    } 
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
            query : [0, 2].join(','),
            query_order     : 'datetime, desc',
            id_asistencia   : params.id,
            uid_user   : params.uid_user,
            datetime : datetimeToday( datetime )
        }

        fetch( api(`/api/asistencia-list?${ paramQueries( queries ) }`) )
            .then( res => res.json() )
            .then( dataRenderElementItemData ) 

        dataRenderElementItemDataCalendarData( datetimeWeek( datetime ), datetime )
        dataRenderElementItemData( 0 )
        return elementItemData
    }

    const dataRenderElementItem =(data = null)=>{

        elementItem.innerHTML = ''
        elementItem.append(
            data === 0 ? elementItemLoad : '',
            data === null ? elementItemNull : '',
            data && Object.keys( data ) ? dataLoadElementItemData( null ) : ''
        )

        if( data && Object.keys( data ) ) {
            data.data_user = JSON.parse( data.data_user )

            elementItemDataUser.innerHTML = `
                <a  href="#/usuario/${ data.data_user.uid }" class="a_v6Zrzbs pointer">
                    <img src="${ api(`/storage/user/${ data.data_user.avatar || 'avatar.png' }`) }">
                    <span>${ data.data_user.fullname } ${ data.data_user.lastname }</span>
                    ${ Icon.get('fi fi-rr-angle-right') }
                </a>
            `
        }
    }

    const dataLoadElementItem =( )=>{

        const queries = {
            token : localStorage.getItem('auth-token'),
            query : [2, 1].join(','),
            query_limit: 'one',
            id_asistencia    : params.id,
            uid_user    : params.uid_user
        }

        fetch( api( `/api/asistencia-user?${ paramQueries( queries ) }` ) )
            .then( res => res.json() )
            .then( dataRenderElementItem )
        
    }

    dataRenderElementItem( 0 )
    dataLoadElementItem()
 
    return ElementComponent
}
