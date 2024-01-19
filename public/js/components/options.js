import Position from "../data/Position.js"
import Gender from "../data/Gender.js"

export default ( option = null, value = null )=>{

    const api =(uri = '')=> window.dataApp.api + uri
    const paramQueries = (query = {}) => Object.keys(query).map(key => `${ key }=${ query[key] }`).join('&')

    const icon = window.dataApp.icon.get('fi fi-rr-check-circle')

    const ElementComponent = ele.create(`
        <div class="div_S29zZQIk4KnXG7b">
            <div id="elementClose" class="div_oNdlAxIlu16kunk"></div>
            <div class="div_98TB53ZeB0rM2Dt">
                <input type="text" id="input_search" class="input_8Os3T35JGJiq100" placeholder="buscar">
                <div class="div_50Hjfm013Cr44p1">
                    <div id="elementItemData" class="div_Ds33g1Itdn546C0">
                        <div id="elementItemLoad" class="element-loader" style="--color:var(--color-letter)"></div>
                    </div>
                </div>
            </div>
        </div>
    `)

    const fragment = document.createDocumentFragment()

    const element = ele.object( ElementComponent.querySelectorAll('[id]'), 'id', true )
    const { input_search, elementItemData, elementClose } = element

    const List = []

    elementClose.addEventListener('click', ()=> ElementComponent.remove())

    input_search.addEventListener('input', e => {
        console.log(List);
        dataRender(
            List.filter( data => {
                if( data.search.includes(input_search.value.toLowerCase().trim()) ) return data
                return false
            } )
        )
    })

    const dataRender =( Data = [] )=>{

        if( !Data.length ) {
            return elementItemData.innerHTML = '<div class="div_4MTYUT3Lf1m2G8s">~ No hay resultados ~</div>'
        }
        
        Data.forEach(data => {
            const select = (data.id ?? '') == value

            const element = ele.create(`
                <button class="button_EzFBb84z5Q3GeX0${ select ? ' focus' : '' }"><span></span>${ icon }</button>
            `)

            element.querySelector('span').textContent = data.name ?? '-'
            element.setAttribute('data-data', JSON.stringify(data))
    
            fragment.append( element ) 
        }) 

        elementItemData.innerHTML = ''
        elementItemData.append( fragment )

    }

    elementItemData.addEventListener('click', e => {
        const button = e.target.closest('button')
        if( button ) {
            const data        = JSON.parse( button.getAttribute('data-data') )
            const buttonFocus   = elementItemData.querySelector('button.focus') ?? document.createElement('div')

            if( buttonFocus != button ) {
                value = data.id
            
                buttonFocus.classList.remove('focus')
                button.classList.add('focus')
    
                ElementComponent.dispatchEvent(new CustomEvent('_change', { detail : { data } }))
            }
            
            ElementComponent.remove()
            
        }
    })

    const dataLoad = ( option ) =>{

        const queries = {
            token : localStorage.getItem('auth-token')
        }

        if( option == 'position' ) {
            List.push( ...Position.map( data => {
                return { ...data, search : Object.values(data).join(' ').toLowerCase() }
            }))  
            dataRender( Position )
        } 

        else if( option == 'gender' ) {
            List.push( ...Gender.map( data => {
                return { ...data, search : Object.values(data).join(' ').toLowerCase() }
            }))  
            dataRender( Gender )
        } 

        else if( option == 'categoria' ) {

            fetch( api(`/api/categoria?${ paramQueries( queries ) }`)  )
                .then( res => res.json() )
                .then( Data => {
                    List.push( ...Data.map( data => {
                        return { ...data, search : Object.values(data).join(' ').toLowerCase() }
                    }))  
                    dataRender( Data )
                } )
            
        } 

        else if( option == 'marca' ) {

            fetch( api(`/api/marca?${ paramQueries( queries ) }`)  )
                .then( res => res.json() )
                .then( Data => {
                    List.push( ...Data.map( data => {
                        return { ...data, search : Object.values(data).join(' ').toLowerCase() }
                    }))  
                    dataRender( Data )
                } )
            
        }
    }

    dataLoad( option )

    return ElementComponent
}