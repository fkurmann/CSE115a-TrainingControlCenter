import matplotlib.pyplot as plt
import matplotlib.patches as mplpatches
import matplotlib.patheffects as PathEffects
import numpy as np
import matplotlib.image as mplimg
import sys
import json

from datetime import date, datetime


def pieGraph(username, duration, graphType, startYear, startMonth, startDay, jsonInput, outFile):
    activityList = json.loads(jsonInput)
    # Get totals for distance, time, or number of workouts
    totals = {}

    if (graphType == 'Distance'):
        for item in activityList:
            distance = 0
            if (item["Distance"] != None):
                distance = item["Distance"]

            identity = item['sport']
            if identity in totals:
                totals[identity] += (distance / 1609.34)
            else:
                totals[identity] = (distance / 1609.34)

    if (graphType == 'Time'):
        for item in activityList:
            time = 0
            if (item["moving_time"] != None):
                time = item['moving_time']

            identity = item['sport']
            if identity in totals:
                totals[identity] += (time / 3600)
            else:
                totals[identity] = (time / 3600)
    if (graphType == 'Quantity'):
        for item in activityList:
            identity = item['sport']
            if identity in totals:
                totals[identity] += 1
            else:
                totals[identity] = 1

    # Graphing
    labels = totals.keys()
    sizes = totals.values()
    fig, ax = plt.subplots()
    plt.pie(sizes, labels=labels, autopct='%1.1f%%')

    # Title
    ax.set_title(f"Breakdown of {graphType} following {str(int(startMonth)+1)}/{str(int(startDay))}/{startYear}")

    # Save location in images folder
    plt.savefig('../frontend/src/Components/images/' + outFile, dpi=600)
    return 'Graphing Complete'


pieGraph(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5], sys.argv[6], sys.argv[7], sys.argv[8])
