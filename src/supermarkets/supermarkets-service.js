const xss = require('xss')

const SupermarketsService = {
    getAllSupermarkets(db) {
        return db.select('*').from('shopily_supermarkets')
    },

    insertSupermarket(db, newSupermarket) {
        return db
            .insert(newSupermarket)
            .into('shopily_supermarkets')
            .returning('*')
            .then(([supermarket]) => supermarket)
    },

    getById(db, supermarketId) {
        return db   
            .from('shopily_supermarkets')
            .select('*')
            .where('id', supermarketId)
            .first()
    },

    supermarketExists(db, supermarketName) {
        return db('shopily_supermarkets')
            .where({ supermarket_name: supermarketName })
            .first()
            .then(supermarket => !!supermarket)
    },

    updateSupermarket(db, supermarketId, updatedSupermarket) {
        return db
            .from('shopily_supermarkets')
            .where({id: supermarketId})
            .update(updatedSupermarket)
    },

    serializeSupermarket(supermarket) {
        return{
            id: supermarket.id,
            supermarket_name: xss(supermarket.supermarket_name),
            supermarket_city: xss(supermarket.supermarket_city),
            date_created: new Date(supermarket.date_created)
        }
    },
}

module.exports = SupermarketsService