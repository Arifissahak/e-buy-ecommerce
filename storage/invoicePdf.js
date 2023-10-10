// const dateConvert = require('../config/dateConvert');

function generateInvoice(doc, document,user) {

            const address = document.address

            // Add the header - https://pspdfkit.com/blog/2019/generate-invoices-pdfkit-node/
            doc
                .image("./public/assets/icons/E-buy-logo.png", 50, 45, { width: 50 })
                .fillColor("#444444")
                .fontSize(20)
                .text("Invoice", 0, 50,{align : 'center'})
                .fontSize(8)
                .text("To", 200, 50, { align: "right" })
                .text(`${user.name}`, 200, 60, { align: "right" })
                .text(`${address.houseName},${address.streetAddress}`, 200, 70, { align: "right" })
                .text(`${address.city},${address.postalcode}`, 200, 80, { align: "right" })
                .text(`${address.state}`, 200, 90, { align: "right" })
                .moveDown();

            // Create the table - https://www.andronio.me/2017/09/02/pdfkit-tables/
            const table = {
                headers: ["Sl no", "productName", "Weight", "Quantity", "Price", "Sum"],
                rows: []
            };
            let i = 0;
            for(let each of document.items){
                table.rows.push([
                    ++i,
                    each.productName,
                    `${each.weight} Kg`,
                    each.quantity,
                    each.price,
                    each.price * each.quantity
                ])
            }

            let total = document.amountPayable

            table.rows.push(['','','','','total',total])

            // Draw the table
            doc.moveDown().table(table, 10, 125, { width: 590 });



    return doc;
}

module.exports = generateInvoice;const dateConvert = require('../config/dateConvert');

function generateInvoice(doc, document,user) {
    
            const address = document.address
    
            // Add the header - https://pspdfkit.com/blog/2019/generate-invoices-pdfkit-node/
            doc
                .image("./public/assets/icons/E-buy-logo.png", 50, 45, { width: 50 })
                .fillColor("#444444")
                .fontSize(20)
                .text("Invoice", 0, 50,{align : 'center'})
                .fontSize(8)
                .text("To", 200, 50, { align: "right" })
                .text(`${user.name}`, 200, 60, { align: "right" })
                .text(`${address.houseName},${address.streetAddress}`, 200, 70, { align: "right" })
                .text(`${address.city},${address.postalcode}`, 200, 80, { align: "right" })
                .text(`${address.state}`, 200, 90, { align: "right" })
                .moveDown();

            // Create the table - https://www.andronio.me/2017/09/02/pdfkit-tables/
            const table = {
                headers: ["Sl no", "productName", "Weight", "Quantity", "Price", "Sum"],
                rows: []
            };
            let i = 0;
            for(let each of document.items){
                table.rows.push([
                    ++i,
                    each.productName,
                    `${each.weight} Kg`,
                    each.quantity,
                    each.price,
                    each.price * each.quantity
                ])
            }

            let total = document.amountPayable

            table.rows.push(['','','','','total',total])

            // Draw the table
            doc.moveDown().table(table, 10, 125, { width: 590 });


    
    return doc;
}

module.exports = generateInvoice;
