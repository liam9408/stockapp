$(()=>{

    var actionSelector = document.getElementById('action')
    var stockInput = document.getElementById('stock')
    var portfolioInput = document.getElementById('portfolio')
    var priceInput = document.getElementById('price')
    var amountInput = document.getElementById('amount')
    var submit = document.getElementById('submit')


    $(submit).on('click', (event) => {

        // capturing all the values from the form
        var action = $(actionSelector).val()
        var stock = $(stockInput).val()
        var portfolio = $(portfolioInput).val()
        var price = $(priceInput).val()
        var amount = $(amountInput).val()

        if (action === 'buy') {
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
        }
        else if (action === 'sell') {
            var sellAmount = (0 - amount);
            console.log(sellAmount)
            $.ajax({
                url: `/api/transactions/${stock}/${portfolio}/${action}/${sellAmount}/${price}`,
                type: 'POST',
                data: {
                    stock: stock,
                    portfolio: portfolio,
                    action: 'action',
                    amount: sellAmount,
                    price, price
                },
                success: function(result){
                    console.log(result)
                }
            })
        }
        location.reload()
    })
})