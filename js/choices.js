
// identify support card type
function cardType(name) {
	var data = card_type_json.filter(function(item, index){
		if(item.Cards.indexOf(name) >= 0) return true;
	});
	console.log(name);
	return data[0].Type;
}

// generate table
function genTable(json, id, type) {

	// filter the data by input id
	var data = json.filter(function(item, index){
  	if((item.ID).indexOf(id) >= 0) return true;
	});

	for(var ev of data) {
		// console.log(ev);

		// event title
		var h3 = document.createElement('h3');
		h3.textContent = '['+ev.ID+'] '+ev.Title;
		document.getElementById('maintable').appendChild(h3);

		// character [character only]
		if(type == "Character") {
			var p = document.createElement('p');
			p.textContent = ev.Event.Character;
			document.getElementById('maintable').appendChild(p);
		}

		// card type [support card only]
		else if(type == "Support Card") {
			for(var ev_type of ev.Event.CardType) {
				var name = ev.Event.Character+'('+ev_type.Rarity+')'+'［'+ev_type.Name+'］';
				var p = document.createElement('p');
				p.textContent = name;
				p.classList.add(cardType(name));
				document.getElementById('maintable').appendChild(p);
			}
		}

		// scenario type [main scenario only]
		else if (type == "Main Scenario") {
			var p = document.createElement('p');
			p.textContent = ev.Event.Scenario;
			document.getElementById('maintable').appendChild(p);
		}

		// make table
		var table = document.createElement('table');
		var tr = document.createElement('tr');
		var th = document.createElement('th');
		th.textContent = '選択肢';
		th.classList.add('choices');
		tr.appendChild(th);
		var th = document.createElement('th');
		th.textContent = '結果';
		th.classList.add('results');
		tr.appendChild(th);
		table.appendChild(tr);

		// list of choices and results
		for(var chs of ev.Choices) {
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

// update table on input
function inputChange(event){
  id = event.currentTarget.value;

	// remove previous table (if any)
	maintable = document.getElementById('maintable');
	while(maintable.firstChild){
		maintable.removeChild(maintable.firstChild);
	}

	// table content
	for(const character_name of ['ain','agnst','agnsd','gor','mzrr','diw','tmm','tie']) {
		genTable(event_json[character_name], id, "Character");
	}
	for(const card_type of ['spd', 'stm', 'pwr', 'knj', 'ksk']) {
		genTable(event_json[card_type], id, "Support Card");
	}
	genTable(event_json['scenario'], id, "Main Scenario");
}

// clear textbox on enter key
function keydown(event) {
	if(event.key == 'Enter') {
		document.getElementById('idText').value = '';
		inputChange(event);
	}
}

// load and save card json database
let card_type_json, event_json = {};
fetch('https://sochigusa.github.io/Uma-ggrks/json/card_type.json', {cache:'no-store'})
	.then(response => response.json())
	.then(json => card_type_json = json);
for(const character_name of ['ain','agnst','agnsd','gor','mzrr','diw','tmm','tie']) {
	fetch('https://sochigusa.github.io/Uma-ggrks/json/'+character_name+'.json', {cache:'no-store'})
		.then(response => response.json())
		.then(json => event_json[character_name] = json);
}
for(const card_type of ['spd', 'stm', 'pwr', 'knj', 'ksk']) {
	fetch('https://sochigusa.github.io/Uma-ggrks/json/'+card_type+'.json', {cache:'no-store'})
		.then(response => response.json())
		.then(json => event_json[card_type] = json);
}
fetch('https://sochigusa.github.io/Uma-ggrks/json/scenario.json', {cache:'no-store'})
	.then(response => response.json())
	.then(json => event_json['scenario'] = json);

// update on input
let text = document.getElementById('idText');
text.addEventListener('input', inputChange);
text.addEventListener('keydown', keydown);
