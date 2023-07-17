const fs = require('fs');;

const requestHandlers=(req,res)=>{
    const url=req.url;
    const method=req.method;
    if (url === '/') {
        fs.readFile('message.txt', { encoding: 'utf-8' }, (err, data) => {
          if (err) {
            console.log(err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'text/html');
            res.write('<html>');
            res.write('<head><title>500 Internal Server Error</title></head>');
            res.write('<body><h1>500 Internal Server Error</h1></body>');
            res.write('</html>');
            return res.end();
          }
    
          res.setHeader('Content-Type', 'text/html');
          res.write('<html>');
          res.write('<head><title>Enter Message</title></head>');
          res.write('<body>');
          res.write(data);
          res.write('<form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form>');
          res.write('</body>');
          res.write('</html>');
          return res.end();
        });
      } else if (url === '/message' && method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {
          console.log(chunk);
          body.push(chunk);
        });
    
        return req.on('end', () => {
          const parsedBody = Buffer.concat(body).toString();
          console.log(parsedBody);
          const message = parsedBody.split('=')[1];
          fs.writeFile('message.txt', message, (error) => {
            if (error) {
              console.error(error);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'text/html');
              res.write('<html>');
              res.write('<head><title>500 Internal Server Error</title></head>');
              res.write('<body><h1>500 Internal Server Error</h1></body>');
              res.write('</html>');
              return res.end();
            }
            res.statusCode = 302;
            res.setHeader('Location', '/');
            return res.end();
          });
        });
      } else {
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>404 Not Found</title></head>');
        res.write('<body><h1>404 Not Found</h1></body>');
        res.write('</html>');
        res.end();
      }

}

module.exports=requestHandlers;