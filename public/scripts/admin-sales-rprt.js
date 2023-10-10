    // Get the current year
    const currentYear = new Date().getFullYear();

    // Populate the dropdown with years, e.g., from the current year to 10 years back
    const yearDropdown = document.getElementById('yearDropdown');
    for (let year = currentYear; year >= currentYear - 5; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.text = year;
        yearDropdown.appendChild(option);
    }

    function updateDays() {
        const monthSelector = document.getElementById("monthSelector");
        const selectedMonth = monthSelector.value;


        const days = new Date(new Date().getFullYear(), selectedMonth, 0).getDate();
        const dateSelector = document.getElementById('dateSelector')
        for (let i = 1; i <= days; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.text = i;
            dateSelector.appendChild(option);
        }

    }

    function dateConvert(timeStr) {
        const timeStamp = new Date(timeStr)
        const option = { day: 'numeric', month: 'short', year: 'numeric' }

        const timeFormat = timeStamp.toLocaleString('en-Us', option)
        return timeFormat
    }

    function addTableRow(data) {
        let tableBody = document.getElementById('tableBody')

        let row = '';
        let x = 0;
        for (let each of data) {
            let confirmDate = dateConvert(each.confirmDate)
            let names = [];
            let qty = []
            for (let item of each.items) {
                names.push(item.productName)
                qty.push(item.quantity)
            }
            names = names.join(', ')
            qty = qty.join(', ')
            let rowData = ` <tr>
                            <td>${++x}</td>
                            <td>${each.order_id}</td>
                            <td>${names}</td>
                            <td>${qty}</td>
                            <td>${each.user_id}</td>
                            <td>${confirmDate}</td>
                            <td ><p class="ind-rs">${each.total}</p></td>
                            <td><p class="ind-rs">${each.amountPayable}</p></td>
                            </tr>`

            row += rowData
        }

        tableBody.innerHTML = row
    }

    //form submission 
    function submitForm() {

        const formData = new FormData(document.getElementById("dateForm"));
        const day = document.getElementById('dateSelector').value
        const month = document.getElementById('monthSelector').value
        const year = document.getElementById('yearDropdown').value
        const date = {
            day,
            month,
            year
        }

        fetch("/admin/sales-data", {
            method: "POST",
            body: JSON.stringify(date),
            headers: {
                'Content-type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    addTableRow(data.salesData)
                    checkTableChild()
                } else {
                    let tableBody = document.getElementById('tableBody')
                    tableBody.innerHTML = '<h1>no details available now</h1>'
                }

            })
            .catch(error => {
                console.error('Error:', error);
            });


    }

    function checkTableChild(){
        const tableBody = document.getElementById('tableBody')
        const pdfButton = document.getElementById('pdfDownloadBtn')

        if(tableBody.childElementCount > 0){
            pdfButton.style.display = 'inline'
        }else{
            pdfButton.style.display = 'none'
        }
    }

    checkTableChild()

