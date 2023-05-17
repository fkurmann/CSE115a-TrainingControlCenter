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

def generalHistoryGraph ():
  
  figureWidth=5
  figureHeight=5
  outfile = 'default'

  plt.figure(figsize=(figureWidth,figureHeight))

  panelWidth=4
  panelHeight=4

  panel1 = plt.axes([0.5/figureWidth, 0.5/figureHeight, panelWidth/figureWidth,panelHeight/figureHeight])

  
    
  

  # Title
  panel1.set_title('Create a graph using the generate graph form.')

  
  #plt.savefig('../frontend/images/default',dpi=600)
  plt.savefig('squares.png',dpi=600)
  return 'Graphing Complete'

# generalHistoryGraph('fkurmann', 'Week', 'Distance', 'Run', False, 2023, 2, 19, 'string', 'test')
generalHistoryGraph()