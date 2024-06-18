
def process_knee_scan(methods = ["POST"]):
    url_recieved = str(request.get_json()["url"])

    response = requests.get(url_recieved)
    if (response.status_code == 200):
        image = Image.open(BytesIO(response.content))