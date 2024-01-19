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
            
            if( data ) {
                location.hash = '#/'
                return
            }

            window.dataApp.user = {}
            localStorage.removeItem('auth-token')
            
            element.replaceWith( page( ...params ) ) 
            
        })

    return element

}   