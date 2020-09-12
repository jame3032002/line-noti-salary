const functions = require('firebase-functions')
const axios = require('axios')

const { lineCredential } = require('./config')
const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message'
const LINE_HEADER = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${lineCredential.ACCESS_TOKEN}`
}

exports.lineWebhook = functions.https.onRequest((req, res) => {
  try {
    const { type, message } = req.body.events[0]

    switch (type) {
      case 'message':
        if (message.type === 'text') {
          if(message.text.trim() === 'register') {
            reply(req.body, 'กรุณากรอก register:เลขบัตรบัตรประชาชน เช่น register:1234567890123')
          } else if(message.text.trim() === 'salary') {
            reply(req.body, salaryMessage, 'flex')
          }
        }
    }

    res.status(200).send('ok')
  } catch (error) {
    console.error(error.message)
    res.status(400).send('error')
  }
})

const reply = async (bodyResponse, message, type, altText = 'เงินเดือนพนักงาน') => {
  let messages = [{ type: `text`, text: message }]

  if (type === 'flex') {
    messages = [{ type: 'flex', altText, contents: message }]
  }

  try {
    const response = await axios({
      method: 'post',
      url: `${LINE_MESSAGING_API}/reply`,
      data: {
        replyToken: bodyResponse.events[0].replyToken,
        messages
      },
      headers: LINE_HEADER
    })

    return response
  } catch (error) {
    console.log(error.message)
    return null
  }
}

const salaryMessage = {
  "type": "bubble",
  "body": {
    "type": "box",
    "layout": "vertical",
    "contents": [
      {
        "type": "text",
        "text": "KAJAME COMPANY",
        "color": "#1DB446",
        "size": "md",
        "weight": "bold"
      },
      {
        "type": "text",
        "text": "Driver",
        "weight": "bold",
        "size": "xxl",
        "margin": "md"
      },
      {
        "type": "text",
        "text": "คุณสมชาย สายสมร",
        "size": "sm",
        "color": "#555555",
        "wrap": true,
        "margin": "sm"
      },
      {
        "type": "separator",
        "margin": "xxl"
      },
      {
        "type": "box",
        "layout": "vertical",
        "margin": "xxl",
        "spacing": "sm",
        "contents": [
          {
            "type": "box",
            "layout": "horizontal",
            "contents": [
              {
                "type": "text",
                "text": "เงินเดือน",
                "size": "md",
                "color": "#777777",
                "flex": 0
              },
              {
                "type": "text",
                "text": "10,000 บาท",
                "size": "md",
                "color": "#777777",
                "align": "end"
              }
            ]
          },
          {
            "type": "box",
            "layout": "horizontal",
            "contents": [
              {
                "type": "text",
                "text": "โอที",
                "size": "md",
                "color": "#777777",
                "flex": 0
              },
              {
                "type": "text",
                "text": "3000 บาท",
                "size": "md",
                "color": "#777777",
                "align": "end"
              }
            ]
          }
        ]
      },
      {
        "type": "separator",
        "margin": "xxl"
      },
      {
        "type": "box",
        "layout": "horizontal",
        "margin": "lg",
        "contents": [
          {
            "type": "text",
            "text": "รวมเป็นเงิน",
            "size": "lg",
            "color": "#555555",
            "flex": 0,
            "weight": "bold"
          },
          {
            "type": "text",
            "text": "13,000 บาท",
            "color": "#555555",
            "size": "lg",
            "align": "end",
            "weight": "bold",
            "style": "normal"
          }
        ]
      }
    ]
  },
  "styles": {
    "footer": {
      "separator": true
    }
  }
}