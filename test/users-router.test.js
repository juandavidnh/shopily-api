const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const jwt = require('jsonwebtoken') 
const config = require('../src/config')
const supertest = require('supertest')
const { expect } = require('chai')

describe('Users endpoints', () => {
    let db

    const {
        testSupermarkets,
        testUsers,
        testItemList,
        testShoppingList
    } = helpers.makeFixtures()

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })

        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))

    beforeEach('cleanup', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))

    describe(`POST /api/users/sign-up`, () => {
        beforeEach('insert users', () =>
            helpers.seedTables(
                db,
                testSupermarkets,
                testUsers,
                testItemList,
                testShoppingList
            )
        )

        it('signs new user up and returns JWT token', () => {
            const newUser = {
                first_name: "Test",
                last_name: "Test",
                email: "test@newest.com",
                password: "TestPassword1!"
            }

            return supertest(app)
                .post('/api/users/sign-up')
                .send(newUser)
                .expect(200)
                .expect(res => {
                    expect(res.body).to.have.property('authToken')
                })
        })
    })

    describe(`GET /api/users/own`, () => {
        beforeEach('insert users', () =>
            helpers.seedTables(
                db,
                testSupermarkets,
                testUsers,
                testItemList,
                testShoppingList
            )
        )

        it('get signed in user credentials', () => {
            const jwtToken = jwt.sign(
                { user_id: testUsers.indexOf(testUsers[0]) + 1},
                config.JWT_SECRET,
                { subject: testUsers[0].email, algorithm: 'HS256' }
            )

            return supertest(app)
                .get('/api/users/own')
                .set('Authorization', `bearer ${jwtToken}`)
                .expect(200)
                .expect(res => {
                    expect(res.body.email).to.eql(testUsers[0].email)
                })
        })
    })

    describe(`PATCH /api/users/own`, () => {
        beforeEach('insert users', () =>
            helpers.seedTables(
                db,
                testSupermarkets,
                testUsers,
                testItemList,
                testShoppingList
            )
        )

        it('edits specific user', () => {
            const jwtToken = jwt.sign(
                { user_id: testUsers.indexOf(testUsers[0])+1 }, 
                config.JWT_SECRET, 
                { subject: testUsers[0].email, algorithm: 'HS256' }
            )

            return supertest(app)
                .patch('/api/users/own')
                .set('Authorization', `bearer ${jwtToken}`)
                .send({
                    supermarket_id: 1
                })
                .expect(200)
                .expect(res => 
                    db
                        .from('shopily_users')
                        .select('*')
                        .where({ id: 1 })
                        .first()
                        .then(row => {
                            expect(row.supermarket_id).to.eql(1)
                        })
                )
        })
    })
})