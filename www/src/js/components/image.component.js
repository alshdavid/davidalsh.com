export default {
    template: `
        <div class="app-image">
            <div class="app-image-thumb" 
                v-if="!loadedImage"
                v-bind:style="{
                    'background-image' : 'url(' + thumb + ')'
                }
            "></div>
            <div class="app-image-background" 
                v-if="loadedImage"
                v-bind:style="{
                    'background-image' : 'url(' + loadedImage + ')'
                }"
            ></div>
        </div>
    `,
    props: ["src", "thumb"],
    data: ()=>({
        loadedImage: ""
    }),
    methods: {},
    watch: { 
        src: function(newVal, oldVal) {
            console.log('Image changed: ', newVal)
            loadImage(newVal)
                .then(x => {
                    this.loadedImage = x
                    console.log("loaded")
                })

        },
        thumb: function(newVal, oldVal) {
            
        }
    },
    created: function(){
        if (this.src) {
            loadImage(this.src)
                .then(x => {
                    this.loadedImage = x
                    console.log("loaded")
                })
        }
    }
}

function loadImage(url){
    return new Promise((res) => {
        let hero = document.createElement("IMG")
        hero.onload = () => {
            res(url)
            hero.remove()
        }
        hero.src = url
    })
}