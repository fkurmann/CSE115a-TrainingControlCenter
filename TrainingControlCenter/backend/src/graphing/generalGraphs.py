import matplotlib.pyplot as plt
import matplotlib.patches as mplpatches
import matplotlib.patheffects as PathEffects
import numpy as np
import matplotlib.image as mplimg
import math
import sys
import json

from datetime import date, timedelta

def generalHistoryGraph (username, duration, graphType, sport, goal, startYear, startMonth, startDay, jsonInput, outFile):

  print ('Params: ' + username, duration, graphType, sport, goal, startYear, startMonth, startDay, jsonInput, outFile)
  # Figure creation
  figureWidth=5
  figureHeight=5

  plt.figure(figsize=(figureWidth,figureHeight))

  panelWidth=4
  panelHeight=4

  panel1 = plt.axes([0.5/figureWidth, 0.5/figureHeight, panelWidth/figureWidth,panelHeight/figureHeight])

  # Database date filtering
  # minDate = date(startYear, startMonth, startDay) 
  # maxDate = minDate
  # if duration == 'Day':
  #   maxDate = minDate + timedelta(days=14)

  # elif duration == 'Week':
  #   maxDate = minDate + timedelta(weeks=12)
  # else:
  #   maxDate = minDate + timedelta(months=12)


  activityList = json.loads(jsonInput)
  # print(activityDict)

  for item in activityList:
    print (item['name'])

  # Get totals for distance or time
  totals = []
  counter = 1
  if (graphType == 'Distance'):
    # Daily total graphing

    # Weekly total graphing

    # Monthly total graphing
    
    for item in activityList:
      totals.append((counter, item['distance']/1609.34))
      counter += 1
  if (graphType == 'Time'):
    for item in activityList:
      totals.append((counter, item['moving_time']/3600))
      counter += 1
    
  
    # Daily total graphing

    # Weekly total graphing

    # Monthly total graphing




  




  # Graphing
  # Panel ranges
  maxY = max(totals)[1] # maxY is the largest y value, can be goal value
  maxY = math.ceil(maxY * 1.1)
  yTickSpace = maxY//10

  maxX = 13
  if duration == 'Day':
    maxX = 15

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


  # If goals selected, get goal for corresponding sport of type time/distance from database TODO

  # Goal overlay, optional
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