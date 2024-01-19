export default ( datetime = null )=>{

    const Month = [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre' ]

    const Element = ele.create(`
        <div class="div_Ed0WWt537MU926D">
            <div id="elementClose" class="div_xAeKmwifq7Ajpip"></div>
            <div class="div_zkdwut55cOC4757 scroll-y">
                <div class="div_Shm089Y0yC25009">
                    <div class="div_iJVaX1Vhq90V6K2">
                        <div id="dayText">-</div>
                        <hr>
                        <div id="monthText" class="half">-</div>
                        <hr>
                        <div id="yearText">-</div>
                    </div> 
                    <div id="containerDate" class="div_4qg39xR95L71RiS ">
                        <div id="elementDay" class="div_afO4579AKSm7b8q"></div>
                        <div id="containerYearMonth" class="div_Hd4V1BgCSOSCL5J scroll-y">
                            <div id="elementYear" class="div_w17wYdh13YdIUnI"></div>
                            <div id="elementMonth" class="div_w17wYdh13YdIUnI"></div>
                        </div>
                    </div>
                    <div class="div_m38HD12AtX186RH">
                        <button id="btnCancel">Cancelar</button>
                        <button id="btnSubmit">Aceptar</button>
                    </div>
                </div>
            </div>
        </div>
    `)

    const element = ele.object( Element.querySelectorAll('[id]'), 'id', true )
    const { elementClose, dayText, monthText, yearText, containerDate, containerYearMonth, elementYear, elementMonth, elementDay, btnCancel, btnSubmit } = element

    const date = datetime ? new Date(datetime) : new Date()

    const datetimeDinamic = {
        year    : date.getFullYear(),
        month   : date.getMonth(),
        day     : date.getDate(),
    }

    datetimeDinamic.dayLimit = new Date(datetimeDinamic.year, datetimeDinamic.month + 1, 0).getDate()

    dayText.addEventListener('click', ()=> {
        containerYearMonth.remove()
    })

    monthText.addEventListener('click', ()=> {
        containerYearMonth.textContent = ''
        containerYearMonth.append( elementMonth )
        containerDate.append( containerYearMonth )

        const focus = elementMonth.querySelector('.focus')
        if( focus ) focus.scrollIntoView({ block: "center", inline: "center" })
    })

    yearText.addEventListener('click', ()=> {
        containerYearMonth.textContent = ''
        containerYearMonth.append( elementYear )
        containerDate.append( containerYearMonth )

        const focus = elementYear.querySelector('.focus')
        if( focus ) focus.scrollIntoView({ block: "center", inline: "center" })
    })
    
    elementDay.addEventListener('click', e => {
        const span = e.target.closest('span')

        if( span ) {

            const _date = parseInt(span.getAttribute('data-data'))
            const up    = _date > datetimeDinamic.day

            if( _date == datetimeDinamic.day ) return
            datetimeDinamic.day = _date

            const spanfocus =  elementDay.querySelector('span.focus')
            if( spanfocus ) spanfocus.classList.remove('focus')
            span.classList.add('focus')

            dayText.innerHTML = `<h3 class="${ up ? 'up' : 'down' }">${ span.textContent  }</h3>`
        }

    })

    elementMonth.addEventListener('click', e => {
        const span = e.target.closest('span')

        if( span ) {

            containerYearMonth.remove()
            const _date = parseInt(span.getAttribute('data-data'))
            const up    = _date > datetimeDinamic.month

            if( _date == datetimeDinamic.month ) return
            datetimeDinamic.month = _date

            const spanfocus =  elementMonth.querySelector('span.focus')
            if( spanfocus ) spanfocus.classList.remove('focus')
            span.classList.add('focus')

            monthText.innerHTML = `<h3 class="${ up ? 'up' : 'down' }">${ span.textContent  }</h3>` 

            datetimeDinamic.dayLimit = new Date(datetimeDinamic.year, datetimeDinamic.month + 1, 0).getDate()

            if( datetimeDinamic.dayLimit < datetimeDinamic.day ) {
                dayText.textContent = ('0' + datetimeDinamic.dayLimit).slice(-2)
                datetimeDinamic.day = datetimeDinamic.dayLimit
            }

            renderDatetime('day')
        }
    })

    elementYear.addEventListener('click', e => {
        const span = e.target.closest('span')

        if( span ) {

            containerYearMonth.remove()
            const _date = parseInt(span.getAttribute('data-data'))
            const up    = _date > datetimeDinamic.year

            if( _date == datetimeDinamic.year ) return
            datetimeDinamic.year = _date

            const spanfocus =  elementYear.querySelector('span.focus')
            if( spanfocus ) spanfocus.classList.remove('focus')
            span.classList.add('focus')

            yearText.innerHTML = `<h3 class="${ up ? 'up' : 'down' }">${ span.textContent  }</h3>` 

            datetimeDinamic.dayLimit = new Date(datetimeDinamic.year, datetimeDinamic.month + 1, 0).getDate()

            if( datetimeDinamic.dayLimit < datetimeDinamic.day ) {
                dayText.textContent = ('0' + datetimeDinamic.dayLimit).slice(-2)
                datetimeDinamic.day = datetimeDinamic.dayLimit
            }

            renderDatetime('day')
        }
    })

    btnSubmit.addEventListener('click', ()=> {
        const datetime = new Date(datetimeDinamic.year, datetimeDinamic.month, datetimeDinamic.day, 0, 0, 0, 0).getTime()
        Element.dispatchEvent(new CustomEvent('_change', { detail : { datetime } }))
        Element.remove()
    })

    elementClose.addEventListener('click', ()=> {
        Element.remove()
    })

    btnCancel.addEventListener('click', ()=> {
        Element.remove()
    })

    const renderDatetime =(change = '*')=>{

        if( ['day', '*'].includes(change) ) {
            elementDay.innerHTML = [...Array( datetimeDinamic.dayLimit ).keys()].map(num => {
                ++num

                const numtext = num
                const focus   = datetimeDinamic.day == num
                if( focus ) dayText.innerHTML = `<h3>${ numtext }</h3>`   
                return `<span class="${ focus ? 'focus' : '' }" data-data="${ num }">${ numtext }</span>`
                
            }).join('')
        }

        if( ['month', '*'].includes(change) ) {
            elementMonth.innerHTML = [...Array(Month.length).keys()].map((num) => {

                const numtext = Month[ num ]
                const focus   = datetimeDinamic.month == num

                if( focus ) monthText.innerHTML = `<h3>${ numtext  }</h3>` 
                return `<span class="${ focus ? 'focus' : '' }" data-data="${ num }">${ numtext }</span>`

            }).join('')
        }

        if( ['year', '*'].includes(change) ) {
            elementYear.innerHTML = [...Array((new Date().getFullYear() + 15) - 1970).keys()].map(num => {
                const date = 1970 + num

                const focus   = datetimeDinamic.year == date


                if( focus ) yearText.innerHTML = `<h3>${ date  }</h3>`  
                return `<span class="${ focus ? 'focus' : '' }" data-data="${ date }">${ date }</span>`
            }).join('')
        }
    }

    containerYearMonth.remove()
    renderDatetime()

    return Element

}