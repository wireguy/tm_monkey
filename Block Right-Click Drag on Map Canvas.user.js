// ==UserScript==
// @name         Block Right-Click Drag on Map Canvas
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Intercepts and blocks right-click events and drags on map canvas elements
// @match        https://tasks.hotosm.org/projects/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // ignore right-click mousedown on canvas elements
    window.addEventListener('mousedown', (e) => {
        if (e.button === 2 && (e.target.tagName === 'CANVAS' || e.target.closest('canvas'))) {
           e.stopImmediatePropagation();
            e.stopPropagation();
            e.preventDefault();
        }
   }, true);


})();