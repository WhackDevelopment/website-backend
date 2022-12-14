/**
 * Copyright (c) LuciferMorningstarDev <contact@lucifer-morningstar.dev>
 * Copyright (c) whackdevelopment.com <contact@whackdevelopment.com>
 * Copyright (C) whackdevelopment.com team and contributors
 */

'use strict'; // https://www.w3schools.com/js/js_strict.asp

var contentSecurity = [
    "default-src https: 'self' cdn.jsdelivr.net",
    "script-src https: 'self' 'unsafe-inline' cdn.jsdelivr.net cdnjs.cloudflare.com",
    "connect-src 'none'",
    "style-src 'self' 'unsafe-inline' cdnjs.cloudflare.com cdn.jsdelivr.net fonts.googleapis.com necolas.github.io",
    "img-src 'self'",
    "font-src 'self' cdnjs.cloudflare.com fonts.googleapis.com fonts.gstatic.com",
];

module.exports = (req, res, next) => {
    res.header('Content-Security-Policy', contentSecurity.join('; '));
    next();
};