!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var n=t();for(var i in n)("object"==typeof exports?exports:e)[i]=n[i]}}(self,(function(){return e={766:(e,t,n)=>{const{name:i,version:r}=n(37);e.exports={name:i,version:r,size:{width:720,height:1280},canUseWebp:!1}},570:function(e,t,n){"use strict";var i=this&&this.__assign||function(){return(i=Object.assign||function(e){for(var t,n=1,i=arguments.length;n<i;n++)for(var r in t=arguments[n])Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e}).apply(this,arguments)},r=this&&this.__createBinding||(Object.create?function(e,t,n,i){void 0===i&&(i=n),Object.defineProperty(e,i,{enumerable:!0,get:function(){return t[n]}})}:function(e,t,n,i){void 0===i&&(i=n),e[i]=t[n]}),o=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),a=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)"default"!==n&&Object.prototype.hasOwnProperty.call(e,n)&&r(t,e,n);return o(t,e),t},u=this&&this.__awaiter||function(e,t,n,i){return new(n||(n=Promise))((function(r,o){function a(e){try{c(i.next(e))}catch(e){o(e)}}function u(e){try{c(i.throw(e))}catch(e){o(e)}}function c(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,u)}c((i=i.apply(e,t||[])).next())}))},c=this&&this.__generator||function(e,t){var n,i,r,o,a={label:0,sent:function(){if(1&r[0])throw r[1];return r[1]},trys:[],ops:[]};return o={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function u(o){return function(u){return function(o){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,i&&(r=2&o[0]?i.return:o[0]?i.throw||((r=i.return)&&r.call(i),0):i.next)&&!(r=r.call(i,o[1])).done)return r;switch(i=0,r&&(o=[2&o[0],r.value]),o[0]){case 0:case 1:r=o;break;case 4:return a.label++,{value:o[1],done:!1};case 5:a.label++,i=o[1],o=[0];continue;case 7:o=a.ops.pop(),a.trys.pop();continue;default:if(!((r=(r=a.trys).length>0&&r[r.length-1])||6!==o[0]&&2!==o[0])){a=0;continue}if(3===o[0]&&(!r||o[1]>r[0]&&o[1]<r[3])){a.label=o[1];break}if(6===o[0]&&a.label<r[1]){a.label=r[1],r=o;break}if(r&&a.label<r[2]){a.label=r[2],a.ops.push(o);break}r[2]&&a.ops.pop(),a.trys.pop();continue}o=t.call(e,a)}catch(e){o=[6,e],i=0}finally{n=r=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,u])}}},s=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.supportWebp=t.pathConvert=t.decodeBase64=t.waitTrackComplete=t.waitTweenComplete=t.safe_kill_tween=t.SleepWithTimeout=t.Sleep=t.init=void 0;var l=a(n(295));window.PIXI=l;var p=s(n(15));window.gsap=p.default;var f=s(n(766)),d=f.default.name,v=f.default.version;t.init=function(){console.log("%c"+d+" 版號: "+v,"color:green; background-color:cyan; font-size:16px; padding:2px;"),p.default.registerPlugin(PixiPlugin,MotionPathPlugin)},t.Sleep=function(e){return u(this,void 0,void 0,(function(){return c(this,(function(t){return[2,new Promise((function(t){return p.default.delayedCall(e,t)}))]}))}))},t.SleepWithTimeout=function(e){return u(this,void 0,void 0,(function(){return c(this,(function(t){return[2,new Promise((function(t){return setTimeout(t,e)}))]}))}))},t.safe_kill_tween=function(e,t){void 0===t&&(t=!0),e?e.isActive()&&(e.repeat()<0&&e.repeat(0),e.totalProgress(1,t)):Debug.log("safe_kill_tween. no tween")},t.waitTweenComplete=function(e){return u(this,void 0,void 0,(function(){return c(this,(function(t){return[2,new Promise((function(t){var n=e.eventCallback("onComplete");e.eventCallback("onComplete",(function(){n&&n(),t()}))}))]}))}))},t.waitTrackComplete=function(e){return u(this,void 0,void 0,(function(){return c(this,(function(t){return[2,new Promise((function(t){var n,r=null===(n=e.listener)||void 0===n?void 0:n.complete;e.listener=i(i({},e.listener),{complete:function(){r&&r(),t()}})}))]}))}))},t.decodeBase64=function(e){return atob(decodeURIComponent(e))},t.pathConvert=function(e){return/\.json/.test(e)?e.replace(/img\//,"img_webp/"):e.replace(/(img\/)(\w*)(\.png)/,"img_webp/$2.webp")},t.supportWebp=function(){return u(this,void 0,void 0,(function(){var e;return c(this,(function(t){switch(t.label){case 0:return self.createImageBitmap?[4,fetch("data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=").then((function(e){return e.blob()}))]:[2,!1];case 1:return e=t.sent(),[2,createImageBitmap(e).then((function(){return!0}),(function(){return!1}))]}}))}))}},37:e=>{"use strict";e.exports=JSON.parse('{"name":"Tool","version":"1.0.0","description":"","scripts":{"fileParse":"node fileParse.js","build:dev":"npm run fileParse && webpack --config webpack.dev.js","serve":"live-server ./dist","start":"concurrently \'npm:build:dev\' \'npm:serve\'","build":"npm run fileParse && webpack --config webpack.prod.js && node buildFileParse.js"},"keywords":[],"author":"","license":"ISC","devDependencies":{"@types/node":"^15.0.2","clean-webpack-plugin":"^4.0.0-alpha.0","concurrently":"^6.0.2","copy-webpack-plugin":"^8.1.1","copyfiles":"^2.4.1","html-webpack-plugin":"^5.3.1","image-minimizer-webpack-plugin":"^2.2.0","imagemin":"^8.0.0","imagemin-optipng":"^8.0.0","imagemin-webp":"^6.0.0","live-server":"^1.2.1","md5-dir":"^0.2.0","replace-in-file":"^6.2.0","replace-in-file-webpack-plugin":"^1.0.6","ts-loader":"^9.1.1","typescript":"^4.2.4","webpack":"^5.36.2","webpack-cli":"^4.6.0","webpack-merge":"^5.7.3"},"dependencies":{"@pixi/sound":"4.0.2","gsap":"3.6.0","number-precision":"^1.5.0","pixi-particles":"4.3.0","pixi-spine":"2.1.14","pixi.js-legacy":"5.3.9"}}')},295:e=>{"use strict";e.exports=window.PIXI},15:e=>{"use strict";e.exports=window.gsap}},t={},function n(i){var r=t[i];if(void 0!==r)return r.exports;var o=t[i]={exports:{}};return e[i].call(o.exports,o,o.exports,n),o.exports}(570);var e,t}));