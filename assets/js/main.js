const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const modal = document.querySelector("#modal")
const modalHeader = document.querySelector('#modal-header') 
const modalContent = document.querySelector('#modal-content')

const maxRecords = 151
const limit = 10
let offset = 0;
let backgroundModal = ""

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}"  onClick="showDetails(${pokemon.number})">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

function showDetails(detailsPokemon){
    
    modal.className = "showModal"
    detailPokemon(detailsPokemon)
    
}
function hideDetails(){
    modal.classList.remove("showModal")
    modalHeader.classList.remove(backgroundModal)
    modalHeader.innerHTML = ""
    modalContent.innerHTML = ""
}
async function detailPokemon(id){
    let req = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
    let res = await req.json()
    construirModalDetails(res)
}

function construirModalDetails(detalhe){
    backgroundModal = detalhe.types[0].type.name
    img = [detalhe.sprites.front_default, detalhe.sprites.back_default]
    modalHeader.className = backgroundModal
    modalHeader.innerHTML = `
        <h3>${detalhe.name}</h3>

        <div class="modalHeader">
            <ul>
                <li><strong>${backgroundModal}</strong></li>
                <li><strong>${detalhe.types[1].type.name}</strong></li>
            </ul>
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${detalhe.id}.svg">
        </div>
    `
    modalContent.innerHTML = `
        <table>
            <tbody>
                <tr>
                    <td>abilities</td>
                    <td>
                        <ul>
                            <li><span>${detalhe.abilities[0].ability.name}</span></li>
                            <li><span>${detalhe.abilities[1].ability.name}</span></li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td>weight</td>
                    <td><span>${detalhe.weight}</span></td>
                </tr>
                <tr>
                    <td>height</td>
                    <td><span>${detalhe.height}</span></td>
                </tr>
            </tbody>
        </table>
    `
    console.log(detalhe)
}