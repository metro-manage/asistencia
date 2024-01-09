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

            if( !data ) {
                localStorage.removeItem('auth-token')
                location.hash = '#/login'
                return
            }
            
            if( ![3].includes(data.user_data.position) ) {
                localStorage.removeItem('auth-token')
                location.hash = '#/login'
                return
            }

            window.dataApp.user = data.user_data
            localStorage.setItem('auth-token', data.token)

            main.textContent = ''
            main.append( page( ...params ) )

            dispatchEvent( new CustomEvent('eNavigate') )
        } )

    const eventHashchange = () => {
        active = false
        removeEventListener('hashchange', eventHashchange)
    }

    addEventListener('hashchange', eventHashchange)
}   