import requests
import os
import json

TOKEN = os.getenv('TOKEN')
HEADER = {'Authorization': f"Bearer {TOKEN}"}
JSON_DIR = "./data"


class Strava_API:

    def createJSON(self, data, name):
        with open(f"{JSON_DIR}/{name}.json", 'w') as f:
            json.dump(data, f, indent=4)

    def getAllAthleteActivities(self):
        name = "all_athlete_activities"
        activites_url = "https://www.strava.com/api/v3/athlete/activities"
        param = {'per_page': 200, 'page': 1}
        all_data = list()
        data = requests.get(activites_url, headers=HEADER, params=param).json()
        while data:
            all_data.append(data)
            param['page'] += 1
            data = requests.get(activites_url, headers=HEADER, params=param).json()
        self.createJSON(all_data, name)

    def getAthleteStats(self):
        name = "athlete_stats"
        activities_url = "https://www.strava.com/api/v3/athlete"
        data = requests.get(activities_url, headers=HEADER).json()
        self.createJSON(data, name)

    def getAthleteZones(self):
        name = "athlete_zones"
        activities_url = "https://www.strava.com/api/v3/athlete/zones"
        data = requests.get(activities_url, headers=HEADER).json()
        self.createJSON(data, name)

    def getClubs(self):
        name = "all_athlete_clubs"
        activites_url = "https://www.strava.com/api/v3/athlete/clubs?page=&per_page="
        param = {'per_page': 30, 'page': 1}
        all_data = list()
        data = requests.get(activites_url, headers=HEADER, params=param).json()
        while data:
            all_data.append(data)
            param['page'] += 1
            data = requests.get(activites_url, headers=HEADER, params=param).json()
        self.createJSON(all_data, name)

    def getStarredSegments(self):
        name = "all_starred_segments"
        activites_url = "https://www.strava.com/api/v3/segments/starred?page=&per_page="
        param = {'per_page': 30, 'page': 1}
        all_data = list()
        data = requests.get(activites_url, headers=HEADER, params=param).json()
        while data:
            all_data.append(data)
            param['page'] += 1
            data = requests.get(activites_url, headers=HEADER, params=param).json()
        self.createJSON(all_data, name)
