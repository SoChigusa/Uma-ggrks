import json
from bs4 import BeautifulSoup

# convert parse results into dictionary
def to_dictionary(title, id, charas, choices, results):
    chdict = [] # Deform results structure
    for choice, result in zip(choices, results):
        header = result.select('.umamusume-event-checker__choice--result-header')
        if(header != []): # success/failure-type evevnts
            casedict = {};
            for result_caseA in result.find_all('div', recursive=False):
                header = result_caseA.select('.umamusume-event-checker__choice--result-header')[0].text
                reslist_caseA = [res.text.removeprefix('・') for res in result_caseA.find_all('div')]
                casedict[header] = reslist_caseA
            chdict.append(dict([("Choice", choice), ("Results", casedict)]))
        else:
            reslist = [res.text.removeprefix('・') for res in result.find_all('div')]
            chdict.append(dict([("Choice", choice), ("Results", reslist)]))

    event = dict([("Type", "サポートカード"), ("Character", charas)])
    mydict = dict([("Title", title), ("ID", id), ("Event", event), ("Choices", chdict)])
    return mydict

# open html file
with open('html/spt/spd.html', 'r') as html_file:
    html = html_file.read()
    soup = BeautifulSoup(html, 'html.parser')

# parse
card_dict = []
for card in soup.body.find_all('div', recursive=False):
    for event in card.select('.umamusume-event-checker__event'):
        title = event.select('.umamusume-event-checker__event--title')
        if(title != []): # omit .umamusume-event-checker__event no-event
            title = title[0].text
            id = event.select('.umamusume-event-checker__event--id')[0].text
            charas = event.select('.umamusume-event-checker__event--character')[0]
            charas = [chara.text for chara in charas.find_all('a')]
            choices = [ch.select('.umamusume-event-checker__choice--body')[0].text for ch in event.find_all('tr')]
            results = [ch.select('.umamusume-event-checker__choice--result')[0] for ch in event.find_all('tr')]
            card_dict.append(to_dictionary(title, id, charas, choices, results))

# save as json
with open('json/spd.json', 'w') as f:
    json.dump(card_dict, f, indent=2)

# with open('/Users/SoChigusa/works/Uma-ggrks/json/spd.json', mode='w') as f:
#     f.write(json)
