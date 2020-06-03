const express = require('express')
const path = require('path')
const SupermarketsService = require('./supermarkets-service')
const AuthService = require('../auth/auth-service')
const { requireAuth } = require('../middleware/jwt-auth-user')

const supermarketsRouter = express.Router()
const jsonBodyParser = express.json()

supermarketsRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        SupermarketsService.getAllSupermarkets(req.app.get('db'))
            .then(supermarkets  => {
                supermarketArray = []
                supermarkets.map((supermarket) => supermarketArray.push(SupermarketsService.serializeSupermarket(supermarket)))
                
                res.json(supermarketArray)               
            })
            .catch(next)
    })
    .post(jsonBodyParser, (req, res, next) => {
        const { supermarket_name, supermarket_city } = req.body
        const newSupermarket = { supermarket_name, supermarket_city}

        for (const field of ['supermarket_name', 'supermarket_city']) {
            if(!req.body[field]) {
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                })
            }
        }

        SupermarketsService.getByName(
            req.app.get('db'),
            supermarket_name
        )
        .then( supermarketExists => {
            if(supermarketExists) {
                res.status.json({ error: 'Supermarket already exists' })
            }

            return SupermarketsService.insertSupermarket(
                req.app.get('db'),
                newSupermarket
            )
                .then(supermarket => {
                    res 
                        .status(201)
                        .location(path.posix.join(req.originalUrl, `/${supermarket.id}`))
                        .json(SupermarketsService.serializeSupermarket(supermarket))
                })
        })
        .catch(next)
    })

supermarketsRouter
    .route('/:id')
    .all(requireAuth)
    .all((req, res, next) => {
        SupermarketsService.getById(
            req.app.get('db'),
            req.params.id
        )
        .then(supermarket => {
            if(!supermarket) {
                return res.status(404).json({
                    error: {message: `Supermarket doesn't exist`}
                })
            }

            res.supermarket = supermarket
            next()
        })
    })
    .get((req, res, next) => {
        res.json(SupermarketsService.serializeSupermarket(res.supermarket))
    })
    .patch(jsonBodyParser, (req, res, next) => {
        const { supermarket_name, supermarket_city } = req.body

        const updatedSupermarket = { supermarket_name, supermarket_city }

        const numberOfValues = Object.values(updatedSupermarket).filter(Boolean).length
        if(numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: 'Request must contain at least one value to update.'
                }
            })
        }

        SupermarketsService.updateSupermarket(
            req.app.get('db'),
            req.params.id,
            updatedSupermarket
        )
        .then(supermarket => {
            res.json(SupermarketsService.serializeSupermarket(supermarket))
        })
        .catch(next)
    })

module.exports = supermarketsRouter