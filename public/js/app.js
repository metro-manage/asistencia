import theme from "./setting/theme.js"
import header from "./components/header.js"
import routes from "./src/routes.js"

export default ()=>{

    theme()

    window.dataApp = {
        click : false,
        api   : 'https://api-metro.victor01sp.com',
        icon  : new IconSVG()
    }

    window.addEventListener('contextmenu', e => e.preventDefault())

    document.getElementById('root')
        .append( 
            header(),
            routes()
        )

        
        
}