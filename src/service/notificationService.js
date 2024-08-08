const soap = require('soap');
app.post('/sendInvoice', (req, res) => {
    const xmlSigned = fs.readFileSync('path/to/your/signed_invoice.xml', 'utf8');
  
    // URL del WSDL del SIFEN para el ambiente de pruebas o producción
    const url = 'https://sifen-test.set.gov.py/de/ws/sync/recibe.wsdl?wsdl';
    const args = { xml: xmlSigned };
  
    // Crear cliente SOAP y enviar solicitud
    soap.createClient(url, (err, client) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error al crear el cliente SOAP');
        return;
      }
  
      // Nombre del método según el WSDL del SIFEN
      client.recibeDE(args, (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error al enviar la solicitud SOAP');
          return;
        }
  
        // Procesar la respuesta
        console.log(result);
        res.send(result);
      });
    });
  });