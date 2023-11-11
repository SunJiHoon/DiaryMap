from flask import Flask, request, jsonify, Response, json

import openai

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False

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
    #return "가나다마바사"
    conversation.append({"role": "user", "content": user_message})
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo-0613",
        messages=conversation
    )
    assistant_message = response.choices[0].message['content']
    conversation.append({"role": "assistant", "content": assistant_message})
    print(assistant_message)
    res = json.dumps(assistant_message, ensure_ascii=False).encode('utf8')
    return Response(res, content_type='application/json; charset=utf-8')

if __name__ == "__main__":
    app.run()
# UTF-8 문자 인코딩 설정
