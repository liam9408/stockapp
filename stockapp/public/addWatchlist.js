$(()=>{

    var stockInput = document.getElementById('addWatchlist')

    $('#add').click(function() {
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
    });
    
    $('#del').click(function() {
        var stock = $(stockInput).val()

        console.log(stock)

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
    });

})