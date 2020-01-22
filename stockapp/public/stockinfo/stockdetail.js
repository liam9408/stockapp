

$(()=>{

    const apiKey = 'pk_33ba44994cf3468bb0e0aa9487c9b22b'
    const stockName = document.getElementById('stockName')
    const stock = $(stockName).text()
    const addDates = document.getElementById('adddates')
    const removeDates = document.getElementById('removedates')

    const getData = (stockName) => {
        return new Promise ((resolve, reject) => {
            let data = $.get(`https://cloud.iexapis.com/stable/stock/${stockName}/batch?types=quote,news,chart&range=1m&last=10&token=${apiKey}`)
        
            data.then((res) => {
                resolve(res)
            })
            .catch((err) => {
                console.error(err)
            })
        })
    } 

    $.when(getData(stock)).then((data) => {

        const charts = data.chart
        var coordinates = []
        var dates = []

        // console.log(charts)

        for (let entry of charts) {
            // console.log(entry.close)
            // dates.push(entry.date)
            coordinates.push(entry.close)
        }

        // for (var i = 0; i < 6; i++) {
        //     // console.log(entry.close)
        //     console.log(charts[i].close)
        //     coordinates.push(charts[i].close)
        //     // coordinates.push(entry.close)
        // }

        console.log(coordinates)

        for (var i = 0; i < 6; i++) {
            // console.log(entry.close)
            dates.push(charts[i].date)
            // coordinates.push(entry.close)
        }

        // console.log(coordinates)
        // console.log(dates)

        var Max = (Math.max(...coordinates))
        var Min = (Math.min(...coordinates))

        var yMax = Math.round(Max + (Max * 0.05))
        var yMin = Math.round(Min - (Min * 0.05))

        // console.log(yMin, yMax)

        var ctx = document.getElementById('myChart');
        var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Stock Price',
                fill: false,
                data: coordinates,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        max: yMax,
                        min: yMin,
                        suggestedMin: 230,
                        suggestedMax: 350
                    }
                }]
            }
        }
    });
    
    // Max = (Math.max(...myChart.data.datasets[0].data))
    // Min = (Math.min(...myChart.data.datasets[0].data))

    // console.log(Max, Min)

    // yMax = Math.round(Max + (Max * 0.05))
    // yMin = Math.round(Min - (Min * 0.05))


    $(addDates).on('click', (event) => {
        var index = (dates.length) + 1

        // console.log(dates.length)
        // console.log(index)

        // coordinates.push(charts[index].close)
        myChart.data.datasets[0].data.push(charts[index].close)
        myChart.data.labels.push(charts[index].date)
   
        myChart.update()

    })

    $(removeDates).on('click', (event) => {

        // console.log(dates.length)
        // console.log(index)
        
        myChart.data.labels.pop()

        myChart.update()

    })



    })








    
    

})