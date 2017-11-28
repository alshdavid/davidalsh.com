import admin from "./admin/app"
import { state } from "./app.state"
import Image from './components/image.component'
import WYSIWYG from './components/wysiwyg.component'
import { getBinary } from './lib/image_upload.lib'

console.log(state)

const settings = {
    el: '#app',
    data: {
        admin: admin,
        state: state
    },
    methods: {
        save: function(){
            this.admin.update(this.state)
        }
    },
    components: {
        appImage: Image,
        appWysiwyg: WYSIWYG
    }
}

window.app = new Vue(settings)







