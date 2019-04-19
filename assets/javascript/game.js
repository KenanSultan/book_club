var config = {
    apikey: "AIzaSyAXb3Kn2gxmzUrRh1O0wlcfsNKe3uStpOM",
    authDomain: "https://bookclub-5e3c6.firebaseapp.com/",
    databaseURL: "https://bookclub-5e3c6.firebaseio.com/",
    projectID: "bookclub-5e3c6"
}
firebase.initializeApp(config)
var database = firebase.database()

function reset() {
    key = ""
    enter = false
    user_name = ""
    $(".sign-in-name").html("")
}

reset()

if (localStorage.getItem("user")) {
    var user = JSON.parse(localStorage.getItem("user"))
    var name = user.name
    var password = user.password

    database.ref("users").once("value", function (snap) {
        var obj = snap.val()
        for (i in obj) {
            if (name == obj[i].name && password == obj[i].password) {
                key = i
                enter = true
                break
            }
        }
        if (enter == false) {
            alert("Wrong username or password.")
        } else {
            console.log("girdin")

            after_login()
        }
    })
}

function after_login() {
    database.ref("users/" + key).on("value", function (snap) {
        var user = snap.val()
        user_name = user.name
        voted_books = user.votedBooks
        $(".sign-in-name").html(user_name)
    })

    $(".section2").addClass("d-none")
}

database.ref("bookOnDiscussion").on("value", function (snapshot) {
    var book = snapshot.val()
    console.log(book)
    let image = $("<img>").attr("src", book.poster)
    $("#book-post").append(image)


    $(".book-name").append($("<h2>").text(book.name))
    $(".author-name h4").text(book.author)
    $(".quote-book p").text(book.description)
    
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
            let y = isbnArr[i]

            arr[i] = arr[i - 1]
            arr[i - 1] = x

            isbnArr[i] = isbnArr[i-1]
            isbnArr[i-1] = y

            i--
        }
    }

    $("#booklist-table-holder").empty()
    for (let i = 0; i < arr.length; i++) {
        let column = $("<tr>").append($("<th scope='row'>").text(i + 1))
        let buton = $("<button>").addClass("btn btn-info vote-btn").text("Vote")
        buton.attr("data-isbn", isbnArr[i]).attr("data-vote", arr[i].vote)
        column.append($("<td>").text(arr[i].name))
        column.append($("<td>").text(arr[i].author))
        column.append($("<td>").text(arr[i].vote))
        column.append($("<td>").append(buton))
        $("#booklist-table-holder").append(column)
    }

    $("#list5").empty()
    $("#list5").append($("<div class='col-2'>"))
    for (let i = 0; i < 5; i++) {
        let vote_part1 = $("<div class='col-7'>").append($("<span>").text("vote"))
        let vote_part2 = $("<div class='col-5'>").append($("<span class='vote-count'>").text(arr[i].vote))
        let vote_section = $("<div class='row text-center vote'>").append(vote_part1).append(vote_part2)
        let image = $("<img class='w-100'>").attr("src", arr[i].poster)
        let next_week_book = $("<div class='next-week-book px-3'>").append(image).append(vote_section)
        $("#list5").append($("<div class='col-2'>").append(next_week_book))
    }
})

$(document).on("click", ".vote-btn", function() {
    console.log("vote", $(this).attr("data-name"))
    var isbn = $(this).attr("data-isbn")
    var vote = parseInt($(this).attr("data-vote"))  + 1
    console.log(vote)
    database.ref("votes/"+isbn).update({
        vote
    })
})

$(".sign-in-btn").on("click", function () {
    if(enter){
        $("#logout-btn").removeClass("d-none")
    } else {
        $(".section2").removeClass("d-none")
    }
})

$("#logout-btn").on("click", function() {
    $("#logout-btn").addClass("d-none")
    reset()
    localStorage.removeItem("user")
})

$("#sign-in").on("submit", function (e) {
    e.preventDefault()
    let name = $("#username").val()
    let password = $("#password").val()


    database.ref("users").once("value", function (snap) {
        var obj = snap.val()
        for (i in obj) {
            if (name == obj[i].name && password == obj[i].password) {
                key = i
                enter = true
                break
            }
        }
        if (enter == false) {
            alert("Wrong username or password.")
        } else {
            console.log("girdin")

            user = {
                name,
                password
            }

            localStorage.setItem("user", JSON.stringify(user))

            after_login()
        }
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
                    poster: resp.items[0].volumeInfo.imageLinks.thumbnail,
                    description: resp.items[0].volumeInfo.description
                })
            } else {
                for (i in books) {
                    if (i != isbn) {
                        database.ref("/books/" + isbn).set({
                            name: resp.items[0].volumeInfo.title,
                            author: resp.items[0].volumeInfo.authors[0],
                            poster: resp.items[0].volumeInfo.imageLinks.thumbnail,
                            description: resp.items[0].volumeInfo.description
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
                    poster: resp.items[0].volumeInfo.imageLinks.thumbnail,
                    author: resp.items[0].volumeInfo.authors[0],
                    vote: 0
                })

            } else {
                for (i in votes) {
                    if (i != isbn) {
                        database.ref("/votes/" + isbn).set({
                            name: resp.items[0].volumeInfo.title,
                            poster: resp.items[0].volumeInfo.imageLinks.thumbnail,
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

