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

// const pokenumber1 = [...Array(898).keys()] // 0,1,,,,897
// for (i = 0; i < pokenumber1.length; i++) {
//     pokenumber1[i] += 1
// }
// const pokenumber2 = [...Array(228).keys()] // 0,1,,,,227
// for (i = 0; i < pokenumber2.length; i++) {
//     pokenumber2[i] += 10001
// }

// const all_poke = pokenumber1.concat(pokenumber2)
// console.log(all_poke)

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
    for (i = 0; i < all_poke.length; i++) { // iterate over 100 pokemons
        //나쁜 방법이지만 ajax로 100번 리퀘스트 보내보잨ㅋㅋ
        $.ajax({
            type: "GET",
            url: `https://pokeapi.co/api/v2/pokemon/${all_poke[i]}`,
            // url: `http://localhost:5000/search/db/?q=${all_poke[i]}`,
            success: process_fn
        })
    }
}

//only used for color criteria
function ajax_call_template_color(process_fn) {
    for (i = 0; i < all_poke.length; i++) {
        $.ajax({
            type: "GET",
            url: `https://pokeapi.co/api/v2/pokemon-species/${all_poke[i]}`,
            success: process_fn
        })
    }
}

function ajax_calling(criteria) {

    switch (criteria) {
        case "type":
            ajax_call_template(processSinglePokemonResp_type)
            break;
        case "id":
            ajax_call_template(processSinglePokemonResp_id)
            break;
        case "color":
            ajax_call_template_color(processSinglePokemonResp_color)
            break;

    }
}


function display(criteria, input_value) {
    $("main").empty();


    inputGlobal = input_value
    add_history(criteria, inputGlobal);

    ajax_calling(criteria)

}

function display_in_id() {
    $("main").empty();
    id_ = $("#poke_id").val()
    inputGlobal = id_

    if (isNaN(inputGlobal)) {
        alert("please enter number for id")
    } else {
        ajax_calling("id");
    }

    add_history("id", inputGlobal)
}


function add_history(criteria, input_value) {

    remove_btn = `<input class="remove_btn" type="submit" value="remove"> </input>`

    $("#history_").append("<div class='history_link'>" + criteria + " : " + input_value + "</div>" + remove_btn)

    // $("#history_").append(`<div class='history_link'> 
    // <span id= 'history_criteria'> ${criteria} </span> : ${input_value} ${remove_btn}
    // </div>`)

}



function display_prev_result() {
    history_row = $(this).text()
    criteriaArray = history_row.split(":")
    criteria = criteriaArray[0].trim()
    input_value = criteriaArray[1].trim()

    // show_prev(criteria, input_value)

    if (criteria == "id") {
        $("main").empty();
        inputGlobal = input_value
        add_history("id", inputGlobal)
        ajax_calling("id");
    } else {

        display(criteria, input_value)
    }
}

function remove_() {
    $(this).parent().hide()
}

function remove_history() {
    $('.history_link').hide()
}

var now = new Date(Date.now());
var formatted = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();

function insertEventTimeline(input) {
    $.ajax({
        type: "put",
        url: "https://dry-plateau-70570.herokuapp.com/timeline/insert",
        data: {
            "text": `You have searched for Pokemon based on category: ${input}`,
            "hits": 1,
            "time": now
        },
        success: (res) => {console.log(res)}
    })
}





function setup() {
    type_ = $("#poke_type option:selected").val()
    display("type", type_);
    //default showing

    $("#poke_type").change(() => {
        type_ = $("#poke_type option:selected").val()
        console.log(type_)
        display("type", type_);
        // add_history("type", type_);
        insertEventTimeline(type_)
    })

    color_ = $("#poke_color option:selected").val()
    $("#poke_color").change(() => {
        color_ = $("#poke_color option:selected").val()
        // console.log(type_)
        display("color", color_);
        insertEventTimeline(color_)


    })

    $('#search_btn').click(display_in_id)
    $('body').on("click", '.remove_btn', remove_)
    $('body').on("click", '#delete_history_btn', remove_history)
    $('body').on("click", '.history_link', display_prev_result)



}

$(document).ready(setup);