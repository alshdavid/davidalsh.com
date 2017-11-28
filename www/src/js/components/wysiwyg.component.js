export default     {
    template: "<div></div>",
    props: ['value'],
    mounted: function(){
        let editorElm = document.createElement("DIV")
        const editor = pell.init({
            element: editorElm,
            onChange: html => this.$emit('input', html),
            styleWithCSS: true,
            actions: [
                'bold',
                'underline',
                {
                    name: 'italic',
                    result: () => pell.exec('italic')
                },
                {
                    name: 'image',
                    result: () => {
                    const url = window.prompt('Enter the image URL')
                    if (url) pell.exec('insertImage', ensureHTTP(url))
                    }
                },
                {
                    name: 'link',
                    result: () => {
                    const url = window.prompt('Enter the link URL')
                    if (url) pell.exec('createLink', ensureHTTP(url))
                    }
                }
            ]
        })
        editor.content.innerHTML = this.value
        
        this.$el.appendChild(editor)
    }
}
