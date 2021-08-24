const express = require('express')

const router = new express.Router()

router.get('/health', (req, res) => res.status(200).send({ health: 'ok' }))

module.exports = router
