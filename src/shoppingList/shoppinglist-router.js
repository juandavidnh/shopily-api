const express = require('express')
const path = require('path')
const ShoppingListService = require('./shoppinglist-service')
const ItemListService = require('../itemList/item-list-service')
const { requireAuth } = require('../middleware/jwt-auth-user')

const shoppingListRouter = express.Router()
const jsonBodyParser = express.json()

shoppingListRouter
    .route('/:userId')
    .all(requireAuth)
    .get((req, res, next) => {
        ShoppingListService.getShoppingList(
            req.app.get('db'),
            req.params.userId
        )
            .then(
                items => {
                    itemArray = []
                    items.map((item) => itemArray.push(ItemListService.serializeItem(item)))

                    res.json(itemArray)
                }
            )
            .catch(next)
    })
    .post(jsonBodyParser, (req, res, next) => {
        const { item_id } = req.body

        for (const field of ['item_id']) {
            if(!req.body[field]) {
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                })
            }
        }

        ShoppingListService.itemExists(
            req.app.get('db'),
            req.params.userId,
            item_id
        )
        .then( itemExists => {
            if(itemExists) {
                res.status(400).json({ error: 'Item already in list' })
            }

            return ShoppingListService.insertItem(
                req.app.get('db'),
                req.params.userId,
                item_id
            )
                .then(item => {
                    res 
                        .status(201)
                        .location(path.posix.join(req.originalUrl, `/${item.item_id}`))
                        .json(item)
                })
        })
        .catch(next)
    })

shoppingListRouter
    .route('/:userId/:itemId')
    .all(requireAuth)
    .delete((req, res, next) => {
        ShoppingListService.deleteItem(
            req.app.get('db'),
            req.params.userId,
            req.params.itemId
        )
            .then(() => {
                res.json("Item deleted")
            })
            .catch(next)
    })

module.exports = shoppingListRouter