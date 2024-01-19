import formAsistencia from "../components/formAsistencia.js"

export default ()=>{
    
    const api =(uri = '')=> window.dataApp.api + uri
    const paramQueries = (query = {}) => Object.keys(query).map(key => `${ key }=${ query[key] }`).join('&')

    const Icon = window.dataApp.icon
 
    const ElementComponent = ele.create(`
        <div class="div_FJZ0jdm">

            <header class="header_N8p7RP6">
                    
                <div class="div_349Zfgp scroll-h">
                    <a href="#/" class="button_0530xdO pointer">${ Icon.get('fi fi-rr-angle-left') }</a>
                    <h4 class="text-ellipsis">Asistencia</h4>
                </div>

                <div class="div_div_wEan0TY">
                    <button id="buttonAdd" class="button_0530xdO pointer">${ Icon.get('fi fi-rr-plus') }</button>
                </div>

            </header>

            <div id="elementItem" class="div_f0Au33C scroll-y">

                <div id="elementItemLoad" class="element-loader" style="--color:var(--color-letter)"></div>
                <div id="elementItemNull" class="div_CgtrSP7">
                    ${ Icon.get('icon-light box-empty') }
                    <h3>Lista vacia</h3>
                </div>
                <div id="elementItemData" class="div_k10Bfb0"></div>

            </div>

        </div>

    `)

    const { 
        elementItem, 
        elementItemLoad,
        elementItemNull,
        elementItemData, 
        buttonAdd 
    } = ele.object( ElementComponent.querySelectorAll('[id]'), 'id', true )

    const elements = {
        form : formAsistencia(),
        main : document.getElementById('main')
    }

    buttonAdd.addEventListener('click', ()=> {
        elements.main.append( elements.form )
    })

    elements.form.addEventListener('_submit', e => {
        elements.form.remove()
        if( e.detail.status ) {
            dataLoadElementItem()
        }
    })

    const dataRenderElementItemData =( Data = [] )=>{

        elementItemData.innerHTML = Data.map( (data, index) => {
            return `
                ${ index == 0 ? '' : '<hr>' }
                <a href="#/asistencia/${ data.id }" class="a_TE0KsGr pointer">
                    ${ data.name }
                    ${ Icon.get('fi fi-rr-angle-small-right') }
                </a>
            `
        } ).join('')

        return elementItemData
    }

    const dataRenderElementItem =( Data = [] )=>{
        elementItem.innerHTML = ''
        elementItem.append(
            Data === 0 ? elementItemLoad : '',
            Array.isArray(Data) && !Data.length ? elementItemNull : '',
            Array.isArray(Data) && Data.length ? dataRenderElementItemData( Data ) : '',
        )
    }

    const dataLoadElementItem =()=>{

        const queries = {
            token : localStorage.getItem( 'auth-token' ),
            query : 0,
            query_limit : 50,
        }

        fetch( api(`/api/asistencia?${ paramQueries( queries ) }`) )
            .then( res => res.json() )
            .then( dataRenderElementItem )

    }

    dataRenderElementItem(0)
    dataLoadElementItem()
    
    return ElementComponent 

}