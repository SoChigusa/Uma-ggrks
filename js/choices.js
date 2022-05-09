function genTable(json) {

	for(var i in json) {

		var h3 = document.createElement('h3');
		h3.textContent = json[i].Title;
		document.getElementById('maintable').appendChild(h3);

		var table = document.createElement('table');
		var tr = document.createElement('tr');
		var th = document.createElement('th');
		th.textContent = '選択肢';
		tr.appendChild(th);
		var th = document.createElement('th');
		th.textContent = '結果';
		tr.appendChild(th);
		table.appendChild(tr);

		for(var j in json[i].Choices) {
			var tr = document.createElement('tr');
			var td = document.createElement('td');
			td.textContent = json[i].Choices[j].Choice;
			tr.appendChild(td);
			var td = document.createElement('td');
			td.innerHTML = json[i].Choices[j].Results.join('<br>');
			tr.appendChild(td);
			table.appendChild(tr);
		}

		document.getElementById('maintable').appendChild(table);
	}

}

fetch('https://sochigusa.github.io/Uma-ggrks/json/choices.json')
	.then(response => response.json())
	.then(json => genTable(json))
