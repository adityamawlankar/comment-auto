from flask import Flask, request

app = Flask(__name__)

@app.route('/webhook', methods=['GET', 'POST'])
def webhook():
    if request.method == 'GET':
        # Handle verification
        if 'hub.verify_token' in request.args and request.args.get('hub.verify_token') == 'my_secret_token':
            return request.args.get('hub.challenge')
    elif request.method == 'POST':
        # Process webhook event
        data = request.json
        print(data)
        return 'OK', 200

if __name__ == '__main__':
    app.run(debug=False)