import sys
import csv
import pymysql
import requests
import time
import re
import unicodedata
import math
import string

reload(sys)
sys.setdefaultencoding("utf-8")

conn = pymysql.connect(host='127.0.0.1', unix_socket='/Applications/MAMP/tmp/mysql/mysql.sock', user='root', passwd='root', db='billboard_v2', charset='utf8')

cursor = conn.cursor(pymysql.cursors.DictCursor)

with open('/Applications/MAMP/htdocs/slavery/converted.csv', 'a') as csvfile:
    writer = csv.writer(csvfile, delimiter=',',
                            quotechar='|', quoting=csv.QUOTE_MINIMAL)
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    cursor.execute("SELECT * from spotify_whitburn where point_id > 0 order by point_id")
    result_set = cursor.fetchall()
    for row in result_set:
        time.sleep(.1)
        print "*******"
        artist = row["artist"]
        song_id = row["song_id"]
        spotify_artist_id = row["spotify_artist_id"]
        image_url_small = ""
        image_url_small_w = ""
        image_url_small_h = ""
        image_url_big = ""
        image_url_big_w = ""
        image_url_big_h = ""
        artist = artist.split(" feat")[0]
        artist = artist.split(" Feat")[0]

        if(spotify_artist_id != ""):
            url = "https://api.spotify.com/v1/artists/"+spotify_artist_id
            r = requests.get(url)
            json = r.json()
            if len(json["images"])>0:
                image_url_small = json["images"][len(json["images"])-1]["url"]
                image_url_small_w = json["images"][len(json["images"])-1]["width"]
                image_url_small_h = json["images"][len(json["images"])-1]["height"]

                image_url_big = json["images"][len(json["images"])-2]["url"]
                image_url_big_w = json["images"][len(json["images"])-2]["width"]
                image_url_big_h = json["images"][len(json["images"])-2]["height"]
        #
        else:
            url = "https://api.spotify.com/v1/search?query="+artist+"&offset=0&limit=20&type=artist"
            r = requests.get(url)
            json = r.json()
            if json["artists"]["total"] > 0:
                if len(json["artists"]["items"][0]["images"])>0:
                    image_url_small = json["artists"]["items"][0]["images"][len(json["artists"]["items"][0]["images"])-1]["url"]
                    image_url_small_w = json["artists"]["items"][0]["images"][len(json["artists"]["items"][0]["images"])-1]["width"]
                    image_url_small_h = json["artists"]["items"][0]["images"][len(json["artists"]["items"][0]["images"])-1]["height"]

                    image_url_big = json["artists"]["items"][0]["images"][len(json["artists"]["items"][0]["images"])-2]["url"]
                    image_url_big_w = json["artists"]["items"][0]["images"][len(json["artists"]["items"][0]["images"])-2]["width"]
                    image_url_big_h = json["artists"]["items"][0]["images"][len(json["artists"]["items"][0]["images"])-2]["height"]

        print song_id,spotify_artist_id,artist,image_url_small,image_url_small_w,image_url_small_h,image_url_big,image_url_big_w,image_url_big_h
        writer.writerow([song_id,spotify_artist_id,artist,image_url_small,image_url_small_w,image_url_small_h,image_url_big,image_url_big_w,image_url_big_h])
