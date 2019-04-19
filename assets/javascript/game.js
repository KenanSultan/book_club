

var config = {
    apikey: "AIzaSyAXb3Kn2gxmzUrRh1O0wlcfsNKe3uStpOM",
    authDomain: "https://bookclub-5e3c6.firebaseapp.com/",
    databaseURL: "https://bookclub-5e3c6.firebaseio.com/",
    projectID: "bookclub-5e3c6"
}
firebase.initializeApp(config)
var database = firebase.database()

database.ref("books").on("value", function (snapshot) {
    var books = snapshot.val()
})

database.ref("votes").on("value", function (snapshot) {
    var votes = snapshot.val()
    arr = []
    isbnArr = []

    for (i in votes) {
        arr.push(votes[i])
        isbnArr.push(i)
    }

    for (let i = 1; i < arr.length; i++) {
        while (i > 0 && arr[i].vote > arr[i - 1].vote) {
            let x = arr[i]
            arr[i] = arr[i - 1]
            arr[i - 1] = x
            i--
        }
    }

    $("#booklist-table-holder").empty()
    for (let i = 0; i < arr.length; i++) {
        let column = $("<tr>").append($("<th scope='row'>").text(i + 1))
        let buton = $("<button>").addClass("btn btn-info vote-btn").attr("data-isbn", isbnArr[i]).text("Vote")
        column.append($("<td>").text(arr[i].name))
        column.append($("<td>").text(arr[i].author))
        column.append($("<td>").text(arr[i].vote))
        column.append($("<td>").append(buton))
        $("#booklist-table-holder").append(column)
    }
})

$(".vote-btn").on("click", function() {

})

$(".sign-in-btn").on("click", function () {
    $(".section2").removeClass("d-none")

    $("#sign-up").on("submit", function (e) {

        e.preventDefault()
        database.ref("/users/").push({
            name: $("#username").val(),
            password: $("#password").val()
        })
        $(".sign-in").html($("#username").val())
        $("#username").val("")
        $("#password").val("")
        $(".section2").addClass("d-none")
    })
})
$("#book-search").on("submit", function (e) {
    e.preventDefault()
    var book_name = $("#book-search-name").val()

    $.ajax({
        url: "https://www.googleapis.com/books/v1/volumes",
        data: {
            q: book_name
        }
    }).then(function (resp) {

        var isbn = resp.items[0].volumeInfo.industryIdentifiers[0].identifier

        database.ref("/books/").once("value", function (snapshot) {
            var books = snapshot.val()
            if (!books) {
                database.ref("/books/" + isbn).set({
                    name: resp.items[0].volumeInfo.title,
                    author: resp.items[0].volumeInfo.authors[0],
                    poster: resp.items[0].volumeInfo.imageLinks.thumbnail
                })
            } else {
                for (i in books) {
                    if (i != isbn) {
                        database.ref("/books/" + isbn).set({
                            name: resp.items[0].volumeInfo.title,
                            author: resp.items[0].volumeInfo.authors[0],
                            poster: resp.items[0].volumeInfo.imageLinks.thumbnail
                        })
                    }
                }
            }
        })
        database.ref("votes").once("value", function (snapshot) {
            var votes = snapshot.val()
            if (!votes) {
                database.ref("/votes/" + isbn).set({
                    name: resp.items[0].volumeInfo.title,
                    author: resp.items[0].volumeInfo.authors[0],
                    vote: 0
                })

            } else {
                for (i in votes) {
                    if (i != isbn) {
                        database.ref("/votes/" + isbn).set({
                            name: resp.items[0].volumeInfo.title,
                            author: resp.items[0].volumeInfo.authors[0],
                            vote: 0
                        })
                    }
                }
            }
        })
    })
})

$("#show-all-list").on("click", function () {

    $(".section3").removeClass("d-none")
    $('html, body').animate({
        scrollTop: $(".section3").offset().top
    }, 2000)

})

