const express = require('express')
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

usersRouter
    .route('/own')
    .all(requireAuth)
    .all((req, res, next) => {
        const authToken = req.get('Authorization') || ''

        let bearerToken
        if(!authToken.toLowerCase().startsWith('bearer ')) {
            return res.status(401).json({ error: 'Missing bearer token'})
        } else {
            bearerToken = authToken.slice(7, authToken.length)
        }

        //extract user from token
        const payload = AuthService.verifyJwt(bearerToken)

        AuthService.getUserWithEmail(
            req.app.get('db'), 
            payload.sub
            )
            .then(myUser => {
                if(!myUser){
                    return res.status(401).json({ error: 'User not found' })
                }
                res.user = myUser
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        //return user object
        res.json(UsersService.serializeUser(res.user))
    })

module.exports = usersRouter