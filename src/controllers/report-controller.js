const fs = require('fs');
const path = require('path');  // Agrega esta línea para requerir el módulo path
const invoice = require('../data/clients');
const { createInvoice } = require('../helpers/pdfGenerator');

const getPdf = async (req, res) => {
    const { client } = require('../data/clients');
    const pdfContent = createInvoice(client);
  
    // Configurar la respuesta HTTP
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=invoice-${client.invoice_nr}.pdf`);
  
    // Enviar el contenido del PDF como respuesta
    pdfContent.pipe(res);
  };

module.exports = {
  getPdf,
};
