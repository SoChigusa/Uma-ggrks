import collections
import re
import json
from bs4 import BeautifulSoup

# convert parse results into dictionary
def to_dictionary(title, id, charas, choices, results, type):
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

    event = {}
    if(type["Type"] == "Character"):
        event = dict([("Type", "育成ウマ娘"), ("Character", charas)])
    elif(type["Type"] == "Support Card"):
        chdat = []
        typedict = [] # deform characters structure
        for chara in charas:
            chdat = re.split('[\(\)]', chara)
            typedict.append(dict([("Rarity", chdat[1]), ("Name", chdat[2].strip('［］'))]))
        event = dict([("Type", "サポートカード"), ("Character", chdat[0]), ("CardType", typedict)])
    elif(type["Type"] == "Main Scenario"):
        chdat = re.split('[［]', charas[0])
        event = dict([("Type", "メインシナリオ"), ("Scenario", chdat[0])])

    mydict = dict([("Title", title), ("ID", id), ("Event", event), ("Choices", chdict)])
    return mydict

# convert html to json
def html_to_json(src_html, src_json, type):

    # open html file
    with open(src_html, 'r') as html_file:
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
                card_dict.append(to_dictionary(title, id, charas, choices, results, type))

    # save as json
    with open(src_json, 'w') as f:
        json.dump(card_dict, f, indent=2)

    return card_dict

# check ID duplication with prefix match
def duplication_check(card_dict):
    for card in card_dict:
        for card2 in card_dict:
            if (card != card2 and card2['ID'].startswith(card['ID'])):
                print(card)
                print(card2)

# preserve whole dictionary for duplication check
card_dict_all = []

# character events
for character in ['ain','agnst','agnsd','adm','wnn','wk','eag','eis','erk','ogr','krn','kwk','kts','kng','grs','gorst','gorsp','sir','skrt','skrb','stn','snb','sup','sps','sma','siu','tik','mzrr','diw','tmm','tie','tuk','tos','nis','nrtt','nrtb','nsn','hru','hsak','hsam']:
    card_dict_all += html_to_json('html/iks/'+character+'.html', 'json/'+character+'.json', {"Type": "Character"})

# support card events
for card_type in ['spd', 'stm', 'pwr', 'knj', 'ksk']:
    card_dict_all += html_to_json('html/spt/'+card_type+'.html', 'json/'+card_type+'.json', {"Type": "Support Card"})

# main scenario events
card_dict_all += html_to_json('html/scenario.html', 'json/scenario.json', {"Type": "Main Scenario"})

# duplication check of IDs
duplication_check(card_dict_all)
