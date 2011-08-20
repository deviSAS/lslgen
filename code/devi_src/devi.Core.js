if(!window.devi) {window.devi = {};}
devi.debug = function( text ){if(window.console && window.console.log) {console.log(text);}}

devi.Start = function() {
	if(devi.Modules.init()) {
		if(devi.Session.start()) {
			devi.debug('[CORE] Running devi LSLGen 0.1.06:210710');
			devi.debug('[CORE] Starting..');
			devi.Modules.load();
			devi.debug('[WELCOME] Welcome message.');
			if(devi.Alert.init('welcome',iniTitle,iniMessage,$(document))) {
				$('#Changelog').click(function(){devi.Alert.init('changelog','Changelog:',changeLog,$(document));});
			}
			
		} else {
			devi.Alert.init('core','Unable to Start.','Something unexpected happened.',$(document));
			devi.debug('[CORE] Unable to start.');
			setTimeout(function() { window.location = 'http://foravatars.com'; },10000);
		}
	}
};
