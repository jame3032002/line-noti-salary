const admin = require('firebase-admin')

const { firebaseCredential } = require('../config')
const serviceAccount = require('../credential.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: firebaseCredential.DATABASE_URL
})

const db = admin.database()

const validateRegistered = (lineUserID) => {
  return new Promise((resolve, reject) => {
    const ref = db.ref(`/users/${lineUserID}`)

    ref.once('value')
      .then(snapshot => resolve(snapshot.val()))
      .catch(error => reject(error))
  })
}

const registerUser = async (lineUserID, idCard) => {
  return new Promise((resolve, reject) => {
    const ref = db.ref(`/users/${lineUserID}`)

    ref.transaction(() => ({ idCard }))
      .then((data) => resolve(data))
      .catch((error) => reject(error))
  })
}

module.exports = { validateRegistered, registerUser }