from flask import Flask, render_template, jsonify

app = Flask(__name__)

PET = {
    "name": "Buddy",
    "age": 4,
    "breed": "Labrador Retriever",
}

# Hardcoded 7-day history for the demo — no real collar/device involved.
HISTORY = [
    {"day": "Mon", "steps": 3200, "sleep_hours": 8.1, "activity_level": "moderate", "fed": True},
    {"day": "Tue", "steps": 4100, "sleep_hours": 7.5, "activity_level": "high", "fed": True},
    {"day": "Wed", "steps": 2200, "sleep_hours": 9.0, "activity_level": "low", "fed": True},
    {"day": "Thu", "steps": 3900, "sleep_hours": 7.8, "activity_level": "moderate", "fed": True},
    {"day": "Fri", "steps": 1800, "sleep_hours": 9.4, "activity_level": "low", "fed": False},
    {"day": "Sat", "steps": 5000, "sleep_hours": 7.0, "activity_level": "high", "fed": True},
    {"day": "Sun", "steps": 1500, "sleep_hours": 9.6, "activity_level": "low", "fed": False},
]


def build_today_summary():
    today = HISTORY[-1]
    past_week = HISTORY[:-1]
    avg_steps = sum(d["steps"] for d in past_week) / len(past_week)

    if today["steps"] < avg_steps * 0.75:
        health_message = f"{PET['name']}'s had a quieter day than usual — steps are well below his weekly average."
        recommendation = "exercise"
        recommendation_message = f"Today looks like a good day for a proper walk to get {PET['name']} moving."
    elif today["steps"] > avg_steps * 1.25:
        health_message = f"{PET['name']}'s been more active than usual today."
        recommendation = "rest"
        recommendation_message = f"After a busy stretch, let {PET['name']} take it easy today."
    else:
        health_message = f"{PET['name']}'s doing great and right on track for a normal week."
        recommendation = "treats"
        recommendation_message = f"A balanced day — {PET['name']} has earned a favorite treat."

    feeding_flag = None if today["fed"] else f"{PET['name']} hasn't been logged as fed yet today."

    return {
        "health_message": health_message,
        "recommendation": recommendation,
        "recommendation_message": recommendation_message,
        "feeding_flag": feeding_flag,
    }


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/today')
def api_today():
    return jsonify({
        "pet": PET,
        "history": HISTORY,
        "today": build_today_summary(),
    })


if __name__ == '__main__':
    # Port 5001 to avoid the macOS AirPlay conflict on 5000
    app.run(debug=True, port=5001)
