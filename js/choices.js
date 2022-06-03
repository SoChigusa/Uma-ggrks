
// identify support card type
function cardType(name) {
	// console.log(name);
	var data = card_type_json.filter(function(item, index){
		if(item.Cards.indexOf(name) >= 0) return true;
	});
	return data[0].Type;
}

// generate table
function genTable(json, id) {

	// show only if id_length >= 3 or is_show_all
	var data = [];
	let is_show_all = document.getElementById('is_show_all');
	if(id.length >= 3 || is_show_all.checked) {
		// filter the data by input id
		var data = json.filter(function(item, index){
	  	if((item.ID).indexOf(id) == 0) return true;
		});
	}

	for(var ev of data) {
		// console.log(ev);

		// div block and table for an event
		var event_div = document.createElement('div');
		var table = document.createElement('table');

		// event title
		var h3 = document.createElement('h3');
		h3.textContent = '['+ev.ID+'] '+ev.Title;
		event_div.appendChild(h3);

		// character [character only]
		var type = ev.Event.Type;
		if(type == '育成ウマ娘') {
			table.classList.add("character");
			for (var chara of ev.Event.Character) {
				var p = document.createElement('p');
				p.textContent = chara;
				p.classList.add('source');
				event_div.appendChild(p);
			}
		}

		// card type [support card only]
		else if(type == 'サポートカード') {
			table.classList.add('support');
			for(var ev_type of ev.Event.CardType) {
				var name = ev.Event.Character+'('+ev_type.Rarity+')'+'［'+ev_type.Name+'］';
				var p = document.createElement('p');
				p.textContent = name;
				p.classList.add(cardType(name));
				p.classList.add('source');
				event_div.appendChild(p);
			}
		}

		// scenario type [main scenario only]
		else if (type == 'メインシナリオ') {
			table.classList.add("scenario");
			var p = document.createElement('p');
			p.textContent = ev.Event.Scenario;
			p.classList.add('source');
			event_div.appendChild(p);
		}

		// make table
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

		// append
		event_div.appendChild(table);
		document.getElementById('maintable').appendChild(event_div);
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
	for(const json_name of json_name_list) {
		genTable(event_json[json_name], id);
	}
}

// clear textbox on enter key
function keydown(event) {
	if(event.key == 'Enter') {
		let is_clear_by_enter = document.getElementById('is_clear_by_enter');
		if(is_clear_by_enter.checked) {
			document.getElementById('idText').value = '';
			inputChange(event);
		}
	}
}

// load and save card json database
let card_type_json, event_json = {};
var json_name_list = ['spd','stm','pwr','knj','ksk','scenario'].concat( ['ain','agnst','agnsd','adm','wnn','wk','eag','eis','erk','ogr','krn','kwk','kts','kng','grs','gorst','gorsp','sir','skrt','skrb','stn','snb','sup','sps','sma','siu','tik','mzrr','diw','tmm','tie','tuk','tos','nis','nrtt','nrtb','nsn','hru','hsak','hsam','bwh','fin','hzk']);
fetch('https://sochigusa.github.io/Uma-ggrks/json/card_type.json', {cache:'no-store'})
	.then(response => response.json())
	.then(json => card_type_json = json);
for(const json_name of json_name_list) {
	fetch('https://sochigusa.github.io/Uma-ggrks/json/'+json_name+'.json', {cache:'no-store'})
		.then(response => response.json())
		.then(json => event_json[json_name] = json);
}

// update on input
let text = document.getElementById('idText');
let is_show_all = document.getElementById('is_show_all');
text.addEventListener('input', inputChange);
text.addEventListener('keydown', keydown);
is_show_all.addEventListener('change', event => {
	let input_event = new Event('input');
	text.dispatchEvent(input_event);
});
