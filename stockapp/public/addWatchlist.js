$(()=>{

    var stockInput = document.getElementById('addWatchlist')
    var submit = document.getElementById('watchlistSubmit')
    var form = document.getElementById('watchlistForm')

    var del = document.getElementById('watchlistDelete')

    console.log(stockInput)
    console.log(submit)
    console.log(del)
    console.log(form)

    $(form).on('submit', (event) => {

        var stock = $(stockInput).val()

        $.ajax({
            url: `/api/addwatchlist/${stock}`,
            type: 'POST',
            data: {
                stock: stock,
            },
            success: function(result){
                console.log(result)
            }
        })
        location.reload()
    })

    $(del).on('click', (event) => {
        var stock = $(stockInput).val()

        $.ajax({
            url: `/api/delwatchlist/${stock}`,
            type: 'DELETE',
            data: {
                stock: stock,
            },
            success: function(result){
                console.log(result)
            }
        })
        location.reload()
    })

})