export default {
    template: `
        <div class="app-image">
            <div class="app-image-thumb" 
                v-bind:style="{
                    'background-image' : 'url(' + thumb + ')'
                }
            "></div>
            <div class="app-image-background" 
                v-if="loadedImage"
                v-bind:style="{
                    'background-image' : 'url(' + loadedImage + ')'
                }
            "></div>
        </div>
    `,
    props: ["src", "thumb"],
    data: ()=>({
        loadedImage: ""
    }),
    methods: {},
    created: function(){
        let hero = document.createElement("IMG")
        hero.onload = () => this.loadedImage = this.src
        hero.src = this.src
    }
  }