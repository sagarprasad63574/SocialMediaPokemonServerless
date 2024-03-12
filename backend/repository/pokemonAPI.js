import Pokedex from 'pokedex-promise-v2';
const P = new Pokedex();

(async () => { // with Async/Await
    try {
        const response = await P.getPokemonByName("butterfree")
        console.log(response)
    } catch (error) {
        throw error
    }
})()
