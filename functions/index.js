const functions = require('firebase-functions')

const { googleSheetCredential } = require('./config')
const { reply } = require('./helpers/line')
const { salaryMessage } = require('./helpers/line/messages')
const { getGoogleSheetData } = require('./helpers/googleSheets')
const { validateRegistered, registerUser } = require('./helpers/firebase')

exports.lineWebhook = functions.https.onRequest(async (req, res) => {
  try {
    const { type, message, source: { userId: lineUserID } } = req.body.events[0]
    const isTextMessage = type === 'message' && message.type === 'text'

    if (isTextMessage) {
      const messageFromUser = message.text.trim()
      const checkRegister = messageFromUser.split('register:')
      const needToRegister = checkRegister && checkRegister[1]

      if (needToRegister) {
        const idCardForRegister = checkRegister[1]
        const hasBeenRegistered = await validateRegistered(lineUserID)

        if (hasBeenRegistered) {
          return replyMessage(req.body, res, 'ไม่สามารถลงทะเบียนซ้ำได้')
        }

        const employees = await getGoogleSheetData(googleSheetCredential.GOOGLE_SHEET, googleSheetCredential.RANGE)
        const hasEmployee = employees.values.some(([employeeIDCard]) => employeeIDCard === idCardForRegister.toString())

        if (!hasEmployee) {
          return replyMessage(req.body, res, 'เลขบัตรประชาชนไม่ตรงกับที่มีในระบบ')
        }

        registerUser(lineUserID, idCardForRegister)
        return replyMessage(req.body, res, 'ลงทะเบียนเรียบร้อย')
      } else {
        switch(messageFromUser) {
          case 'register':
            return replyMessage(req.body, res, 'กรุณากรอก register:เลขบัตรบัตรประชาชน เช่น register:1234567890123')
          case 'salary':
            const hasBeenRegistered = await validateRegistered(lineUserID)

            if(!hasBeenRegistered) {
              return replyMessage(req.body, res, 'กรุณาลงทะเบียนก่อนใช้งาน')
            }

            const { idCard } = hasBeenRegistered
            const employees = await getGoogleSheetData(googleSheetCredential.GOOGLE_SHEET, googleSheetCredential.RANGE)
            const me = employees.values.filter(([employeeIDCard]) => employeeIDCard === idCard.toString())[0]

            return replyMessage(req.body, res, salaryMessage(me), 'flex')
        }
      }
    }

    res.status(200).send('ok')
  } catch (error) {
    console.error(error.message)
    res.status(400).send('error')
  }
})

const replyMessage = (bodyRequest, res, message, type) => {
  reply(bodyRequest, message, type)

  return res.status(200).send('ok')
}