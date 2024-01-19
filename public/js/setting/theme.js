export default ()=>{

    if( !localStorage.getItem('theme') )
        localStorage.setItem('theme', 'light')

    const themeLight = {
        'color-background' : '#F7F7F7',
        'color-item'    : '#ffffff',
        'color-letter'  : '#1c1c1e',
        'filter-img'    : 'initial'
    }
    
    const themeDark  = {
        'color-background' : '#1c1c1e',   
        'color-item' : '#2C2C2E',   
        'color-letter' : '#F7F7F7',
        'filter-img'   :'invert(82%) sepia(99%) saturate(0%) hue-rotate(102deg) brightness(111%) contrast(100%)'
    }

    const theme = localStorage.getItem('theme') == 'light' ? themeLight : themeDark

    document.getElementById('meta-theme-color').setAttribute('content', theme['color-background'])
    document.getElementById('setting-style').innerHTML = `:root {${ Object.keys(theme).map( key => `--${ key } : ${ theme[key] };\n` ).join('') }}`

}