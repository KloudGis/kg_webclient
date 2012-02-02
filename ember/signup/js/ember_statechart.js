//©2006-2011 Strobe Inc. and contributors.   Portions ©2008-2011 Apple Inc. All rights reserved. Licensed under MIT licensevar slice=Array.prototype.slice,respondsTo=function(a,b){return a[b]instanceof Function};Ember.respondsTo=respondsTo,Ember.Object.reopen({respondsTo:function(){var a=slice.call(arguments);return a.unshift(this),Ember.respondsTo.apply(SC,a)}});var tryToPerform=function(a,b){var c=slice.call(arguments);return c.shift(),c.shift(),Ember.respondsTo(a,b)&&a[b].apply(a,c)!==!1};Ember.tryToPerform=tryToPerform,Ember.Object.reopen({tryToPerform:function(){var a=slice.call(arguments);return a.unshift(this),Ember.tryToPerform.apply(SC,a)}}),Ember.handleActions=function(a){var b=Array.prototype.slice.call(arguments);return b.shift(),a.isActionHandler=YES,a.actions=b,a},Ember.stateObserves=function(a){var b=Array.prototype.slice.call(arguments);return b.shift(),a.isStateObserveHandler=YES,a.args=b,a},Ember.EXTEND_PROTOTYPES&&(Function.prototype.handleActions=function(){var a=Array.prototype.slice.call(arguments);return a.unshift(this),Ember.handleActions.apply(SC,a)},Function.prototype.stateObserves=function(){var a=Array.prototype.slice.call(arguments);return a.unshift(this),Ember.stateObserves.apply(SC,a)}),Ember.Async=Ember.Object.extend({func:null,arg1:null,arg2:null,tryToPerform:function(a){var b=this.get("func"),c=this.get("arg1"),d=this.get("arg2"),e=Ember.typeOf(b);e==="string"?Ember.tryToPerform(a,b,c,d):e==="function"&&b.apply(a,[c,d])}}),Ember.Async.reopenClass({perform:function(a,b,c){return Ember.Async.create({func:a,arg1:b,arg2:c})}});var get=Ember.get,set=Ember.set,getPath=Ember.getPath,slice=Array.prototype.slice;Ember.State=Ember.Object.extend({stateName:null,parentState:null,historyState:null,initialSubstate:null,substatesAreConcurrent:!1,substates:null,statechart:null,stateIsInitialized:!1,currentSubstates:null,enteredSubstates:null,trace:function(){var a=getPath(this,"statechart.statechartTraceKey");return getPath(this,"statechart.%@".fmt(a))}.property().cacheable(),owner:function(){var a=get(this,"statechart"),b=a?get(a,"statechartOwnerKey"):null,c=a?get(a,b):null;return c?c:a}.property().cacheable(),init:function(){this._registeredActionHandlers={},this._registeredStringActionHandlers={},this._registeredRegExpActionHandlers=[],this._registeredStateObserveHandlers={};var a=get(this,"statechart"),b=a?get(a,"statechartOwnerKey"):null,c=a?get(a,"statechartTraceKey"):null;a&&(a.addObserver(b,this,"_statechartOwnerDidChange"),a.addObserver(c,this,"_statechartTraceDidChange"))},destroy:function(){var a=get(this,"statechart"),b=a?get(a,"statechartOwnerKey"):null,c=a?get(a,"statechartTraceKey"):null;a&&(Ember.removeObserver(a,b,this,"_statechartOwnerDidChange"),Ember.removeObserver(a,c,this,"_statechartTraceDidChange"));var d=get(this,"substates");d&&d.forEach(function(a){a.destroy()}),this._teardownAllStateObserveHandlers(),set(this,"substates",null),set(this,"currentSubstates",null),set(this,"enteredSubstates",null),set(this,"parentState",null),set(this,"historyState",null),set(this,"initialSubstate",null),set(this,"statechart",null),this.notifyPropertyChange("trace"),this.notifyPropertyChange("owner"),this._registeredActionHandlers=null,this._registeredStringActionHandlers=null,this._registeredRegExpActionHandlers=null,this._registeredStateObserveHandlers=null,this._super()},initState:function(){if(get(this,"stateIsInitialized"))return;this._registerWithParentStates();var a=null,b=null,c=null,d=[],e=NO,f=get(this,"initialSubstate"),g=get(this,"substatesAreConcurrent"),h=get(this,"statechart"),i=0,j=0,k=NO,l=null;Ember.HistoryState.detect(f)&&f.isClass&&(l=this.createHistoryState(f,{parentState:this,statechart:h}),set(this,"initialSubstate",l),Ember.none(get(l,"defaultState"))&&(this.stateLogError("Initial substate is invalid. History state requires the name of a default state to be set"),set(this,"initialSubstate",null),l=null));for(a in this){b=this[a],k=Ember.typeOf(b)==="function";if(k&&b.isActionHandler){this._registerActionHandler(a,b);continue}if(k&&b.isStateObserveHandler){this._registerStateObserveHandler(a,b);continue}k&&b.statePlugin&&(b=b.apply(this)),Ember.State.detect(b)&&b.isClass&&this[a]!==this.constructor&&(c=this.createSubstate(b,{stateName:a,parentState:this,statechart:h}),d.push(c),this[a]=c,c.initState(),a===f?(set(this,"initialSubstate",c),e=YES):l&&get(l,"defaultState")===a&&(set(l,"defaultState",c),e=YES))}!Ember.none(f)&&!e&&this.stateLogError("Unable to set initial substate %@ since it did not match any of state's %@ substates".fmt(f,this)),d.length===0?Ember.none(f)||this.stateLogWarning("Unable to make %@ an initial substate since state %@ has no substates".fmt(f,this)):d.length>0&&(Ember.none(f)&&!g?(c=this.createEmptyState({parentState:this,statechart:h}),set(this,"initialSubstate",c),d.push(c),this[get(c,"stateName")]=c,c.initState(),this.stateLogWarning("state %@ has no initial substate defined. Will default to using an empty state as initial substate".fmt(this))):!Ember.none(f)&&g&&(set(this,"initialSubstate",null),this.stateLogWarning("Can not use %@ as initial substate since substates are all concurrent for state %@".fmt(f,this)))),set(this,"substates",d),set(this,"currentSubstates",[]),set(this,"enteredSubstates",[]),set(this,"stateIsInitialized",YES)},createSubstate:function(a,b){return a.create(b)},createHistoryState:function(a,b){return a.create(b)},createEmptyState:function(a){return Ember.EmptyState.create(a)},_registerActionHandler:function(a,b){var c=b.actions,d=null,e=c.length,f=0;this._registeredActionHandlers[a]=b;for(;f<e;f+=1){d=c[f];if(Ember.typeOf(d)==="string"){this._registeredStringActionHandlers[d]={name:a,handler:b};continue}if(d instanceof RegExp){this._registeredRegExpActionHandlers.push({name:a,handler:b,regexp:d});continue}this.stateLogError("Invalid action %@ for action handler %@ in state %@".fmt(d,a,this))}},_registerStateObserveHandler:function(a,b){var c=0,d=b.args,e=d.length,f,g=YES;for(;c<e;c+=1){f=d[c];if(Ember.typeOf(f)!=="string"||Ember.empty(f))this.stateLogError("Invalid argument %@ for state observe handler %@ in state %@".fmt(f,a,this)),g=NO}if(!g)return;this._registeredStateObserveHandlers[a]=b.args},_registerWithParentStates:function(){this._registerSubstate(this);var a=get(this,"parentState");while(!Ember.none(a))a._registerSubstate(this),a=get(a,"parentState")},_registerSubstate:function(a){var b=a.pathRelativeTo(this);if(Ember.none(b))return;Ember.none(this._registeredSubstatePaths)&&(this._registeredSubstatePaths={},this._registeredSubstates=[]),this._registeredSubstates.push(a);var c=this._registeredSubstatePaths;c[get(a,"stateName")]===undefined&&(c[get(a,"stateName")]={__ki_paths__:[]});var d=c[get(a,"stateName")];d[b]=a,d.__ki_paths__.push(b)},pathRelativeTo:function(a){var b=get(this,"stateName"),c=get(this,"parentState");while(!Ember.none(c)&&c!==a)b="%@.%@".fmt(get(c,"stateName"),b),c=get(c,"parentState");return c!==a&&a!==this?(this.stateLogError("Can not generate relative path from %@ since it not a parent state of %@".fmt(a,this)),null):b},getSubstate:function(a){var b=Ember.typeOf(a);if(a instanceof Ember.State)return this._registeredSubstates.indexOf(a)>-1?a:null;if(b!=="string")return this.stateLogError("Can not find matching subtype. value must be an object or string: %@".fmt(a)),null;var c=a.match(/(^|\.)(\w+)$/);if(!c)return null;var d=this._registeredSubstatePaths[c[2]];if(Ember.none(d))return null;var e=d[a];if(!Ember.none(e))return e;if(c[1]==="")if(d.__ki_paths__.length===1)e=d[d.__ki_paths__[0]];else if(d.__ki_paths__.length>1){var f="Can not find substate matching %@ in state %@. Ambiguous with the following: %@";this.stateLogError(f.fmt(a,this,d.__ki_paths__))}return e},gotoState:function(a,b){var c=null;get(this,"isCurrentState")?c=this:get(this,"hasCurrentSubstates")&&(c=get(this,"currentSubstates")[0]),get(this,"statechart").gotoState(a,c,b)},gotoHistoryState:function(a,b,c){var d=null;get(this,"isCurrentState")?d=this:get(this,"hasCurrentSubstates")&&(d=get(this,"currentSubstates")[0]),get(this,"statechart").gotoHistoryState(a,d,b,c)},resumeGotoState:function(){get(this,"statechart").resumeGotoState()},stateIsCurrentSubstate:function(a){Ember.typeOf(a)==="string"&&(a=get(this,"statechart").getState(a));var b=get(this,"currentSubstates");return!!b&&b.indexOf(a)>=0},stateIsEnteredSubstate:function(a){Ember.typeOf(a)==="string"&&(a=get(this,"statechart").getState(a));var b=get(this,"enteredSubstates");return!!b&&b.indexOf(a)>=0},isRootState:function(){return getPath(this,"statechart.rootState")===this}.property(),isCurrentState:function(){return this.stateIsCurrentSubstate(this)}.property("currentSubstates").cacheable(),isConcurrentState:function(){return getPath(this,"parentState.substatesAreConcurrent")}.property(),isEnteredState:function(){return this.stateIsEnteredSubstate(this)}.property("enteredSubstates").cacheable(),hasSubstates:function(){return getPath(this,"substates.length")>0}.property("substates"),hasCurrentSubstates:function(){var a=get(this,"currentSubstates");return!!a&&get(a,"length")>0}.property("currentSubstates").cacheable(),hasEnteredSubstates:function(){var a=get(this,"enteredSubstates");return!!a&&get(a,"length")>0}.property("enteredSubstates").cacheable(),reenter:function(){var a=get(this,"statechart");get(this,"isCurrentState")?a.gotoState(this):Ember.Logger.error("Can not re-enter state %@ since it is not a current state in the statechart".fmt(this))},tryToHandleAction:function(a,b,c){var d=get(this,"trace");if(this._registeredActionHandlers[a])return this.stateLogWarning("state %@ can not handle action %@ since it is a registered action handler".fmt(this,a)),NO;if(this._registeredStateObserveHandlers[a])return this.stateLogWarning("state %@ can not handle action %@ since it is a registered state observe handler".fmt(this,a)),NO;if(Ember.typeOf(this[a])==="function")return d&&this.stateLogTrace("will handle action %@".fmt(a)),this[a](b,c)!==NO;var e=this._registeredStringActionHandlers[a];if(e)return d&&this.stateLogTrace("%@ will handle action %@".fmt(e.name,a)),e.handler.call(this,a,b,c)!==NO;var f=this._registeredRegExpActionHandlers.length,g=0;for(;g<f;g+=1){e=this._registeredRegExpActionHandlers[g];if(a.match(e.regexp))return d&&this.stateLogTrace("%@ will handle action %@".fmt(e.name,a)),e.handler.call(this,a,b,c)!==NO}return Ember.typeOf(this.unknownAction)==="function"?(d&&this.stateLogTrace("unknownAction will handle action %@".fmt(a)),this.unknownAction(a,b,c)!==NO):NO},enterState:function(a){},stateWillBecomeEntered:function(){},stateDidBecomeEntered:function(){this._setupAllStateObserveHandlers()},exitState:function(a){},stateWillBecomeExited:function(){this._teardownAllStateObserveHandlers()},stateDidBecomeExited:function(){},_setupAllStateObserveHandlers:function(){this._configureAllStateObserveHandlers("addObserver")},_teardownAllStateObserveHandlers:function(){this._configureAllStateObserveHandlers("removeObserver")},_configureAllStateObserveHandlers:function(a){var b,c,d,e,f,g;for(b in this._registeredStateObserveHandlers){c=this._registeredStateObserveHandlers[b];for(f=0;f<c.length;f+=1)d=c[f],e=b,g=Ember.normalizeTuple(this,d),SC[a](g[0],g[1],this,e)}},performAsync:function(a,b,c){return Ember.Async.perform(a,b,c)},respondsToAction:function(a){if(this._registeredActionHandlers[a])return!1;if(Ember.typeOf(this[a])==="function")return!0;if(this._registeredStringActionHandlers[a])return!0;if(this._registeredStateObserveHandlers[a])return!1;var b=this._registeredRegExpActionHandlers.length,c=0,d;for(;c<b;c+=1){d=this._registeredRegExpActionHandlers[c];if(a.match(d.regexp))return!0}return Ember.typeOf(this.unknownAction)==="function"},fullPath:function(){var a=getPath(this,"statechart.rootState");return a?this.pathRelativeTo(a):get(this,"stateName")}.property("stateName","parentState").cacheable(),_statechartTraceDidChange:function(){this.notifyPropertyChange("trace")},_statechartOwnerDidChange:function(){this.notifyPropertyChange("owner")},stateLogTrace:function(a){var b=get(this,"statechart");b.statechartLogTrace("%@: %@".fmt(this,a))},stateLogWarning:function(a){var b=get(this,"statechart");b.statechartLogWarning(a)},stateLogError:function(a){var b=get(this,"statechart");b.statechartLogError(a)}}),Ember.State.plugin=function(a){var b=slice.call(arguments);b.shift();var c=function(){var c=Ember.getPath(window,a);return c?!c.isClass||c.isInstance&&!(c instanceof Ember.State)?(console.error("Ember.State.plugin: Unable to extend. %@ must be a class extending from Ember.State".fmt(a)),undefined):c.extend.apply(c,b):(console.error("Ember.State.plugin: Unable to determine path %@".fmt(a)),undefined)};return c.statePlugin=YES,c},Ember.EMPTY_STATE_NAME="__EMPTY_STATE__",Ember.EmptyState=Ember.State.extend({name:Ember.EMPTY_STATE_NAME,enterState:function(){var a="No initial substate was defined for state %@. Entering default empty state";this.stateLogWarning(a.fmt(this.get("parentState")))}}),Ember.HistoryState=Ember.Object.extend({isRecursive:NO,defaultState:null,statechart:null,parentState:null,state:function(){var a=this.get("defaultState"),b=this.getPath("parentState.historyState");return b?b:a}.property().cacheable(),parentHistoryStateDidChange:function(){this.notifyPropertyChange("state")}.observes("*parentState.historyState")}),require("ember-statechart/system/state");var get=Ember.get,set=Ember.set,getPath=Ember.getPath;Ember.StatechartManager={isStatechart:!0,statechartIsInitialized:!1,rootState:null,rootStateExample:Ember.State,initialState:null,statesAreConcurrent:!1,monitorIsActive:!1,monitor:null,statechartTraceKey:"trace",trace:!1,statechartOwnerKey:"owner",owner:null,autoInitStatechart:!0,suppressStatechartWarnings:!1,init:function(){get(this,"autoInitStatechart")&&this.initStatechart()},destroy:function(){var a=get(this,"rootState"),b=get(this,"statechartTraceKey");Ember.removeObserver(this,b,this,"_statechartTraceDidChange"),a.destroy(),set(this,"rootState",null),this._super()},initStatechart:function(){if(get(this,"statechartIsInitialized"))return;this._gotoStateLocked=!1,this._sendActionLocked=!1,this._pendingStateTransitions=[],this._pendingSentActions=[],get(this,"monitorIsActive")&&set(this,"monitor",Ember.StatechartMonitor.create({statechart:this}));var a=get(this,"statechartTraceKey");this.addObserver(a,this,"_statechartTraceDidChange"),this._statechartTraceDidChange();var b=get(this,"allowStatechartTracing"),c=get(this,"rootState"),d;b&&this.statechartLogTrace("BEGIN initialize statechart"),c?Ember.typeOf(c)==="function"&&c.statePlugin&&(c=c.apply(this)):c=this._constructRootStateClass();if(!Ember.State.detect(c)||!c.isClass)throw d="Unable to initialize statechart. Root state must be a state class",this.statechartLogError(d),d;c=this.createRootState(c,{statechart:this,stateName:Ember.ROOT_STATE_NAME}),set(this,"rootState",c),c.initState();if(Ember.EmptyState.detect(get(c,"initialSubstate")))throw d="Unable to initialize statechart. Root state must have an initial substate explicilty defined",this.statechartLogError(d),d;if(!Ember.empty(get(this,"initialState"))){var e="initialState";set(this,e,get(c,get(this,e)))}set(this,"statechartIsInitialized",!0),this.gotoState(c),b&&this.statechartLogTrace("END initialize statechart")},createRootState:function(a,b){return b||(b={}),a=a.create(b),a},currentStates:function(){return getPath(this,"rootState.currentSubstates")}.property().cacheable(),firstCurrentState:function(){var a=get(this,"currentStates");return a?a.objectAt(0):null}.property("currentStates").cacheable(),currentStateCount:function(){return getPath(this,"currentStates.length")}.property("currentStates").cacheable(),stateIsCurrentState:function(a){return get(this,"rootState").stateIsCurrentSubstate(a)},enteredStates:function(){return getPath(this,"rootState.enteredSubstates")}.property().cacheable(),stateIsEntered:function(a){return get(this,"rootState").stateIsEnteredSubstate(a)},doesContainState:function(a){return!Ember.none(this.getState(a))},getState:function(a){return get(this,"rootState").getSubstate(a)},gotoState:function(a,b,c,d){if(!get(this,"statechartIsInitialized")){this.statechartLogError("can not go to state %@. statechart has not yet been initialized".fmt(a));return}if(get(this,"isDestroyed")){this.statechartLogError("can not go to state %@. statechart is destroyed".fmt(this));return}var e=this._processGotoStateArgs(arguments);a=e.state,b=e.fromCurrentState,c=e.useHistory,d=e.context;var f=null,g=[],h=[],i=get(this,"allowStatechartTracing"),j=get(this,"rootState"),k=a,l=b,m,n=j.getSubstate(a);if(Ember.none(n)){this.statechartLogError("Can not to goto state %@. Not a recognized state in statechart".fmt(k));return}if(this._gotoStateLocked){this._pendingStateTransitions.push({state:n,fromCurrentState:b,useHistory:c,context:d});return}this._gotoStateLocked=!0;if(!Ember.none(b)){b=j.getSubstate(b);if(Ember.none(b)||!get(b,"isCurrentState")){m="Can not to goto state %@. %@ is not a recognized current state in statechart",this.statechartLogError(m.fmt(k,l)),this._gotoStateLocked=!1;return}}else getPath(this,"currentStates.length")>0&&(b=get(this,"currentStates")[0],m="gotoState: fromCurrentState not explicitly provided. Using a default current state to transition from: %@",this.statechartLogWarning(m.fmt(b)));i&&(this.statechartLogTrace("BEGIN gotoState: %@".fmt(n)),m="starting from current state: %@",m=m.fmt(b?b:"---"),this.statechartLogTrace(m),m="current states before: %@",m=m.fmt(getPath(this,"currentStates.length")>0?get(this,"currentStates"):"---"),this.statechartLogTrace(m)),Ember.none(b)||(g=this._createStateChain(b)),h=this._createStateChain(n),f=this._findPivotState(g,h);if(f){i&&this.statechartLogTrace("pivot state = %@".fmt(f));if(get(f,"substatesAreConcurrent")){this.statechartLogError("Can not go to state %@ from %@. Pivot state %@ has concurrent substates.".fmt(n,b,f)),this._gotoStateLocked=!1;return}}var o=[];this._traverseStatesToExit(g.shift(),g,f,o),f!==n?this._traverseStatesToEnter(h.pop(),h,f,c,o):(this._traverseStatesToExit(f,[],null,o),this._traverseStatesToEnter(f,null,null,c,o)),this._executeGotoStateActions(n,o,null,d)},gotoStateActive:function(){return this._gotoStateLocked}.property(),gotoStateSuspended:function(){return this._gotoStateLocked&&!!this._gotoStateSuspendedPoint}.property(),resumeGotoState:function(){if(!get(this,"gotoStateSuspended")){this.statechartLogError("Can not resume goto state since it has not been suspended");return}var a=this._gotoStateSuspendedPoint;this._executeGotoStateActions(a.gotoState,a.actions,a.marker,a.context)},_executeGotoStateActions:function(a,b,c,d){var e=null,f=b.length,g=null;c=Ember.none(c)?0:c;for(;c<f;c+=1){e=b[c];switch(e.action){case Ember.EXIT_STATE:g=this._exitState(e.state,d);break;case Ember.ENTER_STATE:g=this._enterState(e.state,e.currentState,d)}if(g instanceof Ember.Async){this._gotoStateSuspendedPoint={gotoState:a,actions:b,marker:c+1,context:d},g.tryToPerform(e.state);return}}this.beginPropertyChanges(),this.notifyPropertyChange("currentStates"),this.notifyPropertyChange("enteredStates"),this.endPropertyChanges(),get(this,"allowStatechartTracing")&&(this.statechartLogTrace("current states after: %@".fmt(get(this,"currentStates"))),this.statechartLogTrace("END gotoState: %@".fmt(a))),this._gotoStateSuspendedPoint=null,this._gotoStateLocked=!1,this._flushPendingStateTransition()},_exitState:function(a,b){var c;if(get(a,"currentSubstates").indexOf(a)>=0){c=get(a,"parentState");while(c)get(c,"currentSubstates").removeObject(a),c=get(c,"parentState")}c=a;while(c)get(c,"enteredSubstates").removeObject(a),c=get(c,"parentState");get(this,"allowStatechartTracing")&&this.statechartLogTrace("<-- exiting state: %@".fmt(a)),set(a,"currentSubstates",[]),a.notifyPropertyChange("isCurrentState"),a.stateWillBecomeExited();var d=this.exitState(a,b);return a.stateDidBecomeExited(),get(this,"monitorIsActive")&&get(this,"monitor").pushExitedState(a),a._traverseStatesToExit_skipState=!1,d},exitState:function(a,b){return a.exitState(b)},_enterState:function(a,b,c){var d=get(a,"parentState");d&&!get(a,"isConcurrentState")&&set(d,"historyState",a);if(b){d=a;while(d)get(d,"currentSubstates").pushObject(a),d=get(d,"parentState")}d=a;while(d)get(d,"enteredSubstates").pushObject(a),d=get(d,"parentState");get(this,"allowStatechartTracing")&&this.statechartLogTrace("--> entering state: %@".fmt(a)),a.notifyPropertyChange("isCurrentState"),a.stateWillBecomeEntered();var e=this.enterState(a,c);return a.stateDidBecomeEntered(),get(this,"monitorIsActive")&&get(this,"monitor").pushEnteredState(a),e},enterState:function(a,b){return a.enterState(b)},gotoHistoryState:function(a,b,c,d){if(!get(this,"statechartIsInitialized")){this.statechartLogError("can not go to state %@'s history state. Statechart has not yet been initialized".fmt(a));return}var e=this._processGotoStateArgs(arguments);a=e.state,b=e.fromCurrentState,c=e.useHistory,d=e.context,a=this.getState(a);if(!a){this.statechartLogError("Can not to goto state %@'s history state. Not a recognized state in statechart".fmt(a));return}var f=get(a,"historyState");c?this.gotoState(a,b,!0,d):f?this.gotoState(f,b,d):this.gotoState(a,b,d)},sendAction:function(a,b,c){if(get(this,"isDestroyed")){this.statechartLogError("can send action %@. statechart is destroyed".fmt(a));return}var d=!1,e=!1,f=get(this,"currentStates").slice(),g={},h=0,i=0,j=null,k=get(this,"allowStatechartTracing");if(this._sendActionLocked||this._gotoStateLocked){this._pendingSentActions.push({action:a,arg1:b,arg2:c});return}this._sendActionLocked=!0,k&&this.statechartLogTrace("BEGIN sendAction: action<%@>".fmt(a)),h=get(f,"length");for(;i<h;i+=1){e=!1,j=f[i];if(!get(j,"isCurrentState"))continue;while(!e&&j)g[get(j,"fullPath")]||(e=j.tryToHandleAction(a,b,c),g[get(j,"fullPath")]=!0),e?d=!0:j=get(j,"parentState")}this._sendActionLocked=!1,k&&(d||this.statechartLogTrace("No state was able handle action %@".fmt(a)),this.statechartLogTrace("END sendAction: action<%@>".fmt(a)));var l=this._flushPendingSentActions();return d?this:l?this:null},_createStateChain:function(a){var b=[];while(a)b.push(a),a=get(a,"parentState");return b},_findPivotState:function(a,b){if(a.length===0||b.length===0)return null;var c=a.find(function(a,c){if(b.indexOf(a)>=0)return!0});return c},_traverseStatesToExit:function(a,b,c,d){if(!a||a===c)return;var e=get(this,"allowStatechartTracing");if(get(a,"substatesAreConcurrent")){var f=0,g=get(a,"currentSubstates"),h=g.length,i=null;for(;f<h;f+=1){i=g[f];if(i._traverseStatesToExit_skipState===!0)continue;var j=this._createStateChain(i);this._traverseStatesToExit(j.shift(),j,a,d)}}d.push({action:Ember.EXIT_STATE,state:a}),get(a,"isCurrentState")&&(a._traverseStatesToExit_skipState=!0),this._traverseStatesToExit(b.shift(),b,c,d)},_traverseStatesToEnter:function(a,b,c,d,e){if(!a)return;var f=get(this,"allowStatechartTracing");if(c)a!==c?this._traverseStatesToEnter(b.pop(),b,c,d,e):this._traverseStatesToEnter(b.pop(),b,null,d,e);else if(!b||b.length===0){var g={action:Ember.ENTER_STATE,state:a,currentState:!1};e.push(g);var h=get(a,"initialSubstate"),i=get(a,"historyState");get(a,"substatesAreConcurrent")?this._traverseConcurrentStatesToEnter(get(a,"substates"),null,d,e):get(a,"hasSubstates")&&i&&d?this._traverseStatesToEnter(i,null,null,d,e):h?(h instanceof Ember.HistoryState&&(d||(d=get(h,"isRecursive")),h=get(h,"state")),this._traverseStatesToEnter(h,null,null,d,e)):g.currentState=!0}else if(b.length>0){e.push({action:Ember.ENTER_STATE,state:a});var j=b.pop();this._traverseStatesToEnter(j,b,null,d,e),get(a,"substatesAreConcurrent")&&this._traverseConcurrentStatesToEnter(get(a,"substates"),j,d,e)}},respondsTo:function(a){var b=get(this,"currentStates"),c=get(b,"length"),d=0,e=null;for(;d<c;d+=1){e=b.objectAt(d);while(e){if(e.respondsToAction(a))return!0;e=get(e,"parentState")}}return Ember.typeOf(this[a])==="function"},tryToPerform:function(a,b,c){return this.respondsTo(a)?Ember.typeOf(this[a])==="function"?this[a](b,c)!==!1:!!this.sendAction(a,b,c):!1},invokeStateMethod:function(a,b,c){if(a==="unknownAction"){this.statechartLogError("can not invoke method unkownAction");return}b=Array.prototype.slice.call(arguments),b.shift();var d=b.length,e=d>0?b[d-1]:null,f=Ember.typeOf(e)==="function"?b.pop():null,g=get(this,"currentStates"),h=0,i=null,j={},k,l=undefined,m=0;d=get(g,"length");for(;h<d;h+=1){i=g.objectAt(h);while(i){if(j[get(i,"fullPath")])break;j[get(i,"fullPath")]=!0,k=i[a];if(Ember.typeOf(k)==="function"&&!k.isActionHandler){l=k.apply(i,b),f&&f.call(this,i,l),m+=1;break}i=get(i,"parentState")}}return m===1?l:undefined},_traverseConcurrentStatesToEnter:function(a,b,c,d){var e=0,f=a.length,g=null;for(;e<f;e+=1)g=a[e],g!==b&&this._traverseStatesToEnter(g,null,null,c,d)},_flushPendingStateTransition:function(){if(!this._pendingStateTransitions){this.statechartLogError("Unable to flush pending state transition. _pendingStateTransitions is invalid");return}var a=this._pendingStateTransitions.shift();if(!a)return;this.gotoState(a.state,a.fromCurrentState,a.useHistory,a.context)},_flushPendingSentActions:function(){var a=this._pendingSentActions.shift();return a?this.sendAction(a.action,a.arg1,a.arg2):null},_monitorIsActiveDidChange:function(){get(this,"monitorIsActive")&&Ember.none(get(this,"monitor"))&&set(this,"monitor",Ember.StatechartMonitor.create())}.observes("monitorIsActive"),_processGotoStateArgs:function(a){var b={state:null,fromCurrentState:null,useHistory:!1,context:null},c=null,d=null;a=Array.prototype.slice.call(a),a=a.filter(function(a){return a!==undefined}),c=a.length;if(c<1)return b;b.state=a[0];if(c===2){d=a[1];switch(Ember.typeOf(d)){case"boolean":b.useHistory=d;break;case"object":b.context=d;break;default:b.fromCurrentState=d}}else c===3?(d=a[1],Ember.typeOf(d)==="boolean"?(b.useHistory=d,b.context=a[2]):(b.fromCurrentState=d,d=a[2],Ember.typeOf(d)==="boolean"?b.useHistory=d:b.context=d)):(b.fromCurrentState=a[1],b.useHistory=a[2],b.context=a[3]);return b},_constructRootStateClass:function(){var a="rootStateExample",b=get(this,a),c=get(this,"initialState"),d=get(this,"statesAreConcurrent"),e=0,f,g,h,i={};Ember.typeOf(b)==="function"&&b.statePlugin&&(b=b.apply(this));if(!Ember.State.detect(b)||!b.isClass)return this._logStatechartCreationError("Invalid root state example"),null;if(d&&!Ember.empty(c))this._logStatechartCreationError("Can not assign an initial state when states are concurrent");else if(d)i.substatesAreConcurrent=!0;else{if(Ember.typeOf(c)!=="string")return this._logStatechartCreationError("Must either define initial state or assign states as concurrent"),null;i.initialSubstate=c}for(f in this){if(f===a)continue;g=this[f],h=Ember.typeOf(g)==="function",h&&g.statePlugin&&(g=g.apply(this)),Ember.State.detect(g)&&g.isClass&&this[f]!==this.constructor&&(i[f]=g,e+=1)}return e===0?(this._logStatechartCreationError("Must define one or more states"),null):b.extend(i)},_logStatechartCreationError:function(a){Ember.Logger.error("Unable to create statechart for %@: %@.".fmt(this,a))},statechartLogTrace:function(a){Ember.Logger.info("%@: %@".fmt(get(this,"statechartLogPrefix"),a))},statechartLogError:function(a){Ember.Logger.error("ERROR %@: %@".fmt(get(this,"statechartLogPrefix"),a))},statechartLogWarning:function(a){if(get(this,"suppressStatechartWarnings"))return;Ember.Logger.warn("WARN %@: %@".fmt(get(this,"statechartLogPrefix"),a))},statechartLogPrefix:function(){var a=this.constructor+"",b=get(this,"name"),c;return Ember.empty(b)?c="%@<%@>".fmt(a,Ember.guidFor(this)):c="%@<%@, %@>".fmt(a,b,Ember.guidFor(this)),c}.property().cacheable(),allowStatechartTracing:function(){var a=get(this,"statechartTraceKey");return get(this,a)}.property().cacheable(),_statechartTraceDidChange:function(){this.notifyPropertyChange("allowStatechartTracing")}},Ember.ROOT_STATE_NAME="__ROOT_STATE__",Ember.EXIT_STATE=0,Ember.ENTER_STATE=1,Ember.Statechart=Ember.Object.extend(Ember.StatechartManager,{autoInitStatechart:!1})