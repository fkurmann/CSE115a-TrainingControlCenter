import matplotlib.pyplot as plt
import matplotlib.patches as mplpatches
import matplotlib.patheffects as PathEffects
import numpy as np
import matplotlib.image as mplimg
import math
import sys

def generalHistoryGraph (username, duration, graphType, sport, goal, startDate, outFile):

  print ('Params:' + username, duration, graphType, sport, goal, startDate, outFile)
  # Figure creation
  figureWidth=5
  figureHeight=5

  plt.figure(figsize=(figureWidth,figureHeight))

  panelWidth=4
  panelHeight=4

  panel1 = plt.axes([0.5/figureWidth, 0.5/figureHeight, panelWidth/figureWidth,panelHeight/figureHeight])


  # Graphing
  maxY = 10 # maxY is the largest y value, can be goal value
  maxY = math.ceil(maxY * 1.1)

  # Data Graphing






  # Goal overlay, optional
  if goal == True:
    pass









          
  # Panel ranges
  maxX = 13
  if duration == 'Day':
    maxX = 15

  panel1.set_xlim(0, maxX)
  panel1.set_ylim(0, maxY) 



  # Ticks and labels 
  panel1.set_xticks(np.arange(0, maxX))
  panel1.set_yticks(np.arange(0, maxY))

  # Title
  # panel1.set_title(graphType + ' per ' duration + ' for all Sports')

  panel1.set_xlabel(duration + 's')
  panel1.set_ylabel(graphType)


  panel1.tick_params(bottom=True, labelbottom=True,\
                    left=True, labelleft=True, \
                    right=False, labelright=False,\
                    top=False, labeltop=False)

  # TODO, save location in images folder
  plt.savefig('../frontend/images/' + outFile,dpi=600)
  # plt.savefig(outFile,dpi=600)
  return 'Graphing Complete'


generalHistoryGraph(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5], sys.argv[6], sys.argv[7])