export default (data = {})=>{
    
    const ElementComponent = ele.create(`
        <div class="div_42I5qPU">
            <div id="closeElement" class="div_17oF1YJ"></div>
            <div class="div_9zTp24Q scroll-y">
                <div class="div_m1idsX6">
                    <p>${ data.message ?? '-' }</p>
                </div>
                <div class="div_Y7WZ8y5">
                    <button id="buttonCancel" class="button_lXEj42j pointer">Cancelar</button>
                    <button id="buttonConfirm" class="button_lXEj42j pointer dark">Confirmar</button>
                </div>
            </div>
        </div>
    `)

    const element = ele.object( ElementComponent.querySelectorAll('[id]'), 'id', true )
    const { closeElement , buttonCancel, buttonConfirm } = element

    const elementDispatch = new CustomEvent('_click')

    closeElement.addEventListener('click', ()=> {
        ElementComponent.remove()
    })

    buttonCancel.addEventListener('click', ()=> {
        ElementComponent.remove()
    })

    buttonConfirm.addEventListener('click', ()=> {
        ElementComponent.remove()
        ElementComponent.dispatchEvent( elementDispatch )
    })

    return ElementComponent

}