resultList = []
inputGlobal = ''

const colors = {
    fire: '#FDDFDF',
    grass: '#DEFDE0',
    electric: '#FCF7DE',
    water: '#DEF3FD',
    ground: '#f4e7da',
    rock: '#d5d5d4',
    fairy: '#fceaff',
    poison: '#98d7a5',
    bug: '#f8d5a3',
    dragon: '#97b3e6',
    psychic: '#eceda1',
    flying: '#F5F5F5',
    fighting: '#E6E0D4',
    normal: '#F5F5F5'
}


const all_poke = [...Array(300).keys()]
for (i = 0; i < all_poke.length; i++) {
    all_poke[i] += 1
}

function processSinglePokemonResp_type(data) {

    for (i = 0; i < data.types.length; i++) {
        if (data.types[i].type.name == inputGlobal) {

            $("main").append(`<div class="image_container"> 
            <a href="/profile/${data.id}">
            <img src="${data.sprites.other["official-artwork"].front_default}">
            </a>
            </div>`)
            $(".image_container").css("background-color", colors[inputGlobal])
            // $("main").append(`<p>${data.id} </p>`)
            // $("main").append(`<img src="${data.sprite.other[official-artwork].front_default}">`)
        }
    }

}

function processSinglePokemonResp_id(data) {

    if (data.id == inputGlobal) {
        poke_type = data.types[0].type.name

        $("main").append(`<div class="image_container"> 
            <a href="/profile/${data.id}">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png">
            </a>
            </div>`)
        $(".image_container").css("background-color", colors[poke_type])
    }
}

function populate_main(data) {
    id = req.params.id
    pokename = data.name
    "img_path" = data.sprites.other["official-artwork"].front_default
    hp_ = data.stats.filter(   (obj_) => { return obj_.stat.name == "hp" }    ).map(  (k) => { return k.base_stat } );
    attack_  = data.stats.filter(   (obj_) => { return obj_.stat.name == "attack" }    ).map(  (k) => { return k.base_stat } );
    defense_  = data.stats.filter(   (obj_) => { return obj_.stat.name == "defense" }    ).map(  (k) => { return k.base_stat } );
    speed_  = data.stats.filter(   (obj_) => { return obj_.stat.name == "speed" }    ).map(  (k) => { return k.base_stat } );
    types_array = []
    for (i=0; i < data.types.length; i++) {
        types_array.push(data.types[i].type.name)
    }
    types_array_ = types_array

    $("main").append(`    <img src="${image_path}" style="float: left;">
    <div id="spec" style="float: left;">
        <table>
            <tr>
                <td>Pokemon ID:</td>
                <td>${id}</td>
            </tr>
            <tr>
                <td>Type:</td>
                <td>${types_array_}</td>
            </tr>
            <tr>
                <td>HP:</td>
                <td>${hp}</td>
            </tr>
            <tr>
                <td>Attack:</td>
                <td>${attack}</td>
            </tr>
            <tr>
                <td>Defence:</td>
                <td>${defense}</td>
            </tr>
            <tr>
                <td>Speed:</td>
                <td>${speed}</td>
            </tr>
        </table>`)
    $(".image_container").css("background-color", '#eceda1')
    }
}


// function populate_main(data) {
//     $("main").empty();


//     inputGlobal = input_value
//     add_history(criteria, inputGlobal);

//     ajax_calling(criteria)

// }



function display_profile(input) {
    $.ajax({
        type: "get",
        // url: `http://localhost:5000/profile/${req.query.id}`,
        url: `https://pokeapi.co/api/v2/pokemon/${all_poke[i]}`,
        success: populate_main
    })
}





function setup() {
    display_profile()


}

$(document).ready(setup);