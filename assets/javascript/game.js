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