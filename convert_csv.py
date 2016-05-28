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

conn = pymysql.connect(host='127.0.0.1', unix_socket='/Applications/MAMP/tmp/mysql/mysql.sock', user='root', passwd='root', db='slavery', charset='utf8')

cursor = conn.cursor(pymysql.cursors.DictCursor)

with open('/Applications/MAMP/htdocs/slavery/converted.csv', 'a') as csvfile:
    writer = csv.writer(csvfile, delimiter=',',
                            quotechar='|', quoting=csv.QUOTE_MINIMAL)
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    cursor.execute("SELECT * from slavery where point_id > 0 order by point_id LIMIT 1")
    result_set = cursor.fetchall()

    for row in result_set:
        print "*******"
        for key in row:
            print key,row[key]



        # point_id = row[""]
        # song_id = row["song_id"]
        # spotify_artist_id = row["spotify_artist_id"]
        # writer.writerow([])
