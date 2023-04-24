"""Strava API Calls Manager

This script allows easy connection between the user data by storing all data
into json files.

This file can be imported as a module and contains the following class:

    * stravaAPI - class for strava api
"""
__author__ = "Ethan Ma"

import requests
import os
import json

TOKEN = os.getenv('TOKEN') # TBD
HEADER = {'Authorization': f"Bearer {TOKEN}"}
JSON_DIR = "./data"


class stravaAPI:
    """
    A class used to manage the Strava API.
    ...

    Methods
    ----
    get_all_athlete_activities()
    get_athlete_stats()
    get_athlete_zones()
    get_clubs()
    get_starred_segments()
    """

    def _create_json(self, data, name):
        """Helper function to write json data to JSON_DIR.

        :param data (list): list of data from api call
        :param name (str): name of file to be created
        :return:
        """
        with open(f"{JSON_DIR}/{name}.json", 'w') as f:
            json.dump(data, f, indent=4)

    def get_all_athlete_activities(self):
        """Gathers data for all of athlete's activities.

        This displays a list of ALL the user's activities. Each of these
        activities have various data points such as activity name, elapsed time,
        activity type, and more.
        """
        name = "all_athlete_activities"
        activites_url = "https://www.strava.com/api/v3/athlete/activities"
        param = {'per_page': 200, 'page': 1}
        all_data = list()
        data = requests.get(activites_url, headers=HEADER, params=param).json()
        while data:
            all_data.append(data)
            param['page'] += 1
            data = requests.get(activites_url, headers=HEADER, params=param).json()
        self._create_json(all_data, name)

    def get_athlete_stats(self):
        """Gathers data for all of athlete's stats.

        This displays the users profile page information, such as username,
        account creation, follower counts, and more.
        """
        name = "athlete_stats"
        activities_url = "https://www.strava.com/api/v3/athlete"
        data = requests.get(activities_url, headers=HEADER).json()
        self._create_json(data, name)

    def get_athlete_zones(self):
        """Gathers data for the athlete's heart rate and power zones."""
        name = "athlete_zones"
        activities_url = "https://www.strava.com/api/v3/athlete/zones"
        data = requests.get(activities_url, headers=HEADER).json()
        self._create_json(data, name)

    def get_clubs(self):
        """Gathers data for all of athlete's clubs."""
        name = "all_athlete_clubs"
        activites_url = "https://www.strava.com/api/v3/athlete/clubs?page=&per_page="
        param = {'per_page': 30, 'page': 1}
        all_data = list()
        data = requests.get(activites_url, headers=HEADER, params=param).json()
        while data:
            all_data.append(data)
            param['page'] += 1
            data = requests.get(activites_url, headers=HEADER, params=param).json()
        self._create_json(all_data, name)

    def get_starred_segments(self):
        """Gathers data for all of athlete's starred segments."""
        name = "all_starred_segments"
        activites_url = "https://www.strava.com/api/v3/segments/starred?page=&per_page="
        param = {'per_page': 30, 'page': 1}
        all_data = list()
        data = requests.get(activites_url, headers=HEADER, params=param).json()
        while data:
            all_data.append(data)
            param['page'] += 1
            data = requests.get(activites_url, headers=HEADER, params=param).json()
        self._create_json(all_data, name)
