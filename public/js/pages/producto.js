// import elementSearch2 from "../components/elementSearch.js"
import formProducto from "../components/formProducto.js"

export default ()=>{

    const api =(uri = '')=> window.dataApp.api + uri
    const paramQueries = (query = {}) => Object.keys(query).map(key => `${ key }=${ query[key] }`).join('&')

    const params    = window.dataLib.params
    const Icon      = window.dataApp.icon

    const ElementComponent = ele.create(`
        <div class="div_FJZ0jdm">

            <header class="header_N8p7RP6">
                    
                <div class="div_349Zfgp scroll-h">
                    <a href="#/inventario" class="button_0530xdO pointer">${ Icon.get('fi fi-rr-angle-left') }</a>
                    <h4 class="text-ellipsis">Productos</h4>
                </div>

                <div class="div_div_wEan0TY">
                    <button id="buttonAdd" class="button_0530xdO pointer">${ Icon.get('fi fi-rr-plus') }</button>
                </div>

            </header>

            <div id="elementItem" class="div_mF99tCO scroll-y">

                <div id="elementItemLoad" class="element-loader" style="padding:20px; --color:var(--color-letter)"></div>
                <div id="elementItemNull" class="div_CgtrSP7">
                    ${ Icon.get('icon-light box-empty') }
                    <h3>Lista vacia</h3>
                </div>
                <div id="elementItemData" class="div_AGlTc4C"></div>

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
        main : document.getElementById('main'),
        form : formProducto()
    }

    const observer = new eleObserver()
 
    buttonAdd.addEventListener('click', ()=> {
        elements.main.append( elements.form )
    })

    elements.form.addEventListener('_submit', e => {
        elements.form.remove() 
        if( e.detail.status ) dataLoadElementItem()
    })

    const dataRenderElementItemData =(Data = [], clear = false)=>{
        elementItemLoad.remove()
        if( !Data.length ) return
        if( clear ) elementItemData.innerHTML = ''

        elementItemData.insertAdjacentHTML('beforeend', Data.map( (data, index) => {
            data.data_marca = JSON.parse( data.data_marca )
            data.data_categoria = JSON.parse( data.data_categoria )

            return `
                ${ index == 0 ? '' : '<hr>' }
                <a href="#/producto/${ data.id }" class="a_OGTLhnw pointer" data-id="div-${ data.id }">
                    <div class="div_T9u1Tyz">
                        <img src="${ api(`/storage/productos/${ data.img }`) }" alt="img-producto">
                        <div class="div_226x4d7">
                            
                            <div class="div_TDXPB0u">
                                <span><b>${ data.sap }</b> - </span>
                                <span style="font-size:13px; word-break: break-word;">${ data.description }</span> 
                            </div>
                            <div class="div_MB5SEYQ">
                                <span>${ data.data_categoria.name }</span>
                                <span>${ data.data_marca.name }</span>
                            </div>
                        </div>
                    </div>
                    ${ Icon.get('fi fi-rr-angle-small-right') }
                </a>
            `

        }).join(''))

        const children = Array.from(elementItemData.children).slice(-1)[0]

        if( children ) {
            observer.set(children, entry => {

                if( entry.isIntersecting ) {
                    observer.remove( children )
                    //elementItem.append( elementItemLoad )

                    const queries = {
                        token : localStorage.getItem('auth-token'),
                        query : 1,
                        query_limit : `${ elementItemData.children.length }, 50` ,
                    }
            
                    fetch( api(`/api/producto?${ paramQueries(queries) }`) )
                        .then( res => res.json() )
                        .then( dataRenderElementItemData )
 
                }
                 
            })
        }
        
        return elementItemData
    }

    const dataRenderElementItem =(Data = [])=>{
        
        elementItem.innerHTML = ''
        elementItem.append(
            Data === 0 ? elementItemLoad : '',
            Array.isArray(Data) && !Data.length ? elementItemNull : '',
            Array.isArray(Data) && Data.length ? dataRenderElementItemData( Data, true ) : '',
        )

    }

    const dataLoadElementItem = ()=>{

        const queries = {
            token : localStorage.getItem('auth-token'),
            query : 1,
            query_limit : 50,
        }

        fetch( api(`/api/producto?${ paramQueries(queries) }`) )
            .then( res => res.json() )
            .then( dataRenderElementItem )
        
    }
 
    dataRenderElementItem(0)
    dataLoadElementItem()

    return ElementComponent
}