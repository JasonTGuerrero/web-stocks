# app.py
from flask import Flask, jsonify, request
from datetime import datetime
from dateutil.relativedelta import relativedelta
import requests
import json

app = Flask(__name__, static_url_path='/static')

finnhub_api_key = 'cmvcf0pr01qog1iut58gcmvcf0pr01qog1iut590'
polygon_api_key = 'FsQxBRrG_bRv_EnkEQvTEHkIToVyu29V'

@app.route('/')
def index():
    return app.send_static_file("r3g7h6y9k2.html")

@app.route('/get_company_profile_data/<symbol>')
def get_company_profile_data(symbol):
    # symbol = request.args.get('symbol')
    finnhub_url = f'https://finnhub.io/api/v1/stock/profile2?symbol={symbol}&token={finnhub_api_key}'
    finnhub_response = requests.get(finnhub_url)
    finnhub_data = finnhub_response.json()

    # Return data as JSON
    return jsonify(finnhub_data)

@app.route('/get_company_quote_data/<symbol>')
def get_company_quote_data(symbol):
    # symbol = request.args.get('symbol')
    finnhub_url = f'https://finnhub.io/api/v1/quote?symbol={symbol}&token={finnhub_api_key}'
    finnhub_response = requests.get(finnhub_url)
    finnhub_data = finnhub_response.json()

    return jsonify(finnhub_data)

@app.route('/get_company_trends_data/<symbol>')
def get_company_trends_data(symbol):
    # symbol = request.args.get('symbol')
    finnhub_url = f'https://finnhub.io/api/v1/stock/recommendation?symbol={symbol}&token={finnhub_api_key}'
    finnhub_response = requests.get(finnhub_url)
    finnhub_data = finnhub_response.json()

    return jsonify(finnhub_data)

@app.route('/get_company_news_data/<symbol>')
def get_company_news_data(symbol):
    # symbol = request.args.get('symbol')
    current_date = datetime.now().date()
    start_date = current_date - relativedelta(days=30)
    finnhub_url = f'https://finnhub.io/api/v1/company-news?symbol={symbol}&from={start_date}&to={current_date}&token={finnhub_api_key}'
    finnhub_response = requests.get(finnhub_url)
    finnhub_data = finnhub_response.json()

    return jsonify(finnhub_data)

@app.route('/get_polygon_data/<symbol>')
def get_polygon_data(symbol):
    # symbol = request.args.get('symbol')
    # Get the current date
    current_date = datetime.now().date()
    # Calculate the date 6 months and 1 day ago
    start_date = current_date - relativedelta(months=6, days=1)
    polygon_url = f'https://api.polygon.io/v2/aggs/ticker/{symbol}/range/1/day/{start_date}/{current_date}?adjusted=true&sort=asc&apiKey={polygon_api_key}'
    polygon_response = requests.get(polygon_url)
    polygon_data = polygon_response.json()

    # Return data as JSON
    return jsonify(polygon_data)

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5500, debug=True)

