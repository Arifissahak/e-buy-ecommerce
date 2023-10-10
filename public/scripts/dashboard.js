const ctx = document.getElementById('orderChart');
                const categoryChart = document.getElementById('categoryChart')
                window.onload = function () {
                    console.log('onload')
                    let orderData, orderLabel;
                    const reqUrl = '/admin/chart-data'
                    fetch(reqUrl)
                        .then(res => res.json())
                        .then((res) => {
                            if (res.success) {
                                generateOrderChart(res.orderStatusLabel, res.orderStatusData)
                                generateCateogryGraph(res.categoryNames, res.categoryCount)
                            }
                        })




                }

                //function generate order chart with given value

                function generateOrderChart(orderLabel, orderData) {
                    Chart.defaults.font.size = 16;
                    new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: orderLabel,
                            datasets: [{
                                label: 'Order Status',
                                data: orderData,
                                backgroundColor: [
                                    'rgba(5, 181, 11, 1)',
                                    'rgba(245, 66, 66, 1)',
                                    'rgba(255, 200, 0, 1)'

                                ],
                                borderWidth: 1
                            }]
                        },
                        options: {
                            zscales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    });
                }

                function generateCateogryGraph(categoryLabel, categoryData) {
                    const data = {
                        labels: categoryLabel,
                        datasets: [{
                            label: 'Available',
                            backgroundColor:
                                [
                                    'rgba(8, 37, 103)',
                                    'rgba(16, 52, 166)',
                                    'rgba(67, 107, 149)',
                                    'rgba(0, 90, 146)',
                                    'rgba(0, 0, 128)',
                                    'rgba(0, 127, 255)'
                                ],
                            data: categoryData,
                        }]
                    };

                    const config = {
                        type: 'pie',
                        data: data,
                        options: {
                            responsive: true,
                            maintainAspectRatio: false
                        }
                    };

                    new Chart(categoryChart, config)
                }