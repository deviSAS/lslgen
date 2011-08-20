devi.Loader = function() {

	var deviCore     = ['devi.Build.js','devi.Functions.js','devi.History.js','devi.Script.js','devi.Alerts.js','devi.Storage.js','devi.Network.js','devi.Temporal.js','devi.Cache.js','devi.Base64.js','devi.Modules.js','devi.Session.js'];
	var total = 0;
	var loaded = false;
	var path = 'code/devi_src/';
	
	function startUp() {
		devi.debug('[LOAD] Loading Modules..');
		for(script in deviCore) {
			/* devi.debug('[DEBUG] Load request->'+deviCore[script]); */
			$.getScript(path+deviCore[script],function(){ alertLoad();});
		}
		devi.debug('[WATCHDOG] Waiting for modules load');
	} 
	
	function alertLoad(name) {
		total++;
		if(total == deviCore.length) {
			devi.debug('[LOAD] All scripts loaded.');
			devi.Start();
		}
	}
	
	return {
		init:startUp
	};
}();