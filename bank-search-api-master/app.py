from flask import Flask, request, redirect, views, jsonify, make_response, json
from flask_cors import CORS

from bank_resource import BankResource

app = Flask(__name__)
CORS(app, support_credentials=True)


class BankSearchLanding(views.MethodView):

    def get(self):
        return make_response(jsonify({'documentation': 'https://documenter.getpostman.com/view/842558/SWECXvsn'}))

    def post(self):
        return make_response(jsonify({'message': 'Incorrect Endpoint. Please use /api'}))


class BankSearchAPI(views.MethodView):
    def get(self):
        return make_response(jsonify({'message': 'Incorrect method. Please use POST method'}))

    def post(self):
        payload = request.get_json(force=True)
        q_bank = payload.get('q_bank', '')
        q_branch = payload.get('q_branch', '')
        try:
            result = BankResource.search(bank_query=q_bank, branch_query=q_branch).to_json()
            parsed_response = json.loads(result)
            print(parsed_response)
            return make_response(jsonify(parsed_response), 200)
        except ValueError as e:
            return make_response(jsonify({'error': str(e)}), 404)
        except Exception as e:
            return make_response(jsonify({'error': 'Internal server error', 'message': str(e)}), 500)


app.add_url_rule('/', view_func=BankSearchLanding.as_view('home'))
app.add_url_rule('/api/', view_func=BankSearchAPI.as_view('api'))


@app.errorhandler(404)
def page_not_found(e):
    return redirect("/", code=302)


if __name__ == '__main__':
    app.run(debug=False, threaded=True)
