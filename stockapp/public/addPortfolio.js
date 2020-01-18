$(()=>{

    var portfolioInput = document.getElementById('portfolioName')
    var submit = document.getElementById('portfolioSubmit')
    var del = document.getElementById('portfolioDelete')

    console.log(portfolioInput)
    console.log(submit)
    console.log(del)

    $(submit).on('click', (event) => {
        var portfolio = $(portfolioInput).val()

        $.ajax({
            url: `/api/addportfolio/${portfolio}`,
            type: 'POST',
            data: {
                portfolio: portfolio,
            },
            success: function(result){
                console.log(result)
            }
        })
        location.reload()
    })

    $(del).on('click', (event) => {
        var portfolio = $(portfolioInput).val()

        $.ajax({
            url: `/api/delportfolio/${portfolio}`,
            type: 'DELETE',
            data: {
                portfolio: portfolio,
            },
            success: function(result){
                console.log(result)
            }
        })
        location.reload()
    })
})