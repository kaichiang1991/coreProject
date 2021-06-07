!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var n=t();for(var i in n)("object"==typeof exports?exports:e)[i]=n[i]}}(self,(function(){return e={766:(e,t,n)=>{const{name:i,version:r}=n(37);e.exports={name:i,version:r,size:{width:720,height:1280},canUseWebp:!1}},570:function(e,t,n){"use strict";var i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.BetModel=void 0;var r=n(181),o=i(n(766)),s=o.default.name,p=o.default.version,c=function(){function e(t,n,i){var r=this;this.betUnit=t,this.betInterval=n.slice();var o=e.line,s=e.moneyFractionMultiple;this.betIndex=this.betInterval.findIndex((function(e){return e*r.betUnit*(o||1)>=1*s})),this.credit=i,this.win=this.preWin=0}return e.getInstance=function(){return this.instance},Object.defineProperty(e,"Line",{get:function(){return this.line},enumerable:!1,configurable:!0}),Object.defineProperty(e,"MoneyFractionMultiple",{get:function(){return this.moneyFractionMultiple},enumerable:!1,configurable:!0}),Object.defineProperty(e,"Denom",{get:function(){return this.denom},enumerable:!1,configurable:!0}),e.init=function(t,n,i,r,o,c){console.log("%c"+s+" 版號: "+p,"color:green; background-color:cyan; font-size:16px; padding:2px;"),this.line=c,this.moneyFractionMultiple=r,this.denom=o,this.instance=new e(t,n,i)},Object.defineProperty(e.prototype,"BetUnit",{get:function(){return this.betUnit},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"BetInterval",{get:function(){var e;return null===(e=this.betInterval)||void 0===e?void 0:e.slice()},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"Bet",{get:function(){return this.betInterval[this.betIndex]},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"TotalBet",{get:function(){return this.Bet*this.betUnit*(e.line?e.line:1)},enumerable:!1,configurable:!0}),e.prototype.setBet=function(e){e>this.betInterval.length-1?Debug.warn("setBet: out of range",e):this.betIndex=e},e.prototype.changeBet=function(e){e?this.setBet(++this.betIndex%this.betInterval.length):this.setBet((this.betInterval.length+--this.betIndex)%this.betInterval.length)},e.prototype.startSpin=function(){var e=r.minus(this.credit,this.TotalBet);e<0?Debug.warn("startSpin: credit not enough",this.credit,this.TotalBet):this.credit=e},Object.defineProperty(e.prototype,"PreWin",{get:function(){return this.preWin},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"Win",{get:function(){return this.win},set:function(e){this.win=e,e||(this.preWin=0)},enumerable:!1,configurable:!0}),e.prototype.addWin=function(e){this.preWin=this.win,this.Win=r.plus(this.win,e)},e}();t.BetModel=c},37:e=>{"use strict";e.exports=JSON.parse('{"name":"BetModel","version":"1.0.0","description":"","scripts":{"fileParse":"node fileParse.js","build:dev":"npm run fileParse && webpack --config webpack.dev.js","serve":"live-server ./dist","start":"concurrently \'npm:build:dev\' \'npm:serve\'","build":"npm run fileParse && webpack --config webpack.prod.js && node buildFileParse.js"},"keywords":[],"author":"","license":"ISC","devDependencies":{"@types/node":"^15.0.2","clean-webpack-plugin":"^4.0.0-alpha.0","concurrently":"^6.0.2","copy-webpack-plugin":"^8.1.1","copyfiles":"^2.4.1","html-webpack-plugin":"^5.3.1","image-minimizer-webpack-plugin":"^2.2.0","imagemin":"^8.0.0","imagemin-optipng":"^8.0.0","imagemin-webp":"^6.0.0","live-server":"^1.2.1","md5-dir":"^0.2.0","replace-in-file":"^6.2.0","replace-in-file-webpack-plugin":"^1.0.6","ts-loader":"^9.1.1","typescript":"^4.2.4","webpack":"^5.36.2","webpack-cli":"^4.6.0","webpack-merge":"^5.7.3"},"dependencies":{"@pixi/sound":"4.0.2","gsap":"3.6.0","number-precision":"^1.5.0","pixi-particles":"4.3.0","pixi-spine":"2.1.14","pixi.js-legacy":"5.3.9"}}')},181:e=>{"use strict";e.exports=window.NP}},t={},function n(i){var r=t[i];if(void 0!==r)return r.exports;var o=t[i]={exports:{}};return e[i].call(o.exports,o,o.exports,n),o.exports}(570);var e,t}));