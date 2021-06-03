!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var i=t();for(var n in i)("object"==typeof exports?exports:e)[n]=i[n]}}(self,(function(){return e={766:(e,t,i)=>{const{name:n,version:r}=i(37);e.exports={name:n,version:r,size:{width:720,height:1280},canUseWebp:!1}},570:function(e,t,i){"use strict";var n=this&&this.__createBinding||(Object.create?function(e,t,i,n){void 0===n&&(n=i),Object.defineProperty(e,n,{enumerable:!0,get:function(){return t[i]}})}:function(e,t,i,n){void 0===n&&(n=i),e[n]=t[i]}),r=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),s=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var i in e)"default"!==i&&Object.prototype.hasOwnProperty.call(e,i)&&n(t,e,i);return r(t,e),t},o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.ParameterParse=void 0;var a=s(i(295));window.PIXI=a;var c=o(i(15));window.gsap=c.default;var u,p,f,l=o(i(766)),d=l.default.name,m=l.default.version;!function(e){e.betIndex="MS_BetIndex",e.autoSpeed="MS_AutoSpeed",e.musicOn="MS_MusicOn"}(u||(u={})),function(e){e.speedOn="speedOn",e.speedOff="speedOff"}(p||(p={})),function(e){e.musicOn="musicOn",e.musicOff="musicOff"}(f||(f={})),function(e){e.init=function(e){console.log("%c"+d+" 版號: "+m,"color:green; background-color:cyan; font-size:16px; padding:2px;"),t.init(e),i.init()};var t=function(){function e(){}return e.init=function(e){this.query=a.utils.url.parse(document.URL,!0).query,this.parseWebsocket(e),this.parseExitUrl(),this.parseToken()},e.parseExitUrl=function(){this.exitUrl=this.query.r?decodeBase64(this.query.r):""},e.parseToken=function(){this.token=this.query.token},e.parseWebsocket=function(e){var t,i;this.query.s?(i=(t=decodeBase64(this.query.s).split(","))[0],this.betQuery=t[1]):e&&(i=e),/wss?:\/\//.test(i)||(i=("http:"==location.protocol?"ws://":"wss://")+i),this.gameServer=i+"/gameserver"},e}();e.UrlParser=t;var i=function(){function e(){}return e.init=function(){this.parseBetIndex(),this.parseAutoSpeed(),this.parseMusicOn()},e.setBetIndex=function(e){localStorage.setItem(u.betIndex,e.toString())},e.parseBetIndex=function(){this.betIndex=localStorage.getItem(u.betIndex)},e.setAutoSpeed=function(e){localStorage.setItem(u.autoSpeed,e?p.speedOn:p.speedOff)},e.parseAutoSpeed=function(){this.autoSpeed=localStorage.getItem(u.autoSpeed)!=p.speedOff},e.setMusicOn=function(e){localStorage.setItem(u.musicOn,e?f.musicOn:f.musicOff)},e.parseMusicOn=function(){this.musicOn=localStorage.getItem(u.musicOn)!=f.musicOff},e}();e.LocalStorageManager=i}(t.ParameterParse||(t.ParameterParse={}))},37:e=>{"use strict";e.exports=JSON.parse('{"name":"ParameterParse","version":"1.0.0","description":"","scripts":{"fileParse":"node fileParse.js","build:dev":"npm run fileParse && webpack --config webpack.dev.js","serve":"live-server ./dist","start":"concurrently \'npm:build:dev\' \'npm:serve\'","build":"npm run fileParse && webpack --config webpack.prod.js && node buildFileParse.js"},"keywords":[],"author":"","license":"ISC","devDependencies":{"@types/node":"^15.0.2","clean-webpack-plugin":"^4.0.0-alpha.0","concurrently":"^6.0.2","copy-webpack-plugin":"^8.1.1","copyfiles":"^2.4.1","html-webpack-plugin":"^5.3.1","image-minimizer-webpack-plugin":"^2.2.0","imagemin":"^8.0.0","imagemin-optipng":"^8.0.0","imagemin-webp":"^6.0.0","live-server":"^1.2.1","md5-dir":"^0.2.0","replace-in-file":"^6.2.0","replace-in-file-webpack-plugin":"^1.0.6","ts-loader":"^9.1.1","typescript":"^4.2.4","webpack":"^5.36.2","webpack-cli":"^4.6.0","webpack-merge":"^5.7.3"},"dependencies":{"@pixi/sound":"4.0.2","gsap":"3.6.0","number-precision":"^1.5.0","pixi-spine":"2.1.14","pixi.js-legacy":"5.3.9"}}')},295:e=>{"use strict";e.exports=window.PIXI},15:e=>{"use strict";e.exports=window.gsap}},t={},function i(n){var r=t[n];if(void 0!==r)return r.exports;var s=t[n]={exports:{}};return e[n].call(s.exports,s,s.exports,i),s.exports}(570);var e,t}));