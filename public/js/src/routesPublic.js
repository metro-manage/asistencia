export default ( page, ...params )=>{

    const api =(uri = '')=> window.dataApp.api + uri
    const paramQueries = (query = {}) => Object.keys(query).map(key => `${ key }=${ query[key] }`).join('&') 

    let active = true

    const main = document.getElementById( 'main' )

    main.innerHTML = `
        <div class="container-loader">
            <span class="loader"></span>
        </div>
    `

    const queries = {
        token : localStorage.getItem('auth-token')
    }

    fetch( api(`/api/token?${ paramQueries( queries ) }`) )
        .then( res => res.json() )
        .then( data => { 
            
            if( !active ) return

            if( data ) {
                location.hash = '#/'
                return
            }

            localStorage.removeItem('auth-token')

            main.textContent = ''
            main.append( page( ...params ) )
            
        })

    const eventHashchange = () => {
        active = false
        removeEventListener('hashchange', eventHashchange)
    }

    addEventListener('hashchange', eventHashchange)

}   