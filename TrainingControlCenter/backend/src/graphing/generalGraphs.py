import matplotlib.pyplot as plt
import matplotlib.patches as mplpatches
import matplotlib.patheffects as PathEffects
import numpy as np
import matplotlib.image as mplimg
import math
import sys
import json
import dateutil.parser

from datetime import date, datetime, timedelta

def generalHistoryGraph (username, duration, graphType, sport, goal, startYear, startMonth, startDay, jsonInput, outFile):

  print ('Params: ' + username, duration, graphType, sport, goal, startYear, startMonth, startDay, jsonInput, outFile)
  startDate = date(int(startYear), int(startMonth), int(startDay)) 
  # Figure creation
  figureWidth=5
  figureHeight=5

  plt.figure(figsize=(figureWidth,figureHeight))

  panelWidth=4
  panelHeight=4

  panel1 = plt.axes([0.5/figureWidth, 0.5/figureHeight, panelWidth/figureWidth,panelHeight/figureHeight])

  activityList = json.loads(jsonInput)

  for item in activityList:
    print (item['name'])

  # Get totals for distance or time
  maxX = 13
  if duration == 'Day':
    maxX = 15
  
  totals = []
  for i in range (1, maxX):
    totals.append([i, 0])

  if (graphType == 'Distance'):
    for index, item in enumerate(activityList):
      print(item['start_date_local'])
      parsedDate = dateutil.parser.isoparse(item['start_date_local'])
      print(parsedDate)
      activityDate = datetime.fromisoformat(parsedDate)
      print(activityDate)
  
      startDateDelta = (activityDate - startDate)
      print(startDateDelta)
      # if duration == 'Day':
      #   startDateDelta =
      # elif duration 'Week': 
      #   startDateDelta =
      # else: 
      #   startDateDelta =
      
      totals[startDateDelta][1]=item['distance']/1609.34
      
  if (graphType == 'Time'):
    for item in activityList:
      totals[startDateDelta][1]=item['moving_time']/3600
      startDateDelta
    # Daily total graphing

    # Weekly total graphing

    # Monthly total graphing


  print(totals)
    
  
    

  # Graphing
  # Panel ranges
  maxY = max([sublist[1] for sublist in totals]) # maxY is the largest y value, can be goal value
  maxY = math.ceil(maxY * 1.1)

  yTickSpace = maxY//10

  panel1.set_xlim(0, maxX)
  panel1.set_ylim(0, maxY)   

  for item in totals:
    panel1.plot(item[0],item[1],
                  marker='o',
                  markerfacecolor='red',
                  markeredgewidth=0.1,
                  markersize=4,
                  color='black',
                  linewidth=0,
                  alpha=1
      )


  # Goal overlay, optional
  # If goals selected, get goal for corresponding sport of type time/distance from database TODO

  if goal == True:
    pass

  # Ticks and labels 
  panel1.set_xticks(np.arange(0, maxX))
  panel1.set_yticks(np.arange(0, maxY, yTickSpace))

  # Title
  panel1.set_title(graphType + ' per ' + duration + ' for ' + sport)

  panel1.set_xlabel(duration + 's')
  panel1.set_ylabel(graphType)


  panel1.tick_params(bottom=True, labelbottom=True,\
                    left=True, labelleft=True, \
                    right=False, labelright=False,\
                    top=False, labeltop=False)

  # TODO, save location in images folder
  plt.savefig('../frontend/images/' + outFile,dpi=600)
  #plt.savefig(outFile,dpi=600)
  return 'Graphing Complete'

# generalHistoryGraph('fkurmann', 'Week', 'Distance', 'Run', False, 2023, 2, 19, 'string', 'test')
generalHistoryGraph(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5], sys.argv[6], sys.argv[7], sys.argv[8], sys.argv[9], sys.argv[10])