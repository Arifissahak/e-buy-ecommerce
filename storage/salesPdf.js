

const dateConvert = require('../config/dateConvert');

function generateSalesPDF(doc, documents, date) {
    date = new Date(date);
    
    const month = date.toLocaleString('default', { month: 'long' }); // Get the full month name
    const year = date.getFullYear(); // Get the year

    const salesDate = `${month} ,${year}`

    
            // Add the header - https://pspdfkit.com/blog/2019/generate-invoices-pdfkit-node/
            doc
                .image("./public/assets/icons/E-buy-logo.ong", 50, 45, { width: 50 })
                .fillColor("#444444")
                .fontSize(20)
                .text("Sales Details", 0, 50,{align : 'center'})
                .fontSize(8)
                .text("Sales Details of", 200, 50, { align: "right" })
                .text(salesDate, 200, 60, { align: "right" })
                .moveDown();

            // Create the table - https://www.andronio.me/2017/09/02/pdfkit-tables/
            const table = {
                headers: ["id", "productName", "quantity", "user_id", "placed at", "paymentMethod", "Total", "Amount Payable"],
                rows: []
            };

            let total = 0;

            for (let document of documents) {
                const date = dateConvert(document.confirmDate)
                table.rows.push([
                    document.order_id,
                    document.items[0].productName,
                    document.items[0].quantity,
                    document.user_id,
                    date,
                    document.paymentMethod,
                    document.total,
                    document.amountPayable
                ])

                total+=document.total
            }

            table.rows.push(['','','','','','','total',total])

            // Draw the table
            doc.moveDown().table(table, 10, 125, { width: 590 });


    
    return doc;
}

module.exports = generateSalesPDF;
