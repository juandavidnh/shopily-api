const express = require('express')
const path = require('path')
const ItemListService = require('./item-list-service')
const AuthService = require('../auth/auth-service')
const { requireAuth } = require('../middleware/jwt-auth-user')

const itemListRouter = express.Router()
const jsonBodyParser = express.json()

itemListRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        ItemListService.getAllItems(req.app.get('db'))
            .then(items  => {
                itemArray = []
                items.map((item) => itemArray.push(ItemListService.serializeItem(item)))
                
                res.json(itemArray)
            })
            .catch(next)
    })
   
module.exports = itemListRouter