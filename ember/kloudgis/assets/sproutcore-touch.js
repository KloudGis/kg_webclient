/* ===========================================================================
   BPM Combined Asset File
   MANIFEST: spade (1.0.2)
   This file is generated automatically by the bpm (http://www.bpmjs.org)
   =========================================================================*/
(function(){function packageIdFor(a){return a.slice(0,a.indexOf("/"))}function remap(a,b){var c=b?b.mappings:null;if(!c)return a;var d=packageIdFor(a);return c[d]&&(a=c[d]+a.slice(a.indexOf("/"))),a}function normalize(a,b,c,d){var e,f;a[a.length-1]==="/"&&(a=a.slice(0,-1));if(a.indexOf(".")>=0){var g=b&&a.charAt(0)==="."?b.split("/"):[],h,i,j=g[0],k=!1;e=0,f=a.length,c&&c.main&&b===j+"/main"&&(k=!0,g=c.main.replace(/^\.?\//,"").split("/")),g.pop();while(e<f)i=a.indexOf("/",e),i<0&&(i=f),h=a.slice(e,i),h===".."?g.pop():h!=="."&&h!==""&&h!==null&&g.push(h),e=i+1;a=g.join("/");if(k){var l=c.directories.lib;for(e=0,f=l.length;e<f;e++)a=a.replace(l[e].replace(/^\.?\//,"")+"/","");a=j+"/"+a}}else a[0]==="/"&&(a=a.slice(1));return a.indexOf("/")<0&&(a=a+(d?"/~package":"/main")),a[0]==="/"&&(a=a.slice(1)),a=a.replace("~lib/",""),remap(a,c)}function execFactory(a,b,c,d){var e,f,g,h,i=b.filename,j=c.ARGV,k=c.ENV;e=c.makeRequire(a,d),c._modules[a]=f={id:a,exports:{},sandbox:c},g=b.data,"string"==typeof g&&(c._factories[a]?g=c._factories[a]:(c._loading[a]=!0,g=c.evaluate("__evalFunc = "+g+"\n//@ sourceURL="+i+"\n",i),c._factories[a]=g,c._loading[a]=!1));if("function"==typeof g){var l=g(e,f.exports,f,j,k,i);l!==undefined&&(f.exports=l)}else f.exports=g;return f.exports}var K,Sandbox,Sp,Evaluator,Ep,Loader,Lp,Spade,Tp;K=function(){},Sandbox=function(a,b,c){typeof b!="string"&&(c=b,b=null),b||(b="(anonymous)"),this.spade=a,this.name=b,this.isIsolated=!!c,this._factories={},this._loading={},this._modules={},this._used={}},Sp=Sandbox.prototype,Sp.toString=function(){return"[Sandbox "+this.name+"]"},Sp.evaluate=function(a,b){if(this.isDestroyed)throw new Error("Sandbox destroyed");return this._evaluatorInited||(this._evaluatorInited=!0,this.spade.evaluator.setup(this)),this.spade.evaluator.evaluate(a,this,b)},Sp.require=function(a,b){var c=this.spade,d,e,f;d=b?c.package(b):null,a=normalize(a,b,d),e=this._modules[a],e&&(e=e.exports);if(e)return this._used[a]||(this._used[a]=e),e;f=c.loadFactory(c.resolve(a,this));if(!f)throw new Error("Module "+a+" not found");this.ENV||(this.ENV=c.env()),this.ARGV||(this.ARGV=c.argv()),e=execFactory(a,f,this,c);if(this._used[a]&&this._used[a]!==e)throw new Error("Circular require detected for module "+a);return e},Sp.exists=function(a,b){var c=this.spade,d;return d=b?c.package(b):null,a=normalize(a,b,d),this._modules[a]?!0:c.factoryExists(c.resolve(a,this))},Sp.async=function(a,b,c){var d=this.spade,e;e=c?d.package(c):null,a=d.resolve(normalize(a,c,e),this),d.loadFactory(a,b)},Sp.url=function(a,b,c){var d=this.spade,e,f;f=c?d.package(c):null,a=normalize(a,c,f),f=d.package(a);if(!f){var g=packageIdFor(a)+"/~package";d.exists(g)&&d.require(g),f=d.package(a)}if(!f)throw new Error("Can't get url for non-existent package "+a);if(!f.root)throw new Error("Package for "+a+" does not support urls");return e=f.root+a.slice(a.indexOf("/")),b&&(e=e+"."+b),e},Sp.isDestroyed=!1,Sp.destroy=function(){return this.isDestroyed||(this.isDestroyed=!0,this.spade.evaluator.teardown(this)),this},Sp.makeRequire=function(a,b){var c=b.package(a),d=this,e;return e=function(b){return d.require(b,a,c)},e.require=e,e.exists=function(b){return d.exists(normalize(b,a,c))},e.normalize=function(b){return normalize(b,a,c)},e.async=function(b,e){return d.async(normalize(b,a,c),e)},e.sandbox=function(a,c){return b.sandbox(a,c)},e.url=function(b,e){return d.url(normalize(b,a,c),e)},e.id=a,e},Loader=function(){this._loading={}},Lp=Loader.prototype,Lp.loadFactory=null,Lp.exists=null,Lp.scheduleReady=function(a){function d(){if(c)return;try{document.documentElement.doScroll("left")}catch(a){setTimeout(d,1);return}b()}if(document.readyState==="complete")return setTimeout(a,1);var b,c=!1;if(document.addEventListener)b=function(){if(c)return;c=!0,document.removeEventListener("DOMContentLoaded",b,!1),window.removeEventListener("load",b,!1),a()},document.addEventListener("DOMContentLoaded",b,!1),window.addEventListener("load",b,!1);else if(document.attachEvent){b=function(){!c&&document.readyState==="complete"&&(c=!0,document.detachEvent("onreadystatechange",b),window.detachEvent("onload",b),a())},document.attachEvent("onreadystatechange",b),window.attachEvent("onload",b);var e=!1;try{e=window.frameElement===null}catch(f){}document.documentElement.doScroll&&e&&d()}},Evaluator=function(){},Ep=Evaluator.prototype,Ep.setup=function(a){if(a.isIsolated)throw new Error("Isolated sandboxes are not supported.")},Ep.evaluate=function(text,sandbox,filename){return eval(text)},Ep.teardown=function(a){},Spade=function(){this.loader=new this.Loader(this),this.evaluator=new this.Evaluator(this),this.defaultSandbox=this.sandbox(),this._factories={},this._packages={}},Tp=Spade.prototype,Tp.VERSION="1.0.0",Tp.Spade=Spade,Tp.Sandbox=Sandbox,Tp.Loader=Loader,Tp.Evaluator=Evaluator,Tp.env=function(){var a=this.ENV;return a||(this.ENV=a="undefined"!=typeof ENV?ENV:{}),a.SPADE_PLATFORM||(a.SPADE_PLATFORM="browser"),a.LANG||(a.LANG="undefined"!=typeof navigator?navigator.language:"en-US"),a},Tp.argv=function(){var a=this.ARGV;return a||(a=this.ARGV="undefined"!=typeof ARGV?ARGV:[]),a},Tp.noConflict=function(){var a=this._conflict;return a&&(delete this._conflict,spade=this._conflict),this},Tp.sandbox=function(a,b){return new this.Sandbox(this,a,b)},Tp.register=function(a,b,c){b||(b=K);var d=typeof b,e,f,g;a=normalize(a,null,null,!0),g=a.slice(-9)==="/~package";if(g&&"object"!=typeof b)throw new Error("You can only register hashes for packages");return g&&(b.directories||(b.directories={}),b.directories.lib?typeof b.directories.lib=="string"&&(b.directories.lib=[b.directories.lib]):b.directories.lib=["lib"]),f={data:b},f.filename=c&&c.filename?c.filename:a,this._factories[a]=f,this},Tp.externs=function(a,b){var c,d=this._packages;"string"==typeof a&&(c={},c[a]=b,a=c,b=null);for(var e in a){if(!a.hasOwnProperty(e))continue;if(d[e]&&!d[e].extern)continue;b=a[e],"string"==typeof b&&(b={name:e,src:b}),b.extern=!0,this.register(e,b)}},Tp.require=function(a){return this.defaultSandbox.require(a,this.defaultSandbox.callerId)},Tp.async=function(a,b){return this.defaultSandbox.async(a,b)},Tp.exists=function(a){return this.defaultSandbox.exists(a)},Tp.url=function(a,b){return this.defaultSandbox.url(a,b)},Tp.loadFactory=function(a,b){var c=this._factories[a],d=this.loader;return b?c?b():d&&d.loadFactory?d.loadFactory(this,a,b):b(new Error("Module "+a+" not found")):!c&&d&&d.loadFactory&&(d.loadFactory(this,a),c=this._factories[a]),c},Tp.factoryExists=function(a){if(this._factories[a])return!0;var b=this.loader;return b&&b.exists&&b.exists(this,a)},Tp.package=function(a){a=packageIdFor(normalize(a))+"/~package";var b=this._factories[a];return b?b.data:null},Tp.normalize=function(a,b){return normalize(a,b)},Tp.resolve=function(a,b){var c=this.loader;return b&&c&&c.resolve?c.resolve(a,b):a},Tp.ready=function(a){switch(this.readyState){case"ready":a();break;case"scheduled":this._readyQueue.push(a);break;default:this._readyQueue=[a],this.readyState="scheduled";if(!this.loader.scheduleReady)throw new Error("Loader does not support activate on ready state");var b=this;this.loader.scheduleReady(function(){var a=b._readyQueue,c=a?a.length:0;b._readyQueue=null,b.readyState="ready";for(var d=0;d<c;d++)a[d]()})}};var newSpade=new Spade;"undefined"!=typeof spade&&(newSpade._conflict=spade),spade=newSpade,"undefined"!=typeof require&&("undefined"!=typeof __module?__module.exports=spade:"undefined"!=typeof module&&(module.exports=spade))})()