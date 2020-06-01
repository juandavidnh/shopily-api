const express = require('express')
const path = require('path')
const UsersService = require('./users-service')
const AuthService = require('../auth/auth-service')
const { requireAuth } = require('../middleware/jwt-auth-user')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter
    .route('/sign-up')
    .post(jsonBodyParser, (req, res, next) => {
        const { email, password, first_name, last_name } = req.body

        for (const field of ['email', 'password', 'first_name', 'last_name']){
            if(!req.body[field]){
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                })
            }
        }

        const passwordError = UsersService.validatePassword(password)

        if(passwordError) {
            return res.status(400).json({ error: passwordError })
        }

        UsersService.hasUserWithEmail(
            req.app.get('db'),
            email
        )
            .then(hasUserWithEmail => {
                if(hasUserWithEmail) {
                    return res.status(400).json({ error: 'User already exists, try signing in.' })
                } else {
                    return UsersService.hashPassword(password)
                        .then(hashedPassword => {
                            const newUser = {
                                email,
                                password: hashedPassword,
                                first_name,
                                last_name,
                                date_created: 'now()',
                            }

                            return UsersService.insertUser(
                                req.app.get('db'),
                                newUser
                            )
                                .then(user => {
                                    const sub = user.email
                                    const payload = {
                                        user_id: user.id
                                    }

                                    res.send({
                                        authToken: AuthService.createJwt(sub, payload)
                                    })
                                })
                        })
                }
            })
            .catch(next)
    })

module.exports = usersRouter