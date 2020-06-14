const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const jwt = require('jsonwebtoken') 
const config = require('../src/config')
const supertest = require('supertest')
const { expect } = require('chai')

describe('Supermarket endpoints', () => {
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

    describe(`GET /api/supermarkets`, () => {
        beforeEach('insert supermarkets', () =>
            helpers.seedTables(
                db,
                testSupermarkets,
                testUsers,
                testItemList,
                testShoppingList
            )
        )

        it('gets all supermarkets', () => {
            const expectedSupermarkets = testSupermarkets

            return supertest(app)
                .get('/api/supermarkets')
                .expect(200)
                .expect(res => {
                    for(let i=0; i<res.body.length; i++){
                        expect(res.body[i]).to.have.property('id')
                        expect(res.body[i].supermarket_name).to.eql(expectedSupermarkets[i].supermarket_name)
                    }
                })                           
        })

        it('gets a specific supermarket', () => {
            const expectedSupermarket = testSupermarkets[0]

            const jwtToken = jwt.sign(
                { user_id: testUsers.indexOf(testUsers[0]) + 1},
                config.JWT_SECRET,
                { subject: testUsers[0].email, algorithm: 'HS256' }
            )

            return supertest(app)
                .get('/api/supermarkets/1')
                .set('Authorization', `bearer ${jwtToken}`)
                .expect(res => {
                    expect(res.body).to.have.property('id')
                    expect(res.body.supermarket_name).to.eql(expectedSupermarket.supermarket_name)
                })
        })
    })

    describe(`POST /api/supermarkets`, () => {
        beforeEach('insert supermarkets', () =>
            helpers.seedTables(
                db,
                testSupermarkets,
                testUsers,
                testItemList,
                testShoppingList
            )
        )

        it('adds new supermarket', () => {
            const newSupermarket = {
                supermarket_name: "Supermaxi (El Jardin)",
                supermarket_city: "Ambato"
            }

            return supertest(app)
                .post('/api/supermarkets')
                .send(newSupermarket)
                .expect(201)
                .expect(res => {
                    expect(res.body.supermarket_name).to.eql(newSupermarket.supermarket_name)
                    expect(res.body.supermarket_city).to.eql(newSupermarket.supermarket_city)
                })
        })
    }),

    describe(`PATCH /api/supermarkets`, () => {
        beforeEach('insert supermarkets', () =>
            helpers.seedTables(
                db,
                testSupermarkets,
                testUsers,
                testItemList,
                testShoppingList
            )
        )

        it('edits supermarket', () => {
            const jwtToken = jwt.sign(
                { user_id: testUsers.indexOf(testUsers[0])+1 }, 
                config.JWT_SECRET, 
                { subject: testUsers[0].email, algorithm: 'HS256' }
            )

            return supertest(app)
                .patch('/api/supermarkets/1')
                .set('Authorization', `bearer ${jwtToken}`)
                .send({
                    supermarket_city: 'Ambato'
                })
                .expect(200)
                .expect(res => 
                    db
                        .from('shopily_supermarkets')
                        .select('*')
                        .where({ id: 1 })
                        .first()
                        .then(row => {
                            expect(row.supermarket_city).to.eql('Ambato')
                        })
                )
        })
    })
})