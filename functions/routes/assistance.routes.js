const { Router } = require('express')
const admin = require("firebase-admin");
const router = Router();



const db = admin.firestore();

router.get('/users/:userId', async (req, res) => {
  try {
    const doc = db.collection('users').doc(req.params.userId)
    const user  = await doc.get()
    return res.status(200).json(user.data())
  } catch (e) {
    return res.status(500).send(e);
  }

});

module.exports = router