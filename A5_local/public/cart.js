var totalItems = 1
var totalAmt = 0

function loadTimelineToMainDiv() {
    $.ajax({
        type: "get",
        url: "http://localhost:5000/cart/getcart",
        success: (data) => {
            // console.log(typeof (data))
            // console.log(data.length)
            // $("main").html(data)  //stringfy하거나..
            console.log(data)
            result = ""
            result += "<table>"
            result += `<tr>
                        <th>Pokemon</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Add</th>
                        </tr>
                        `


            for (i = 0; i < data.length; i++) {
                result += "<tr>"
                result += `<td> <center><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data[i].pokeID}.png" style="height:70px;"></center> </td>`
                result += `<td id='quantity_${i}'> <center>${data[i].qty} </center></td>`
                result += `<td id='price_${i}'> <center>${data[i].price} </center></td>`
                result += `<td> <center><button class="addQtyBtn" id="${data[i]["_id"]}"> Add 1 more </button> </center></td>`
                result += "</tr>"
                totalItems++
                subtotal = data[i].qty * data[i].price
                totalAmt += subtotal

            }

            result += "</table>"

            $("main").html(result)
        }
    })
}

function increaseQtys() {
    x = this.id
    $.ajax({
        url: `https://dry-plateau-70570.herokuapp.com/cart/increaseQtys/${x}`,
        type: "get",
        success: (res) => {
            console.log(x)
        }
    })
}

function getTotalPrice() {
    console.log("placed order")
    console.log(subtotal)
    console.log(totalAmt)
    $("#total").html(`<center>
    You are purchasing ${subtotal} pokemons. <br> Total purchase amount: $${totalAmt}
    <br>
    Thanks for visiting us!
    <br>
    <br>
    </center>`)
    $("#total").show()
}

function setup() {
    loadTimelineToMainDiv()


    $("body").on("click", ".addQtyBtn", increaseQtys)
    $("body").on("click", "#checkout", getTotalPrice)
    $("#total").hide()

}

$(document).ready(setup)