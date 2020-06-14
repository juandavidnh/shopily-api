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

    describe(`GET /api/shopping-list/:userId`, () => {
        beforeEach('insert shopping list items', () =>
            helpers.seedTables(
                db,
                testSupermarkets,
                testUsers,
                testItemList,
                testShoppingList
            )
        )

        it('gets all shopping list items from user with userId', () => {
            const expectedShoppingList = [
                {
                    "code": "MEGA0001",
                    "product_name": "Sausages",
                    "aisle": 2,
                    "supermarket_id": 1,
                    "date_created": "2020-04-18T18:57:54.111Z"
                },
                {
                    "code": "MEGA0002",
                    "product_name": "Fruit Loops",
                    "aisle": 10,
                    "supermarket_id": 1,
                    "date_created": "2020-04-18T18:57:54.111Z"
                },
                {
                    "code": "MEGA0003",
                    "product_name": "Whiskas",
                    "aisle": 5,
                    "supermarket_id": 1,
                    "date_created": "2020-04-18T18:57:54.111Z"
                },
                {
                    "code": "MEGA0005",
                    "product_name": "Apples",
                    "aisle": 4,
                    "supermarket_id": 1,
                    "date_created": "2020-04-18T18:57:54.111Z"
                },
                {
                    "code": "MEGA0006",
                    "product_name": "Ham",
                    "aisle": 2,
                    "supermarket_id": 1,
                    "date_created": "2020-04-18T18:57:54.111Z"
                }
            ]

            const jwtToken = jwt.sign(
                { user_id: testUsers.indexOf(testUsers[0])+1 }, 
                config.JWT_SECRET, 
                { subject: testUsers[0].email, algorithm: 'HS256' }
            )

            return supertest(app)
                .get('/api/shopping-list/1')
                .set('Authorization', `bearer ${jwtToken}`)
                .expect(200)
                .expect(res => {
                    for(let i=0; i<res.body.length; i++) {
                        expect(res.body[i]).to.have.property('id')
                        expect(res.body[i].product_name).to.eql(expectedShoppingList[i].product_name)
                        expect(res.body[i].code).to.eql(expectedShoppingList[i].code)
                    }
                })
        })
    })

    describe(`POST /api/shopping-list/1`, () => {
        beforeEach('insert shopping list items', () =>
            helpers.seedTables(
                db,
                testSupermarkets,
                testUsers,
                testItemList,
                testShoppingList
            )
        )

        it('insert new item to shopping list', () => {
            const newItem = {
                item_id: 8
            }

            const jwtToken = jwt.sign(
                { user_id: testUsers.indexOf(testUsers[0]) + 1},
                config.JWT_SECRET,
                { subject: testUsers[0].email, algorithm: 'HS256' }
            )

            return supertest(app)
                .post('/api/shopping-list/1')
                .set('Authorization', `bearer ${jwtToken}`)
                .send(newItem)
                .expect(201)
                .expect(res => {
                    expect(res.body.product_name).to.eql(testItemList[7].product_name)
                })
        })
    })

    describe(`PATCH /api/shopping-list/:userId/:itemId`, () => {
        beforeEach('insert shopping list items', () =>
            helpers.seedTables(
                db,
                testSupermarkets,
                testUsers,
                testItemList,
                testShoppingList
            )
        )

        it('change item status', () => {
            const change = {
                status: 'complete'
            }

            const jwtToken = jwt.sign(
                { user_id: testUsers.indexOf(testUsers[0])+1 }, 
                config.JWT_SECRET, 
                { subject: testUsers[0].email, algorithm: 'HS256' }
            )

            return supertest(app)
                .patch('/api/shopping-list/1/1')
                .set('Authorization', `bearer ${jwtToken}`)
                .send(change)
                .expect(200)
                .expect(res => 
                    db
                        .from('shopily_shopping_list')
                        .select('*')
                        .where({ user_id: 1, item_id: 1 })
                        .first()
                        .then(row => {
                            expect(row.status).to.eql('complete')
                        })
                )
        })
    })

    describe(`DELETE /api/shopping-list/:userId/:itemId`, () => {
        beforeEach('insert shopping list items', () =>
            helpers.seedTables(
                db,
                testSupermarkets,
                testUsers,
                testItemList,
                testShoppingList
            )
        )

        it('deletes task and returns 200 status', () => {
            const expectedShoppingList = [
                {
                    "code": "MEGA0002",
                    "product_name": "Fruit Loops",
                    "aisle": 10,
                    "supermarket_id": 1,
                    "date_created": "2020-04-18T18:57:54.111Z"
                },
                {
                    "code": "MEGA0003",
                    "product_name": "Whiskas",
                    "aisle": 5,
                    "supermarket_id": 1,
                    "date_created": "2020-04-18T18:57:54.111Z"
                },
                {
                    "code": "MEGA0005",
                    "product_name": "Apples",
                    "aisle": 4,
                    "supermarket_id": 1,
                    "date_created": "2020-04-18T18:57:54.111Z"
                },
                {
                    "code": "MEGA0006",
                    "product_name": "Ham",
                    "aisle": 2,
                    "supermarket_id": 1,
                    "date_created": "2020-04-18T18:57:54.111Z"
                }
            ]

            const jwtToken = jwt.sign(
                { user_id: testUsers.indexOf(testUsers[0])+1 }, 
                config.JWT_SECRET, 
                { subject: testUsers[0].email, algorithm: 'HS256' }
            )

            return supertest(app)
                .delete('/api/shopping-list/1/1')
                .set('Authorization', `bearer ${jwtToken}`)
                .expect(200)
                .expect(res =>{
                    supertest(app)
                    .get('/api/shopping-list/1')
                    .set('Authorization', `bearer ${jwtToken}`)
                    .expect(200)
                    .expect(res => {
                        for(let i=0; i<res.body.length; i++) {
                            expect(res.body[i]).to.have.property('id')
                            expect(res.body[i].product_name).to.eql(expectedShoppingList[i].product_name)
                            expect(res.body[i].code).to.eql(expectedShoppingList[i].code)
                        }
                    })
                })   
        })
    })
})