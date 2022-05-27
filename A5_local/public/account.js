function showInDiv(data) {
console.log(data)
console.log(data.user_id)

x = data.user_id


if (data.role == "admin") {
    $('#manage_user').show()
    $("#userinfo").html(`<b>${x}</b>`)
}
else{

    data += `<br> Long time no see!`
    $("#userinfo").html(`<b>${x}</b>`)
}
}

async function displayUserInfo() {
    await $.ajax({
        type: "get",
        url: "https://floating-badlands-56464.herokuapp.com/getuserinfo",
        success: showInDiv
    })
}





function setup() {
    displayUserInfo();

    $('#manage_user').hide()

}

$(document).ready(setup);