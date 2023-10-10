// Import dependencies
const fs = require("fs");
const PDFDocument = require("../storage/pdfTable");

const dateConvert = require('../config/dateConvert')

// Load the patients 
module.exports =  function pdfCreate(documents, date){

    date = new Date(date)

    // Create The PDF document
    const doc = new PDFDocument();

    const month = date.toLocaleString('default', { month: 'long' }); // Get the full month name
    const year = date.getFullYear(); // Get the year

    const salesDate = `${month} ,${year}`


    // Pipe the PDF into a patient file
    doc.pipe(fs.createWriteStream(`./pdf/sales-${salesDate}.pdf`));

    // Add the header - https://pspdfkit.com/blog/2019/generate-invoices-pdfkit-node/
    doc
        .image("./public/assets/icons/E-buy-logo.png", 50, 45, { width: 50 })
        .fillColor("#444444")
        .fontSize(20)
        .text("Sales Details", 110, 50)
        .fontSize(10)
        .text("Sales Details of", 200, 65, { align: "right" })
        .text(salesDate, 200, 80, { align: "right" })
        .moveDown();

    // Create the table - https://www.andronio.me/2017/09/02/pdfkit-tables/
    const table = {
        headers: ["id", "productName", "quantity", "user", "placed at", "paymentMethod", "Total", "Amount Payable"],
        rows: []
    };

    for(let document of documents){
        const date = dateConvert(document.confirmDate)
        table.rows.push( [
            document.order_id, 
            document.items[0].productName, 
            document.items[0].quantity,
            document.user_id, 
            date, 
            document.paymentMethod, 
            document.total, 
            document.amountPayable
        ])
    }

    // Draw the table
    doc.moveDown().table(table, 10, 125, { width: 590 });

    // Finalize the PDF and end the stream
    doc.end();
}