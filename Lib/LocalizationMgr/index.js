!function(e,n){if("object"==typeof exports&&"object"==typeof module)module.exports=n(require("PIXI"),require("gsap"));else if("function"==typeof define&&define.amd)define(["PIXI","gsap"],n);else{var t="object"==typeof exports?n(require("PIXI"),require("gsap")):n(e.PIXI,e.gsap);for(var r in t)("object"==typeof exports?exports:e)[r]=t[r]}}(self,(function(e,n){return(()=>{var t={75:e=>{"use strict";e.exports=JSON.parse('{"game":{"BetLevelTitle":"Bet Level","Line":"Line","GetWin":"Win","SymbolWin":"Symbol Win","SpecialSymbolWin":"Special Symbol Win","FreeGameWin":"Free Game Win","InsufficientBalanceTitle":"Insufficient Balance","TotalWin":"Total Win","SpinOrDouble":"Spin or double up","TakeOrDouble":"Take win or double up"},"system":{"IdleForceClose":"You have been idle for too long. Your session is closed.","ConnectClose":"Connect Close.","TokenInvalid":"Token Invalid."}}')},913:e=>{"use strict";e.exports=JSON.parse('{"game":{"BetLevelTitle":"押注乘数","Line":"线","GetWin":"得分","SymbolWin":"符号得分","SpecialSymbolWin":"特殊符号得分","FreeGameWin":"免费游戏得分","InsufficientBalanceTitle":"余额不足","TotalWin":"总得分","SpinOrDouble":"游戏或比倍","TakeOrDouble":"取分或比倍"},"system":{"IdleForceClose":"闲置时间过久，请重新登入","ConnectClose":"Connect Close.","TokenInvalid":"Token Invalid."}}')},816:(e,n,t)=>{var r={"./en.json":75,"./zh-cn.json":913};function i(e){var n=o(e);return t(n)}function o(e){if(!t.o(r,e)){var n=new Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}return r[e]}i.keys=function(){return Object.keys(r)},i.resolve=o,e.exports=i,i.id=816},766:(e,n,t)=>{const{name:r,version:i}=t(37);e.exports={name:r,version:i,size:{width:720,height:1280},canUseWebp:!1}},222:function(e,n,t){"use strict";var r=this&&this.__createBinding||(Object.create?function(e,n,t,r){void 0===r&&(r=t),Object.defineProperty(e,r,{enumerable:!0,get:function(){return n[t]}})}:function(e,n,t,r){void 0===r&&(r=t),e[r]=n[t]}),i=this&&this.__setModuleDefault||(Object.create?function(e,n){Object.defineProperty(e,"default",{enumerable:!0,value:n})}:function(e,n){e.default=n}),o=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var n={};if(null!=e)for(var t in e)"default"!==t&&Object.prototype.hasOwnProperty.call(e,t)&&r(n,e,t);return i(n,e),n},a=this&&this.__awaiter||function(e,n,t,r){return new(t||(t=Promise))((function(i,o){function a(e){try{s(r.next(e))}catch(e){o(e)}}function u(e){try{s(r.throw(e))}catch(e){o(e)}}function s(e){var n;e.done?i(e.value):(n=e.value,n instanceof t?n:new t((function(e){e(n)}))).then(a,u)}s((r=r.apply(e,n||[])).next())}))},u=this&&this.__generator||function(e,n){var t,r,i,o,a={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function u(o){return function(u){return function(o){if(t)throw new TypeError("Generator is already executing.");for(;a;)try{if(t=1,r&&(i=2&o[0]?r.return:o[0]?r.throw||((i=r.return)&&i.call(r),0):r.next)&&!(i=i.call(r,o[1])).done)return i;switch(r=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return a.label++,{value:o[1],done:!1};case 5:a.label++,r=o[1],o=[0];continue;case 7:o=a.ops.pop(),a.trys.pop();continue;default:if(!((i=(i=a.trys).length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){a=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){a.label=o[1];break}if(6===o[0]&&a.label<i[1]){a.label=i[1],i=o;break}if(i&&a.label<i[2]){a.label=i[2],a.ops.push(o);break}i[2]&&a.ops.pop(),a.trys.pop();continue}o=n.call(e,a)}catch(e){o=[6,e],r=0}finally{t=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,u])}}},s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(n,"__esModule",{value:!0}),n.LocalizationManager=n.eLanguage=void 0;var l=o(t(295));window.PIXI=l;var c=s(t(15));window.gsap=c.default;var p,f=s(t(766)),d=f.default.name,b=f.default.version;!function(e){e.CHS="zh-cn",e.ENG="en",e.default="en"}(p=n.eLanguage||(n.eLanguage={}));var g=function(){function e(){}return e.init=function(){return a(this,void 0,void 0,(function(){var e,n=this;return u(this,(function(r){switch(r.label){case 0:return console.log("%c"+d+" 版號: "+b,"color:green; background-color:cyan; font-size:16px; padding:2px;"),this.language=Object.values(p).find((function(e){var n;return e==(null===(n=l.utils.url.parse(document.URL,!0).query)||void 0===n?void 0:n.language)}))||p.default,e=this.language,[4,new Promise((function(r){Promise.resolve().then((function(){return o(t(816)("./"+e+".json"))})).then((function(e){n.textJson=e.default,r()}))}))];case 1:return r.sent(),[2]}}))}))},e.getLanguage=function(){return this.language},e.getFolder=function(){var e=this;return Object.keys(p).find((function(n){return p[n]==e.language}))},e.gameText=function(e){return this.getText("game",e)},e.systemText=function(e){return this.getText("system",e)},e.getText=function(e,n){return this.textJson[e][n]},e}();n.LocalizationManager=g},37:e=>{"use strict";e.exports=JSON.parse('{"name":"LocalizationManager","version":"1.0.0","description":"","scripts":{"fileParse":"node fileParse.js","build:dev":"npm run fileParse && webpack --config webpack.dev.js","serve":"live-server ./dist","start":"concurrently \'npm:build:dev\' \'npm:serve\'","build":"npm run fileParse && webpack --config webpack.prod.js"},"keywords":[],"author":"","license":"ISC","devDependencies":{"@types/node":"^15.0.2","clean-webpack-plugin":"^4.0.0-alpha.0","concurrently":"^6.0.2","copy-webpack-plugin":"^8.1.1","copyfiles":"^2.4.1","html-webpack-plugin":"^5.3.1","image-minimizer-webpack-plugin":"^2.2.0","imagemin":"^8.0.0","imagemin-optipng":"^8.0.0","imagemin-webp":"^6.0.0","live-server":"^1.2.1","replace-in-file":"^6.2.0","replace-in-file-webpack-plugin":"^1.0.6","ts-loader":"^9.1.1","typescript":"^4.2.4","webpack":"^5.36.2","webpack-cli":"^4.6.0","webpack-merge":"^5.7.3"},"dependencies":{"gsap":"3.6.0","pixi-spine":"2.1.14","pixi.js-legacy":"5.3.9"}}')},295:n=>{"use strict";n.exports=e},15:e=>{"use strict";e.exports=n}},r={};function i(e){var n=r[e];if(void 0!==n)return n.exports;var o=r[e]={exports:{}};return t[e].call(o.exports,o,o.exports,i),o.exports}return i.o=(e,n)=>Object.prototype.hasOwnProperty.call(e,n),i(222)})()}));