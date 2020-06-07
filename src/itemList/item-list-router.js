const express = require('express')
const path = require('path')
const ItemListService = require('./item-list-service')
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
    .post(jsonBodyParser, (req, res, next) => {
        const { code, product_name, aisle, supermarket_id } = req.body
        const newItem = { code, product_name, aisle, supermarket_id }

        for (const field of ['code', 'product_name', 'aisle', 'supermarket_id']) {
            if(!req.body[field]) {
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                })
            }
        }

        ItemListService.getByCode(
            req.app.get('db'),
            code
        )
        .then( itemExists => {
            if(itemExists) {
                res.status(400).json({ error: 'Item code already exists' })
            }

            return ItemListService.insertItem(
                req.app.get('db'),
                newItem
            )
                .then(item => {
                    res 
                        .status(201)
                        .location(path.posix.join(req.originalUrl, `/${item.id}`))
                        .json(ItemListService.serializeItem(item))
                })
        })
        .catch(next)
    })

itemListRouter
    .route('/:id')
    .all(requireAuth)
    .all((req, res, next) => {
        ItemListService.getById(
            req.app.get('db'),
            req.params.id
        )
        .then(item => {
            if(!item) {
                return res.status(404).json({
                    error: {message: `Item doesn't exist`}
                })
            }

            res.item = item
            next()
        })
    })
    .get((req, res, next) => {
        res.json(ItemListService.serializeItem(res.item))
    })
    .patch(jsonBodyParser, (req, res, next) => {
        const { code, product_name, aisle, supermarket_id } = req.body

        const updatedItem = { code, product_name, aisle, supermarket_id }

        const numberOfValues = Object.values(updatedItem).filter(Boolean).length
        if(numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: 'Request must contain at least one value to update.'
                }
            })
        }

        ItemListService.updateItem(
            req.app.get('db'),
            req.params.id,
            updatedItem
        )
        .then(item => {
            res.json(ItemListService.serializeItem(item))
        })
        .catch(next)
    })

   
module.exports = itemListRouter