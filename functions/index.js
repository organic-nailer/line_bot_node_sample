const functions = require("firebase-functions");
const https = require("https");
// const express = require("express");
// const app = express();

// const port = 3000;
// eslint-disable-next-line max-len
const TOKEN = functions.config().linebot.token;

// app.use(express.json());
// app.use(express.urlencoded({extended: true}));

exports.hello = functions.https.onRequest((req, res) => {
  res.sendStatus(200);
});

exports.webhook = functions.https.onRequest(function(req, res) {
  if (req.method !== "POST") {
    res.sendStatus(400);
  } else {
    res.send("HTTP POST request sent to the webhook URL!");
    // ユーザーがボットにメッセージを送った場合、返信メッセージを送る
    if (req.body.events[0].type === "message") {
      const reqMessage = req.body.events[0].message.text;
      // eslint-disable-next-line max-len
      const replyMessage = reqMessage != 0 && reqMessage != null ? `${reqMessage}ロギ～` : "は？ロギ";
      // 文字列化したメッセージデータ
      const dataString = JSON.stringify({
        replyToken: req.body.events[0].replyToken,
        messages: [
          {
            "type": "text",
            "text": replyMessage,
          },
        ],
      });

      // リクエストヘッダー
      const headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + TOKEN,
      };

      // リクエストに渡すオプション
      const webhookOptions = {
        "hostname": "api.line.me",
        "path": "/v2/bot/message/reply",
        "method": "POST",
        "headers": headers,
        "body": dataString,
      };

      // リクエストの定義
      const request = https.request(webhookOptions, (res) => {
        res.on("data", (d) => {
          process.stdout.write(d);
        });
      });

      // エラーをハンドル
      request.on("error", (err) => {
        console.error(err);
      });

      // データを送信
      request.write(dataString);
      request.end();
    }
  }
});
