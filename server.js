const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const dev = process.env.NODE_ENV !== 'production';
const next = require('next');
const pathMatch = require('path-match');
const app = next({ dev });
const handle = app.getRequestHandler();
const { parse } = require('url');
const https = require('https');
const fs = require('fs');


const apiRoutes = require('./server/routes/apiRoutes.js');



app.prepare().then(() => {
  const server = express();

  server.use(bodyParser.json());
  server.use(session({
    secret: 'super-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 }
  }));

  server.use('/api', apiRoutes);

  // Server-side
  const route = pathMatch();
  // nginx acme challenge
  server.get(process.env.CERTBOT_ENDPOINT , (req, res) => {
    res.send(process.env.CERTBOT_KEY);
  });

  server.get('/search', (req, res) => {
    return app.render(req, res, '/search', req.query);
  });

  server.get('/artist/:id', (req, res) => {
    const params = route('/artist/:id')(parse(req.url).pathname);
    return app.render(req, res, '/artist', params);
  });

  server.get('/album/:id', (req, res) => {
    const params = route('/album/:id')(parse(req.url).pathname);
    return app.render(req, res, '/album', params);
  });

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  /* eslint-disable no-console */
  if(dev) {

    server.listen(3000, (err) => {
      if (err) throw err;
      console.log('Server ready on http://localhost:3000');
    });
  } else {
    // server.listen(3000, (err) => {
    //   if (err) throw err;
    //   console.log('Server ready on http://localhost:3000');
    // });
    console.log('using production configs');
    const key = fs.readFileSync('./key.pem');
    const cert = fs.readFileSync('./cert.pem');
    https.createServer({
      key,
      cert,
    }, server).listen(3000, (err) => {
      if (err) throw err;
      console.log('> Ready on https://localhost:3000');
    });
  }

  });