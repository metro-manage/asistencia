export default ()=>{

    const Icon = window.dataApp.icon

    const ElementComponent = ele.create(`
        <div class="div_FJZ0jdm">
            <header class="header_N8p7RP6">
                    
                <div class="div_349Zfgp scroll-h">
                    <a href="#/" class="button_0530xdO pointer">${ Icon.get('fi fi-rr-angle-left') }</a>
                    <h4 class="text-ellipsis">Inventario</h4>
                </div>
            
            </header>

            <div class="div_f0Au33C">
                <div class="div_k10Bfb0">
                    <a href="#/producto" class="a_TE0KsGr pointer">
                        productos
                        ${ Icon.get('fi fi-rr-angle-small-right') }
                    </a>
                    <hr>
                    <a href="#/categoria" class="a_TE0KsGr pointer">
                        categorias
                        ${ Icon.get('fi fi-rr-angle-small-right') }
                    </a>
                    <hr>
                    <a href="#/marca" class="a_TE0KsGr pointer">
                        marcas
                        ${ Icon.get('fi fi-rr-angle-small-right') }
                    </a>
                </div>
            </div>

        </div>
        
    `)

    return ElementComponent

}