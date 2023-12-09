import json
from mysql import connector


connection = connector.connect(
    host="127.0.0.1",
    user="root",
    password="",
    database="blog"
)

cursor = connection.cursor()

with open("jsondata.json",'rb') as file:
    file_data = json.load(file)
print(file_data[0].keys())
# columns = dict()

# for i in file_data[0].keys():
#     if i in ["end_year","intensity","start_year","relevance","likelihood"]:
#         columns[i] = "int"
#     else:
#         columns[i] = "varchar(1000)"
# # Creating table from json data
# query = "create table blogs("
# for name,column_type in columns.items():
#     query+=f"{name} {column_type},"
# query = query[:-1] + ")"
# cursor.execute(query)

# #inserting json data into the table
# query =f"insert into blogs ({','.join(file_data[0].keys())}) values({'%s,'*len(file_data[0])}"[:-1] + ");" 
# query = query[:-1]
# data = []
# for i in file_data:
#     temp_data = list(i.values())
#     for index,value in enumerate(temp_data):
#         if value == "":
#             temp_data[index] = None

#     data.append(temp_data)
# cursor.executemany(query,data)

# connection.commit()

# for data in file_data:
#     for datas in data.values:
#         query+=f"data"


# connection.commit()

    