// ==UserScript==
// @name         copy at username
// @namespace    https://tasks.hotosm.org/
// @version      0.1
// @description  copy username and format as @[username]
// @author       wireguy
// @match        https://tasks.hotosm.org/*
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @run-at       context-menu
// ==/UserScript==

(function() {
    'use strict';
    var username = document.getSelection();

    navigator.clipboard.writeText('@['+username+']');

 })();