$(()=>{

    const accessKey = "90f914b0821ca7043f0c87ce0c2c3df9024b4f50d01233d1cf4510bf7149b7a5"
    const img = document.getElementsByClassName("image")

    const getImage = () => {
        return new Promise ((resolve, reject) => {
            // let data = $.get(`https://api.unsplash.com/photos/random/?client_id=${accessKey}&query=blue`)
            let data = $.get("https:/" + "/api.unsplash.com/photos/random/?client_id=" + accessKey + "&query=blue")

            
            data.then((res) => {
                resolve(res)
            })
            .catch((err) => {
                console.error(err)
            })
        })
    }

    $.when(getImage()).then((data) => {

        var url = data.urls.full
        $(img).css('background-image', `url(${url})`);
        
    })


})


