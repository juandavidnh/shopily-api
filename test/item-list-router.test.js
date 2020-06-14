const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const jwt = require('jsonwebtoken') 
const config = require('../src/config')
const supertest = require('supertest')
const { expect } = require('chai')

describe('Item list endpoints', () => {
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

    describe(`GET /api/item-list`, () => {
        beforeEach('insert items', () =>
            helpers.seedTables(
                db,
                testSupermarkets,
                testUsers,
                testItemList,
                testShoppingList
            )
        )

        it('gets all items', () => {
            const expectedItems = testItemList

            const jwtToken = jwt.sign(
                { user_id: testUsers.indexOf(testUsers[0]) + 1},
                config.JWT_SECRET,
                { subject: testUsers[0].email, algorithm: 'HS256' }
            )

            return supertest(app)
                .get('/api/item-list')
                .set('Authorization', `bearer ${jwtToken}`)
                .expect(200)
                .expect(res => {
                    for(let i=0; i<res.body.length; i++){
                        expect(res.body[i]).to.have.property('id')
                        expect(res.body[i].code).to.eql(expectedItems[i].code)
                    }
                })                           
        })

        it('gets a specific item', () => {
            const expectedItem = testItemList[0]

            const jwtToken = jwt.sign(
                { user_id: testUsers.indexOf(testUsers[0]) + 1},
                config.JWT_SECRET,
                { subject: testUsers[0].email, algorithm: 'HS256' }
            )

            return supertest(app)
                .get('/api/item-list/1')
                .set('Authorization', `bearer ${jwtToken}`)
                .expect(res => {
                    expect(res.body).to.have.property('id')
                    expect(res.body.code).to.eql(expectedItem.code)
                })
        })
    })

    describe(`POST /api/item-list`, () => {
        beforeEach('insert items', () =>
            helpers.seedTables(
                db,
                testSupermarkets,
                testUsers,
                testItemList,
                testShoppingList
            )
        )

        it('adds new item', () => {
            const newItem = {
                code: "MEGA1101",
                product_name: "Pineapple",
                aisle: 6,
                supermarket_id: 1,
            }

            const jwtToken = jwt.sign(
                { user_id: testUsers.indexOf(testUsers[0]) + 1},
                config.JWT_SECRET,
                { subject: testUsers[0].email, algorithm: 'HS256' }
            )

            return supertest(app)
                .post('/api/item-list')
                .set('Authorization', `bearer ${jwtToken}`)
                .send(newItem)
                .expect(201)
                .expect(res => {
                    expect(res.body.code).to.eql(newItem.code)
                    expect(res.body.product_name).to.eql(newItem.product_name)
                    expect(res.body.aisle).to.eql(newItem.aisle)
                    expect(res.body.supermarket_id).to.eql(newItem.supermarket_id)
                })
        })
    }),

    describe(`PATCH /api/item-list`, () => {
        beforeEach('insert items', () =>
            helpers.seedTables(
                db,
                testSupermarkets,
                testUsers,
                testItemList,
                testShoppingList
            )
        )

        it('edits specific item', () => {
            const jwtToken = jwt.sign(
                { user_id: testUsers.indexOf(testUsers[0])+1 }, 
                config.JWT_SECRET, 
                { subject: testUsers[0].email, algorithm: 'HS256' }
            )

            return supertest(app)
                .patch('/api/item-list/1')
                .set('Authorization', `bearer ${jwtToken}`)
                .send({
                    product_name: 'Zucaritas'
                })
                .expect(200)
                .expect(res => 
                    db
                        .from('shopily_item_list')
                        .select('*')
                        .where({ id: 1 })
                        .first()
                        .then(row => {
                            expect(row.product_name).to.eql('Zucaritas')
                        })
                )
        })
    })
})