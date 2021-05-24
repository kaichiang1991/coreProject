!function(t,e){if("object"==typeof exports&&"object"==typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n=e();for(var r in n)("object"==typeof exports?exports:t)[r]=n[r]}}(self,(function(){return t={766:(t,e,n)=>{const{name:r,version:i}=n(37);t.exports={name:r,version:i,size:{width:720,height:1280},canUseWebp:!1}},570:function(t,e,n){"use strict";var r,i=this&&this.__extends||(r=function(t,e){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])})(t,e)},function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function n(){this.constructor=t}r(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}),o=this&&this.__createBinding||(Object.create?function(t,e,n,r){void 0===r&&(r=n),Object.defineProperty(t,r,{enumerable:!0,get:function(){return e[n]}})}:function(t,e,n,r){void 0===r&&(r=n),t[r]=e[n]}),a=this&&this.__setModuleDefault||(Object.create?function(t,e){Object.defineProperty(t,"default",{enumerable:!0,value:e})}:function(t,e){t.default=e}),s=this&&this.__importStar||function(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)"default"!==n&&Object.prototype.hasOwnProperty.call(t,n)&&o(e,t,n);return a(e,t),e},c=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0}),e.eEventName=e.StateModule=void 0;var p=s(n(295));window.PIXI=p;var u=c(n(15));window.gsap=u.default;var l,f=c(n(766)),d=f.default.name,h=f.default.version;!function(t){t.init=function(){console.log("%c"+d+" 版號: "+h,"color:green; background-color:cyan; font-size:16px; padding:2px;")},t.createState=function(t,e,n){return new t(e,n)};var e=function(){function t(t,e){this.type=t,this.context=e}return t.prototype.enter=function(){},t.prototype.change=function(){},t.prototype.exit=function(){},t}();t.GameState=e;var n=function(){function t(){this.stateArr=new Array,this.currentState=null,this.lastState=null}return t.prototype.regState=function(t){this.stateArr[t.type]=t},t.prototype.unRegState=function(t){this.stateArr[t.type]&&this.currentState!=t?delete this.stateArr[t.type]:console.log("unRegState fail",t.type)},t.prototype.unRegAll=function(){this.currentState=null,this.stateArr=new Array},t.prototype.getState=function(t){return this.stateArr[t]},t.prototype.getCurrentState=function(){return this.currentState.type},t.prototype.getLastState=function(){var t;return null===(t=this.lastState)||void 0===t?void 0:t.type},t.prototype.changeState=function(t){this.currentState&&(this.currentState.exit(),this.lastState=this.currentState),this.currentState=this.stateArr[t],this.currentState.enter()},t}();t.StateContext=n;var r=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return i(e,t),e.prototype.changeState=function(e){EventHandler.dispatch(l.gameStateChange,{type:e}),t.prototype.changeState.call(this,e)},e}(n);t.GameStateContext=r}(e.StateModule||(e.StateModule={})),function(t){t.gameStateChange="gameStateChange"}(l=e.eEventName||(e.eEventName={}))},37:t=>{"use strict";t.exports=JSON.parse('{"name":"State","version":"1.0.0","description":"","scripts":{"fileParse":"node fileParse.js","build:dev":"npm run fileParse && webpack --config webpack.dev.js","serve":"live-server ./dist","start":"concurrently \'npm:build:dev\' \'npm:serve\'","build":"npm run fileParse && webpack --config webpack.prod.js"},"keywords":[],"author":"","license":"ISC","devDependencies":{"@types/node":"^15.0.2","clean-webpack-plugin":"^4.0.0-alpha.0","concurrently":"^6.0.2","copy-webpack-plugin":"^8.1.1","copyfiles":"^2.4.1","html-webpack-plugin":"^5.3.1","image-minimizer-webpack-plugin":"^2.2.0","imagemin":"^8.0.0","imagemin-optipng":"^8.0.0","imagemin-webp":"^6.0.0","live-server":"^1.2.1","replace-in-file":"^6.2.0","replace-in-file-webpack-plugin":"^1.0.6","ts-loader":"^9.1.1","typescript":"^4.2.4","webpack":"^5.36.2","webpack-cli":"^4.6.0","webpack-merge":"^5.7.3"},"dependencies":{"@pixi/sound":"4.0.2","gsap":"3.6.0","pixi-spine":"2.1.14","pixi.js-legacy":"5.3.9"}}')},295:t=>{"use strict";t.exports=window.PIXI},15:t=>{"use strict";t.exports=window.gsap}},e={},function n(r){var i=e[r];if(void 0!==i)return i.exports;var o=e[r]={exports:{}};return t[r].call(o.exports,o,o.exports,n),o.exports}(570);var t,e}));