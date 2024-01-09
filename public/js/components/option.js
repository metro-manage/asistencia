export default ( optionFrom = null, optionInclude = [] )=>{

    const Icon = window.dataApp.icon

    const Options = {
        marca : [
            { icon : 'fi fi-rr-pencil', action : 'update', name : 'Actualizar' },
            { icon : 'fi fi-rr-trash', action : 'delete', name : 'Eliminar' },
        ],
        categoria : [
            { icon : 'fi fi-rr-pencil', action : 'update', name : 'Actualizar' },
            { icon : 'fi fi-rr-trash', action : 'delete', name : 'Eliminar' },
        ],
        usuario : [
            { icon : 'fi fi-rr-pencil', action : 'update', name : 'Actualizar' },
            { icon : 'fi fi-rr-key', action : 'update_password', name : 'Actualizar Contraseña' },
            { icon : 'fi fi-rr-trash', action : 'delete', name : 'Eliminar' },
        ],
        producto : [
            { icon : 'fi fi-rr-pencil', action : 'update', name : 'Actualizar' },
            { icon : 'fi fi-rr-trash', action : 'delete', name : 'Eliminar' },
        ],
        asistencia : [
            { icon : 'fi fi-rr-user-add', action : 'add_user', name : 'agregar' },
            { icon : 'fi fi-rr-users', action : 'list_user', name : 'Miembros' },
            { icon : 'fi fi-rr-pencil', action : 'update', name : 'Actualizar' },
            { icon : 'fi fi-rr-trash', action : 'delete', name : 'Eliminar' },
        ],
        asistencia_user : [
            { icon : 'fi fi-rr-user-add', action : 'add', name : 'Agregar' },
            { icon : 'fi fi-rr-user-slash', action : 'remove', name : 'Remover' },
            { icon : 'fi fi-rr-user-add', action : 'set', name : 'Integrar' },
            { icon : 'fi fi-rr-delete-user', action : 'delete', name : 'Eliminar' },
        ]
    }

    const ElementComponent = ele.create(`
        <div class="div_42I5qPU">
            <div id="closeElement" class="div_17oF1YJ"></div>
            <div class="div_GF3J6Us scroll-y">
                <div id="elementOption" class="div_skqESV7"> 
                    ${

                        (Options[ optionFrom ] || []).map( option => {

                            if( optionInclude.includes( option.action ) || optionInclude.includes( '*' ) ) {
                                return `
                                    <button class="button_0j7dDLZ pointer" data-action="${ option.action }">
                                        ${ Icon.get( option.icon ) }
                                        <span class="text-ellipsis">${ option.name }</span>
                                    </button>
                                `
                            }

                            return ''

                        }).join('')

                    }
                </div>
            </div>
        </div>
    `)

    const elements = ele.object( ElementComponent.querySelectorAll('[id]'), 'id', true )
    const { closeElement, elementOption } = elements

    elementOption.addEventListener('click', e => {
        const button = e.target.closest('button')

        if( button ) {

            const action = button.getAttribute('data-action')
            ElementComponent.dispatchEvent(new CustomEvent('_click', { detail : { action } }))
            ElementComponent.remove()

        }

    })

    closeElement.addEventListener('click', ()=> {
        ElementComponent.remove()
    })

    return ElementComponent

}