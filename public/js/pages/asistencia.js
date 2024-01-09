export default ()=>{
    
    const api =(uri = '')=> window.dataApp.api + uri
    const paramQueries = (query = {}) => Object.keys(query).map(key => `${ key }=${ query[key] }`).join('&')

    const Icon = window.dataApp.icon
    const user = window.dataApp.user
 
    const ElementComponent = ele.create(`
        <div class="div_FJZ0jdm">

            <header class="header_N8p7RP6">
                    
                <div class="div_349Zfgp scroll-h">
                    <a href="#/" class="button_0530xdO pointer">${ Icon.get('fi fi-rr-arrow-small-left') }</a>
                    <h4 class="text-ellipsis">Asistencia</h4>
                </div>
 
            </header>

            <div id="elementItem" class="div_f0Au33C scroll-y">

                <div id="elementItemLoad" class="element-loader" style="--color:var(--color-letter)"></div>
                <div id="elementItemNull" class="div_CgtrSP7">
                    ${ Icon.get('icon-light box-empty') }
                    <h3>La asistencia no existe</h3>
                </div>
                <div id="elementItemData" class="div_k10Bfb0"></div>

            </div>

        </div>

    `)

    const { 
        elementItem, 
        elementItemLoad, 
        elementItemNull, 
        elementItemData 
    } = ele.object( ElementComponent.querySelectorAll('[id]'), 'id', true )

    const dataRenderElementItemData =( Data = [] )=>{

        elementItemData.innerHTML = Data.map( data => {
            return `
                <a href="#/asistencia/${ data.id_asistencia }" class="a_TE0KsGr pointer">
                    ${ data.name }
                    ${ Icon.get('fi fi-rr-angle-small-right') }
                </a>
            `
        } ).join('')

        return elementItemData
    }

    const dataRenderElementItem =(Data = undefined)=>{


        elementItem.innerHTML = ''
        elementItem.append(
            Data == undefined ? elementItemLoad : '',
            Array.isArray(Data) && !Data.length ? elementItemNull : '',
            Array.isArray(Data) && Data.length ? dataRenderElementItemData( Data ) : ''
        )
 

    }

    const dataLoadElementItem =()=>{
        const queries = {
            token : localStorage.getItem( 'auth-token' ),
            query : 2,
            limit : 50,
            uid_user    : user.uid
        }

        fetch( api(`/api/asistencia?${ paramQueries( queries ) }`) )
            .then( res => res.json() )
            .then( dataRenderElementItem )
    }

    dataRenderElementItem( undefined )
    dataLoadElementItem()
  
    return ElementComponent 

}