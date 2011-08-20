devi.Script = function() {
	var Script = '';
	var gotError = false;
	var compiled = false;
	var Code = '';
	
	function buildSandbox() {		
		/* Reset globals */
		Script = '';
		compiled = false;
		Code = '';
		gotError = false;
		$("#lsl_Arena input").removeClass('error');
		
		$("#lsl_Arena .EVNLSL").each(
			function(i,e) {
				var EVENT = $(this).attr('id');
				devi.debug('[SCRIPT][COMPILE] Event: '+EVENT);
				
				Script += EVENT+':';
				// Get each function inside this event
				$('#'+EVENT+ ' .item').each( function(i,e) {
					processItem($(this));
					// More functions
					if( !($(this).is(':last-child')) ) Script += '/';
				});
				
				// This is the end, 
				if(!($(this).is(':last-child'))) {
					// There are other events, add a comma
					Script += ',';
				}
			}
		);
		
		if(Script.length == 0) {	
			devi.debug('[SCRIPT][COMPILE] Arena Empty');
			devi.Alert.init(devi.Functions.random(5),ERROR_COMPILE,ERROR_EMPTY,$(document));
			return false; 
		}
		
		if(!gotError) { 
			if(!compiled) compiled = true; 
			devi.debug('[SCRIPT][COMPILER] Compiled succefully'); 
			devi.Alert.init(devi.Functions.random(5),COMPILE,COMPILE_DONE,$(document)); 
		} else if(gotError && compiled) { compiled = false; return false;}

	}
	
	function processItem(item) {		
		var ID  = item.attr('id');
		var REL = item.attr('rel');
		devi.debug('[SCRIPT][COMPILE] Item: '+ID+' > '+REL);
		if(REL == '[if]') {
			// Add each item inside the if and go on..
			Script += 'IF[';
				$('#'+ID+' .sub-item').each(function(i,e) {
					processItem($(this));
				});
			Script += ']';
		} else {
			// It's a function:
			Script += REL+'%';
			// Get each input and validate it
			$('#'+ID+' input').each(function(i,e) {
			
				var VAL  = $(this).val();
				var NAME = $(this).attr('name');
				var TYPE = $(this).attr('rel');
				
				if(TYPE == 'check') {
					if($(this).is(':checked')) VAL = '[true]';
					else VAL = '[false]';
				}
				
				if(validate(TYPE,VAL)) {
					// The number is OK, add to the script
					var _val = devi.Base64.encode(Escape(TYPE,VAL));
					Script += _val;
					// Add | only if is not the last item..
					if( !($(this).is(':last-child')) ) Script += '|';
					// If is a num, add it for validation
					if(TYPE == 'num') { $(this).val(Escape(TYPE,VAL)); }
				} else {
					// Not valid number, add error class and focus on it.
					$(this).addClass('error');
					devi.Alert.init('error',ERROR_COMPILE,ERROR_NUM_TYPE+VAL+"'<br/>",$(this));
					devi.debug('[SCRIPT][COMPILE] Error at: '+ID+' > '+REL);
					if(!gotError) gotError = true;
				}
				
			});
		}
	}
	
	function Escape(type, string) {
		if(type == 'num') {
			if(empty(string)) {
				return '0';
			} return string;
		} else {
			return escape(string);
		}
	}	
	
	function validate(type,value) {
		if(type == 'num') {
			if(isNumber(value)) return true;
			else {
				return false;
			}
		} return true;
	}
	
	function isNumber(num) {
		var ValidChars = "0123456789.";
		var IsNumber   = true;
		var Char       = '';
		for (i = 0; i < num.length && IsNumber == true; i++) { 
			Char = num.charAt(i); 
			if (ValidChars.indexOf(Char) == -1) {
				IsNumber = false;
			}
		}
		return IsNumber;
    }
	
	function empty(val) {
		if(val.length == 0 || val == null) return true;
		else return false;
	}

	function construct() {
		if(!compiled) {
			devi.Alert.init(devi.Functions.random(5),ERROR_BUILD,ERROR_COMPILE_FIRST,$(document));
			return false;
		}
		//devi.debug('[SCRIPT] '+Script);
		devi.Alert.init(devi.Functions.random(5),BUILD,BUILD_SETTINGS,$(document));
		/* Build button */
		$("#BuildScript").click(function() { doBuild(); });
	}
	
	function doBuild() {
		var _ckComments = 'no'; //Use checkbox
		var net_id = devi.Network.get('devi/constructor.php',{'action':'build','code':Script,'comments':_ckComments},'POST');
		
		devi.debug('[SCRIPT][BUILD] Build initialized..');
		devi.Alert.init('build',BUILD,BUILDING+LOADING,$(document));
		
		var timer = setInterval(function(){checkResponse();},1000);
		/* Store in temporal those vars */
		devi.Temporal.add('ScriptNetReq',net_id);
		devi.Temporal.add('ScriptTimer',timer);
	}
	
	function checkResponse() {
		var id = devi.Temporal.get('ScriptNetReq');
		if(devi.Network.ok(id)) {
			clearInterval(devi.Temporal.get('ScriptTimer'));
			Code = devi.Network.response(id);
			
			if(Code.indexOf('ERROR') != -1) {
				devi.Alert.init('error',ERROR_BUILD,Code,$(document));
				devi.debug('[SCRIPT][BUILD] '+Code);
				return false;
			}
			
			/* Display code */
			devi.Alert.init('script',CODE,Code,$(document));			
		} else {
			/* Store again til we get a response */
			devi.Temporal.add('ScriptNetReq',id);
		}
	}
	
	function Check() {
		return compiled;
	}
						
	return {
		build: construct,
		compile: buildSandbox,
		check: Check,
		test: function() { return true; }
	};
}();