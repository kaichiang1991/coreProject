!function(e,n){if("object"==typeof exports&&"object"==typeof module)module.exports=n(require("PIXI"));else if("function"==typeof define&&define.amd)define(["PIXI"],n);else{var t="object"==typeof exports?n(require("PIXI")):n(e.PIXI);for(var i in t)("object"==typeof exports?exports:e)[i]=t[i]}}(self,(function(e){return(()=>{"use strict";var n={222:function(e,n,t){var i=this&&this.__createBinding||(Object.create?function(e,n,t,i){void 0===i&&(i=t),Object.defineProperty(e,i,{enumerable:!0,get:function(){return n[t]}})}:function(e,n,t,i){void 0===i&&(i=t),e[i]=n[t]}),r=this&&this.__setModuleDefault||(Object.create?function(e,n){Object.defineProperty(e,"default",{enumerable:!0,value:n})}:function(e,n){e.default=n}),o=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var n={};if(null!=e)for(var t in e)"default"!==t&&Object.prototype.hasOwnProperty.call(e,t)&&i(n,e,t);return r(n,e),n};Object.defineProperty(n,"__esModule",{value:!0}),n.EventHandler=void 0;var c=o(t(295));window.PIXI=c;var s=t(37),a=function(){function e(){}return e.init=function(){console.log("%c"+s.name+" 版號: "+s.version,"color:green; background-color:cyan; font-size:16px; padding:2px;"),this.instance=new c.utils.EventEmitter},e.dispatch=function(e,n){this.instance.emit(e,n)},e.on=function(e,n){this.instance.on(e,n)},e.once=function(e,n){this.instance.once(e,n)},e.off=function(e,n){this.instance.listeners(e).includes(n)?this.instance.off(e,n):console.log('%cEventHandler off: "'+e+'", no callback',"color:red",n)},e.removeListener=function(e){this.instance.removeListener(e)},e.removeAllListeners=function(){this.instance.removeAllListeners()},e}();n.EventHandler=a},37:e=>{e.exports=JSON.parse('{"name":"EventHandler","version":"1.0.0","description":"","config":{"size":{"width":720,"height":1280}},"scripts":{"build:dev":"webpack --config webpack.dev.js","serve":"live-server ./dist","start":"concurrently \'npm:build:dev\' \'npm:serve\'","build":"webpack --config webpack.prod.js"},"keywords":[],"author":"","license":"ISC","devDependencies":{"@types/node":"^15.0.2","clean-webpack-plugin":"^4.0.0-alpha.0","concurrently":"^6.0.2","html-webpack-plugin":"^5.3.1","live-server":"^1.2.1","replace-in-file-webpack-plugin":"^1.0.6","ts-loader":"^9.1.1","typescript":"^4.2.4","webpack":"^5.36.2","webpack-cli":"^4.6.0","webpack-merge":"^5.7.3"},"dependencies":{"gsap":"3.6.0","pixi-spine":"2.1.14","pixi.js-legacy":"5.3.9"}}')},295:n=>{n.exports=e}},t={};return function e(i){var r=t[i];if(void 0!==r)return r.exports;var o=t[i]={exports:{}};return n[i].call(o.exports,o,o.exports,e),o.exports}(222)})()}));