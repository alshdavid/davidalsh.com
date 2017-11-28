import pell from '../lib/pell.lib'
import { state } from '../app.state'
window.pell = pell

export default {
        authoriation: "",
        details: {
            username: "",
            password: "",
        },
        is: (window.location.pathname === "/admin"),
        login: function(){
            console.log(JSON.stringify(this.details))
            fetch('https://api.jsonpen.com/login/davidalsh', {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(this.details)
            })
            .then(x => x.json())
            .then(x => app.admin.authorization = x.data.authorization)
            .then(x => {
                app.admin.is = false
                //setTimeout(_ => initAdmin(), 100)
            })
        },
        update: function(data){
            fetch('https://api.jsonpen.com/b/davidalsh', {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "authorization": app.admin.authorization
                },
                body: JSON.stringify(data)
            })
            .then(x => x.json())
            .then(x => alert(x.message))
        },
        updateHero: {
            thumb: function(){
                let image = prompt("Enter Image URL")
                if (!image) return
                app.state.hero.thumb = image
            },
            src: function(){
                let image = prompt("Enter Image URL")
                if (!image) return
                app.state.hero.src = image
            }
        },
        addSkill: function(){
            let image = prompt("Enter Image URL")
            if (!image) return
            app.state.skills.push({
                image: image
            })
        },
        updateMyPicture: function(){
            let image = prompt("Enter Image URL")
            if (!image) return
            app.state.my_picture = image
        },
        addPortfolio: function(){
            let name = prompt("Enter Name")
            let thumb = prompt("Enter Image URL")
            let brand_color = prompt("Enter Brand Color")
            let brand_color_muted = prompt("Enter Muter Brand Color")
            app.state.projects.push({
                name: name,
                brand_color: {
                    brand: brand_color || "#fff",
                    muted: brand_color_muted || "#fff"
                },
                thumb: thumb
            })
        },
    }
    

