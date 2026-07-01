from flask import Flask, render_template, jsonify
import sqlite3
import os

app = Flask(__name__)

DB_PATH = os.path.join(os.path.dirname(__file__), 'database.db')


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


@app.route('/')
def index():
    return render_template('index.html')


if __name__ == '__main__':
    # Port 5001 to avoid the macOS AirPlay conflict on 5000
    app.run(debug=True, port=5001)
