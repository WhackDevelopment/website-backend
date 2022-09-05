/**
 * Copyright (c) LuciferMorningstarDev <contact@lucifer-morningstar.dev>
 * Copyright (c) whackdevelopment.com <contact@whackdevelopment.com>
 * Copyright (C) whackdevelopment.com team and contributors
 */

'use strict'; // https://www.w3schools.com/js/js_strict.asp

// add global fetch extension
import('node-fetch').then(({ default: fetch }) => {
    global.fetch = fetch;
});

// imports
const express = require('express');
const compression = require('compression');
const serveFavicon = require('serve-favicon');
const cookieParser = require('cookie-parser');

const minify = require('express-minify');

const port = process.env.PORT;

// default and public paths
const defaultPath = __dirname.endsWith('/') ? __dirname : __dirname + '/';
const publicPath = defaultPath + 'public/';

module.exports = async () => {
    return new Promise(async (resolve, reject) => {
        // create the express application
        const app = express();

        app.use(
            compression({
                filter: (req, res) => {
                    if (req.headers['x-no-compression']) {
                        return false;
                    }
                    return compression.filter(req, res);
                },
            })
        );
        app.use(cookieParser());
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));

        // for security reason remove the powered by header
        app.use(require('./middleware/removePoweredBy'));

        // CORS Policy things
        app.use(require('./middleware/cors'));

        // Content security headers
        app.use(require('./middleware/contentSecurityPolicy'));

        // serve favicon on each request
        app.use(serveFavicon(publicPath + 'favicon.ico'));

        if (process.env.MODE != 'production') {
            app.use(
                minify({
                    cache: '/tmp',
                })
            );
        }

        // Basic redirects
        app.get('/github', async (_, res) => res.redirect('https://github.com/WhackDevelopment'));
        app.get('/email', async (_, res) => res.redirect('mailto:contact@whackdevelopment.com'));

        // loads the robots.txt ( SEO )
        app.get('/robots.txt', async (_, res) => res.sendFile(publicPath + 'robots.txt'));

        // 404 Handling
        app.get('*', async (req, res) => {
            res.status(404).send('<h1>404 File or Resource Not Found ' + req.url + '</h1>');
        });

        // send a 404 at each request if route not found
        app.all('*', async (req, res) => res.status(404).json({ error: true, message: 'not found', code: 404 }));

        // Finally create listener for given port or default 8080
        app.listen(port || 8080, () => {
            console.log('[ PRODUCTION ] » WEB Server is now running on Port: ' + port);
            resolve(app);
        });
    });
};
