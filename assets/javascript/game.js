

var config = {
    apikey: "AIzaSyAXb3Kn2gxmzUrRh1O0wlcfsNKe3uStpOM",
    authDomain: "https://bookclub-5e3c6.firebaseapp.com/",
    databaseURL: "https://bookclub-5e3c6.firebaseio.com/",
    projectID: "bookclub-5e3c6"
}
firebase.initializeApp(config)
var database = firebase.database()

$(".sign-in-btn").on("click", function () {
    
    $(".section2").removeClass("d-none")
    
    $("#sign-up").on("submit", function (e) {
        
        e.preventDefault()
        
        database.ref("/users/").push({
            name: $("#username").val(),
            password: $("#password").val()
        })
        $(".section2").addClass("d-none")
    })

    database.ref().on("value", function (snapshot) {
        console.log(snapshot)
    })
})

$.ajax({
    url: "https://www.googleapis.com/books/v1/volumes",
    data: {
        q: "empathy",
        orderBy: "newest"
    }
}).then(function(resp) {
    
    for (i in resp.items) {
        let link = resp.items[i].volumeInfo.imageLinks.thumbnail

        let image = $("<img src='" + link + "' >")
        $("#img").append(image)

        console.log(resp.items)
    }
})
