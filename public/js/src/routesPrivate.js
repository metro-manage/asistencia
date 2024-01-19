export default ( page, ...params )=>{

    const element = document.createElement('div')

    const api =(uri = '')=> window.dataApp.api + uri
    const paramQueries = (query = {}) => Object.keys(query).map(key => `${ key }=${ query[key] }`).join('&') 

    const queries = {
        token : localStorage.getItem('auth-token')
    }

    fetch( api(`/api/token?${ paramQueries( queries ) }`) )
        .then( res => res.json() )
        .then( data => {

            if( !data ) {
                localStorage.removeItem('auth-token')
                location.hash = '#/login'
                return
            }

            if( ![1, 2].includes(data.user_data.position) ) {
                localStorage.removeItem('auth-token')
                location.hash = '#/login'
                return
            }

            window.dataApp.user = data.user_data
            localStorage.setItem('auth-token', data.token)

            element.replaceWith( page( ...params ) ) 
        } )

    return element
   
}   