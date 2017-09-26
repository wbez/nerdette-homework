#!/usr/bin/env python

"""
Functions specific to the Nerdette Homework app.
"""

import copytext
import app_config
import json,copy
from render_utils import flatten_app_config, JavascriptIncluder, CSSIncluder
from collections import OrderedDict
from datetime import datetime, date, timedelta
from slugify import slugify

def make_context(asset_depth=0):
	"""
	Create a base-context for rendering views.
	Includes app_config and JS/CSS includers.
	`asset_depth` indicates how far into the url hierarchy
	the assets are hosted. If 0, then they are at the root.
	If 1 then at /foo/, etc.
	"""
	context = flatten_app_config()
	context['ITEMS'] = []
	context['ITEMS_JS'] = []
	context['ASSIGNERS'] = []
	context['VERBS'] = []
	dates = []
	copy = copytext.Copy(app_config.COPY_PATH)

	items = copy['assignments']
	#verbs = copy['verbs']

	# for item in items:
	# 	date_obj = datetime.strptime(item['date'],'%m/%d/%Y')
	# 	dates.append(date_obj)
	
	# dates.sort()
	# dates.pop(0)

	# start = min(dates)
	# end = max(dates)
	# days_count = (end-start).days

	for i, item in enumerate(items):

		if ('Interviews' in item['date']):
			continue


		# tags = item['tags'].split(',')
		# tags = [x.strip() for x in tags]
		verbs = item['verb'].split(',')
		verbs = [x.strip() for x in verbs]
		# tags_slug = [x.lower().replace(' ','') for x in tags] 
		verbs_slug = [slugify(x) for x in verbs]

		for verb in verbs:
			if verb != '':
				verb_dict = {'verb':verb,'slug':slugify(verb)}
				if verb_dict not in context['VERBS']:
					context['VERBS'].append(verb_dict)


		date_obj = datetime.strptime(item['date'],'%m/%d/%Y')

		item_context = {}
		item_context['date'] = item['date']
		item_context['date_obj'] = date_obj

		assigner_context = {}
		#verbs_context = {}
		
		# if i == 0:
		# 	timeline_value = 100*( (date_obj-start).days/float(days_count) )
		# else:
		# 	if item['date'] == items[i-1]['date']:
		# 		timeline_value = context['ITEMS'][-1]['timeline_value'] + 1
		# 	#	context['ITEMS'][-1]['timeline_value'] = context['ITEMS'][-1]['timeline_value'] - 1
		# 	else:
		# 		timeline_value = 100*( (date_obj-start).days/float(days_count) )
			

		# item_context['timeline_value'] = timeline_value
		
		item_context['verbs'] = verbs
		item_context['verbs_slug'] = verbs_slug
		item_context['text'] = item['text']
		# item_context['tags'] = tags
		# item_context['tags_slug'] = tags_slug
		# item_context['template'] = item['template']
		item_context['person'] = item['person']
		item_context['person_slug'] = slugify(item['person'])
		item_context['person_title'] = item['person_title']
		item_context['episode'] = item['episode']
		item_context['title'] = item['title']
		item_context['id'] = slugify(item['title'])
		item_context['text'] = item['text']
		item_context['homework_image'] = item['homework image']
		item_context['homework_image_credit'] = item['homework image credit']
		item_context['assigner_image'] = item['assigner image']
		item_context['assigner_image_credit'] = item['assigner image credit']

		assigner_context['person'] = item['person']
		assigner_context['person_slug'] = slugify(item['person'])
		assigner_context['assigner_image'] = item['assigner image']
		assigner_context['assigner_image_credit'] = item['assigner image credit']
		assigner_context['person_title'] = item['person_title']

		#verbs_context['verbs_modal_image'] = item['modal image']

		context['ITEMS'].append(item_context)
		context['ITEMS_JS'].append(item_context.copy())

		if not any(p.get('person', None) == item['person'] for p in context['ASSIGNERS']):
			context['ASSIGNERS'].append(assigner_context)

	for item in context['ITEMS_JS']:
		del item['date_obj']

	context['COPY'] = copytext.Copy(app_config.COPY_PATH)
	context['JS'] = JavascriptIncluder(asset_depth=asset_depth)
	context['CSS'] = CSSIncluder(asset_depth=asset_depth)

	return context