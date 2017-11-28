import State from './model/state.model'

export let state = new State()

fetch('https://api.jsonpen.com/b/davidalsh')
    .then(x => x.json())
    .then(x => Object.assign(state, x))