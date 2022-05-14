function loadTimelineToMainDiv() {
    $.ajax({
        type: "get",
        url: "http://localhost:5000/timeline/getAllEvents",
        success: (data) => {
            console.log(typeof(data))
            console.log(data.length)
            // $("main").html(data)  //stringfy하거나..

            for (i = 0; i < data.length; i++) {

                $("main").append(`
                <div class="log">
            <p> <b>Text:</b> ${data[i].text} </p>
            <p> <b>Time:</b> ${data[i].time} </p>
            <p> <b>Hits:</b> ${data[i].hits} </p>
            <button class="likeButtons" id="${data[i]["_id"]}"> Like! </button>
            <button class="deleteButtons" id="${data[i]["_id"]}"> Delete! </button>
            </div>`)
            }
        }
    })
}

function increaseHits() {
    x = this.id
    $.ajax({
        url: `http://localhost:5000/timeline/increaseHits/${x}`,
        type: "get",
        success: (res) => {console.log(x)}
    })
}

function deleteThisBtn() {
    $(this).parent().hide()
}


function setup() {
    loadTimelineToMainDiv()


    $("body").on("click", ".likeButtons", increaseHits)
    $("body").on("click", ".deleteButtons", deleteThisBtn)
}

$(document).ready(setup)