
// generate table
function genTable(json, id) {

	// remove previous table (if any)
	maintable = document.getElementById('maintable');
	while(maintable.firstChild){
		maintable.removeChild(maintable.firstChild);
	}

	// filter the data by input id
	var data = json.filter(function(item, index){
  	if ((item.ID).indexOf(id) >= 0) return true;
	});

	for(var i in data) {
		var ev = data[i];

		// event title
		var h3 = document.createElement('h3');
		h3.textContent = '['+ev.ID+'] '+ev.Title;
		document.getElementById('maintable').appendChild(h3);

		// make table
		var table = document.createElement('table');
		var tr = document.createElement('tr');
		var th = document.createElement('th');
		th.textContent = '選択肢';
		tr.appendChild(th);
		var th = document.createElement('th');
		th.textContent = '結果';
		tr.appendChild(th);
		table.appendChild(tr);

		// list of choices and results
		for(var j in ev.Choices) {
			var chs = ev.Choices[j];
			var tr = document.createElement('tr');
			var td = document.createElement('td');
			td.textContent = chs.Choice;
			tr.appendChild(td);
			var td = document.createElement('td');

			// Success / Fail-type events
			if(chs.Results instanceof Array) {
				td.innerHTML = chs.Results.join('<br>');
			} else {
				tdelem = "";
				for(key in chs.Results) {
					tdelem += '<br><b>'+key+'</b><br>';
					tdelem += chs.Results[key].join('<br>')
				}
				td.innerHTML = tdelem.slice(4);
			}

			tr.appendChild(td);
			table.appendChild(tr);
		}

		maintable.appendChild(table);
	}

}

// update with cache
function inputChange(event){
  id = event.currentTarget.value;
	fetch('https://sochigusa.github.io/Uma-ggrks/json/spd.json')
		.then(response => response.json())
		.then(json => genTable(json, id))
}

// update on input
let text = document.getElementById('idText');
text.addEventListener('input', inputChange);

// first table
fetch('https://sochigusa.github.io/Uma-ggrks/json/spd.json', {cache:'no-store'})
	.then(response => response.json())
	.then(json => genTable(json, ''))