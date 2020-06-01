const xss = require('xss')

const ItemListService = {
    getAllItems(db) {
        return db.select('*').from('shopily_item_list')
    },

    insertSupermarket(db, newItem) {
        return db
            .insert(newItem)
            .into('shopily_item_list')
            .returning('*')
            .then(([item]) => item)
    },

    getById(db, itemId) {
        return db   
            .from('shopily_item_list')
            .select('*')
            .where('id', itemId)
            .first()
    },

    itemExists(db, productName) {
        return db('shopily_item_list')
            .where({ product_name: productName })
            .first()
            .then(product => !!product)
    },

    updateItem(db, itemId, updatedItem) {
        return db
            .from('shopily_item_list')
            .where({id: itemId})
            .update(updatedItem)
    },

    serializeItem(item) {
        return{
            id: item.id,
            product_name: xss(item.product_name),
            code: xss(item.code),
            aisle: item.aisle,
            supermarket_id: item.supermarket_id,
            date_created: new Date(supermarket.date_created)
        }
    },
}

module.exports = ItemListService