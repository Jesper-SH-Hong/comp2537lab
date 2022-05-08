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

function processSinglePokemonResp_type(data) {

    for (i = 0; i < data.types.length; i++) {
        if (data.types[i].type.name == inputGlobal) {
            // to_add += `<div class="image_container"> 
            // <a href="/profile/${data.id}">
            // <img src="${data.sprites.other["official-artwork"].front_default}">
            // </a>
            // </div>`

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

function processSinglePokemonResp_color(data) {

    if (data.color.name == inputGlobal) {

        $("main").append(`<div class="image_container"> 
            <a href="/profile/${data.id}">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png">
            </a>
            </div>`)
        $(".image_container").css("background-color", '#eceda1')
    }
}



function ajax_call_template(process_fn) {
    for (i = 1; i <= 100; i++) { // iterate over 100 pokemons
        //나쁜 방법이지만 ajax로 100번 리퀘스트 보내보잨ㅋㅋ
        $.ajax({
            type: "GET",
            url: `https://pokeapi.co/api/v2/pokemon/${i}`,
            success: process_fn
        })
    }
}

function ajax_call_template_color(process_fn) {
    for (i = 1; i <= 100; i++) { // iterate over 100 pokemons
        //나쁜 방법이지만 ajax로 100번 리퀘스트 보내보잨ㅋㅋ
        $.ajax({
            type: "GET",
            url: `https://pokeapi.co/api/v2/pokemon-species/${i}`,
            success: process_fn
        })
    }
}

function ajax_calling(criteria) {

    switch (criteria) {
        case "type":
            ajax_call_template(processSinglePokemonResp_type)
            break;
        case "color":
            ajax_call_template_color(processSinglePokemonResp_color)
            break;

    }
}


function display(criteria, input_value) {
    $("main").empty();


    inputGlobal = input_value
    ajax_calling(criteria)

    // case "color":
    //     inputGlobal = input_value
    //     ajax_calling(color_)
    //     break;
    // case "region":
    //     inputGlobal = region_
    // case "id":
    //     inputGlobal = id_

    // }
    // console.log(inputGlobal)
    // for (i = 1; i <= 100; i++) { // iterate over 100 pokemons
    //     //나쁜 방법이지만 ajax로 100번 리퀘스트 보내보잨ㅋㅋ
    //     $.ajax({
    //         type: "GET",
    //         url: `https://pokeapi.co/api/v2/pokemon/${i}`,
    //         success: processSinglePokemonResp

    //     })
    // }

}





function setup() {
    type_ = $("#poke_type option:selected").val()
    display("type", type_); //default showing

    $("#poke_type").change(() => {
        type_ = $("#poke_type option:selected").val()
        console.log(type_)
        display("type", type_);
    })

    color_ = $("#poke_color option:selected").val()
    $("#poke_color").change(() => {
        color_ = $("#poke_color option:selected").val()
        // console.log(type_)
        display("color", color_);
    })

    //region

    //id
}

$(document).ready(setup);