from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/translate", methods=["POST"])
def translate():
    try:
        data = request.get_json()

        text = data.get("text", "").strip()
        source = data.get("source", "en")
        target = data.get("target", "mr")

        if not text:
            return jsonify({"error": "Please enter some text."}), 400

        if source == target:
            return jsonify({"translated_text": text})

        response = requests.get(
            "https://api.mymemory.translated.net/get",
            params={
                "q": text,
                "langpair": f"{source}|{target}",
                "mt": "1"
            },
            timeout=20
        )

        result = response.json()

        if result.get("responseStatus") != 200:
            return jsonify({
                "error": result.get(
                    "responseDetails",
                    "Translation service error."
                )
            }), 502

        translated_text = result.get(
            "responseData", {}
        ).get("translatedText", "")

        if not translated_text:
            return jsonify({
                "error": "No translation received."
            }), 502

        return jsonify({
            "translated_text": translated_text
        })

    except Exception as e:
        print("Translation Error:", repr(e))
        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True)