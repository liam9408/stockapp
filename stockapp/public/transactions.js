$(()=>{

    var actionSelector = document.getElementById('action')
    var stockInput = document.getElementById('stock')
    var portfolioInput = document.getElementById('portfolio')
    var priceInput = document.getElementById('price')
    var amountInput = document.getElementById('amount')
    var submit = document.getElementById('submit')

    console.log(actionSelector)
    console.log(stockInput)
    console.log(priceInput)
    console.log(amountInput)
    console.log(submit)


    $(submit).on('click', (event) => {
        var action = $(actionSelector).val()
        var stock = $(stockInput).val()
        var portfolio = $(portfolioInput).val()
        var price = $(priceInput).val()
        var amount = $(amountInput).val()

        $.ajax({
            url: `/api/transactions/${stock}/${portfolio}/${action}/${amount}/${price}`,
            type: 'POST',
            data: {
                stock: stock,
                portfolio: portfolio,
                action: 'action',
                amount: amount,
                price, price
            },
            success: function(result){
                console.log(result)
            }
        })
        // console.log(stock, portfolio, action, amount, price)
        location.reload()
    })
})