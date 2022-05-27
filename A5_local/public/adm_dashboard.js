function showInDiv(data) {


    result = ""
    result += "<table>"
    result += `<tr>
    <th>ID</th>
    <th>role</th>
    <th>Action</th>
    </tr>
    `

    for (i = 0; i < data.length; i++) {
        result += "<tr>"
        result += `<td id='user_id'> <center>${data[i]['user_id']} </center></td>`
        result += `<td id='role'> <center>${data[i].role} </center></td>`

        result += `<td> <center><button name =${data[i].role} class="deleteUser" id="${data[i]["user_id"]}"> Delete user </button> </center></td>`
        result += "</tr>"
        // data[i]

        // data += `<br> Long time no see!`
        // $("#dashboard").append(`${data[i]['user_id']} <br>`)

        // console.log(data)
    }

    result += "</table>"
    $("#dashboard").html(result)

}

function displayUserInfo() {
    $.ajax({
        type: "get",
        url: "http://localhost:5000/adminGetAllUsers",
        success: showInDiv
    })
}


function deleteThisUser() {
    x = this.id
    console.log(x)
    y = this.name
    console.log(y)

    if (y != "admin") {
        console.log(222)
        $.ajax({
            type: "get",
            url: `http://localhost:5000/deleteThisUser/${x}`,
            success: () => {
                alert("User has been deleted")
            }
        })
    } else {
        alert("You can't delete Admin")
    }

}



function setup() {
    displayUserInfo();

    $("body").on("click", ".deleteUser", deleteThisUser)

    $('#addUser').hide()

    $('#showAddUserButton').click(() => {
        $('#addUser').show()
    })



}

$(document).ready(setup);