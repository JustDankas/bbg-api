const express = require('express')
const router = express.Router()
const db = require('./data')

router.get('/',async (req,res)=>{
    try {
        res.status(200).json({
            currentMap:db.currentMap,
            grid:db.grid
        })
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

module.exports = router