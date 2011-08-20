devi.Temporal = function() {
	var TemporalData = [];
	/* Cross js temporal storage */
	function addTemporal(id,value) {
		TemporalData[id] = value;
		devi.debug('[TEMP] Stored "'+id+'"');
		return true;
	}
	
	function getTemporal(id) {
		var data = TemporalData[id];
		var pos = TemporalData.indexOf(id);
		TemporalData.splice(pos,1);
		devi.debug('[TEMP] Removed "'+id+'"');
		return data;
	}
	
	return {
		add: addTemporal,
		get: getTemporal,
		test: function() { return true; }
	};
}();