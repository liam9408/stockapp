$(()=>{

    var stockInput = document.getElementById('watchlistStock')
    var submit = document.getElementById('watchlistSubmit')

    console.log(stockInput)
    console.log(submit)


    $(submit).on('click', (event) => {
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
        // console.log(stock, portfolio, action, amount, price)
        location.reload()
    })
})