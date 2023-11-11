from flask import Flask, request, jsonify
import openai

app = Flask(__name__)

# OpenAI API 키 설정
api_key = "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"
openai.api_key = api_key

# 대화 데이터 설정
conversation = [
    {"role": "system", "content": "You are a helpful assistant."},
]

@app.route("/chat", methods=["POST"])
def chat():

    user_message = request.json.get("user_message")
    print(user_message)
    conversation.append({"role": "user", "content": user_message})
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo-0613",
        messages=conversation
    )
    assistant_message = response.choices[0].message['content']
    conversation.append({"role": "assistant", "content": assistant_message})
    print(assistant_message)
    return jsonify({"assistant_message": assistant_message})

if __name__ == "__main__":
    app.run()
