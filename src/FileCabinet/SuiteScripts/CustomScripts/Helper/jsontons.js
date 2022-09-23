define([],

function() {
	
	jsonToNS = function (data){
		
		var mapping = data.mapping;
		var key = data.key;
		var record = data.record;
		var data = data.data;
		
		if(mapping[key].hasOwnProperty('value')){
			record.setValue({fieldId: key, value : eval('data.'+ mapping[key].value)});
		}
		else if(mapping[key].hasOwnProperty('text')){
			record.setText({fieldId: key, text : eval('data.'+ mapping[key].text)});
		}
		else if(mapping[key].hasOwnProperty('epoch')){
			var dDate =   new Date( eval('data.'+ mapping[key].epoch));
			record.setValue({fieldId: key , value : dDate.getTime().toString()});
		}
		else if(mapping[key].hasOwnProperty('date')){
			
			var data = eval('data.'+ mapping[key].date);
			
			if(data.indexOf('.') == -1){
				data = data.replace('Z', '.000Z');
			}
			
			var dDate = format.parse({ value: new Date(data), type: format.Type.DATE});
			record.setValue({fieldId: key, value : dDate});
		}
		else if(mapping[key].hasOwnProperty('concat')){
			
			var data = mapping[key].concat;
			var sData = '';
			
			data.forEach(
					function (value) {
						sData += eval('data.'+ value);
					});

			record.setValue({fieldId: key, value : sData});
		}

		return record;
	};
   
    return {
    	jsonToNS: jsonToNS
    };
    
});
