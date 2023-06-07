import matplotlib.pyplot as plt
import matplotlib.patches as mplpatches
import matplotlib.patheffects as PathEffects
import numpy as np
import matplotlib.image as mplimg
import math
import sys
import json

from datetime import date, datetime


def generalHistoryGraph(username, duration, graphType, sport, goal, startYear, startMonth, startDay, jsonInput, outFile):
    startDate = date(int(startYear), int(startMonth) + 1, int(startDay))
    # Figure creation
    figureWidth = 5
    figureHeight = 5
    plt.figure(figsize=(figureWidth, figureHeight))

    panelWidth = 4
    panelHeight = 4
    panel1 = plt.axes([0.5 / figureWidth, 0.5 / figureHeight, panelWidth / figureWidth, panelHeight / figureHeight])

    oldActivityList = json.loads(jsonInput)
    activityIdList = []
    activityList = []
    for item in oldActivityList:
        if hasattr(item['json'], 'id'):
            activityId = item['json']['id']
            if activityId in activityIdList:
                continue
            elif activityId:
                activityIdList.append(activityId)
                activityList.append(item)
        else:
            activityList.append(item)

    # Get totals for distance or time
    maxX = 13
    if duration == 'Day':
        maxX = 15

    totals = []
    for i in range(1, maxX):
        totals.append([i, 0])

    jsonKey = ('', 1)
    if graphType == 'Distance':
        jsonKey = ('distance', 1609.34)
    elif graphType == 'Time':
        jsonKey = ('moving_time', 3600)
    elif graphType == 'Elevation':
        jsonKey = ('total_elevation_gain', 1 / 3.28084)
    elif graphType == 'Total Energy':
        jsonKey = ('kilojoules', 1)
    elif graphType == 'Average Power':
        jsonKey = ('average_watts', 1)
    elif graphType == 'Heart Rate':
        jsonKey = ('average_heartrate', 1)

    if jsonKey[0]:
        for item in activityList:
            if jsonKey[0] not in item['json']:
                continue
            # Lots of translation
            dateFormatted = item['start_date_local'].replace(".000Z", "Z")
            activityDate = datetime.strptime(dateFormatted, '%Y-%m-%dT%H:%M:%SZ').date()
            startDateDelta = int((activityDate - startDate).days)

            if duration == 'Week':
                startDateDelta = startDateDelta // 7
            if duration == 'Month':
                startDateDelta = startDateDelta // 30

            if (startDateDelta != 0):
                startDateDelta -= 1

            if (startDateDelta < maxX):
                totals[startDateDelta][1] += (item['json'][jsonKey[0]] / jsonKey[1])

    if (graphType == 'Quantity'):
        for item in activityList:
            # Lots of translation
            activityDate = datetime.strptime(item['start_date_local'], '%Y-%m-%dT%H:%M:%SZ').date()
            startDateDelta = (activityDate - startDate).days
            startDateDelta = int(startDateDelta)

            if duration == 'Week':
                startDateDelta = startDateDelta // 7
            if duration == 'Month':
                startDateDelta = startDateDelta // 30

            # Check logic:
            if (startDateDelta != 0):
                startDateDelta -= 1

            if (startDateDelta < maxX):
                totals[startDateDelta][1] += 1

    # Graphing
    # Panel ranges
    maxY = max([sublist[1] for sublist in totals])  # maxY is the largest y value, can be goal value
    maxY = math.ceil(maxY * 1.1)
    if maxY < 10:
        maxY = 10
    yTickSpace = maxY // 10

    panel1.set_xlim(0, maxX)
    panel1.set_ylim(0, maxY)

    for item in totals:
        panel1.plot(item[0],
                    item[1],
                    marker='o',
                    markerfacecolor='blue',
                    markeredgewidth=0.1,
                    markersize=4,
                    color='black',
                    linewidth=1,
                    alpha=1)

    # Median, average, standard deviation
    totalValues = []
    for item in totals:
        if item[1] != 0:
            totalValues.append(item[1])

    if (len(totalValues) != 0):
        averageValue = np.average(totalValues)
        medianValue = np.median(totalValues)
        lowerDev = averageValue - np.std(totalValues)
        upperDev = averageValue + np.std(totalValues)

        average = mplpatches.Rectangle([0, averageValue],
                                       width=maxX, height=0,
                                       edgecolor='green', facecolor='green', linewidth=0.75)
        median = mplpatches.Rectangle([0, medianValue],
                                      width=maxX, height=0,
                                      edgecolor='orange', facecolor='orange', linewidth=0.75)
        stdDevLow = mplpatches.Rectangle([0, lowerDev],
                                         width=maxX, height=0,
                                         edgecolor='yellow', facecolor='yellow', linewidth=0.75)
        stdDevHigh = mplpatches.Rectangle([0, upperDev],
                                          width=maxX, height=0,
                                          edgecolor='yellow', facecolor='yellow', linewidth=0.75)
        panel1.add_patch(average)
        panel1.add_patch(median)
        panel1.add_patch(stdDevLow)
        panel1.add_patch(stdDevHigh)

        # Legend
        panel1.legend([average, median, stdDevLow, stdDevHigh], ['Average', 'Median', '1 Standard Deviation'])

    # Goal overlay, optional
    # If goals selected, get goal for corresponding sport of type time/distance from database TODO
    if goal == True:
        pass

    # Ticks and labels
    panel1.set_xticks(np.arange(0, maxX))
    panel1.set_yticks(np.arange(0, maxY, yTickSpace))

    # Title
    panel1.set_title(f"{graphType} per {duration} for {sport}\nData starting {str(int(startMonth)+1)}/{str(int(startDay))}/{startYear}")

    panel1.set_xlabel(duration + 's')
    panel1.set_ylabel(graphType)

    panel1.tick_params(bottom=True,
                       labelbottom=True,
                       left=True,
                       labelleft=True,
                       right=False,
                       labelright=False,
                       top=False,
                       labeltop=False)

    # Save location in images folder
    plt.savefig('../frontend/src/Components/images/' + outFile, dpi=600)
    return 'Graphing Complete'


generalHistoryGraph(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5], sys.argv[6], sys.argv[7], sys.argv[8], sys.argv[9], sys.argv[10])
