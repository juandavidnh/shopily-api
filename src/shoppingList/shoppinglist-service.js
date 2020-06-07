
const ItemListService = {
    getShoppingList(db, userId) {
        return db('shopily_shopping_list as s')
            .join('shopily_users as u', 'u.id', 's.user_id')
            .join('shopily_item_list as i', 'i.id', 's.item_id')
            .select('*')
            .where({user_id: userId})
    },

    insertItem(db, userId, itemId) {
        return db
            .insert({
                user_id: userId,
                item_id: itemId
            })
            .into('shopily_shopping_list')
            .returning('*')
            .then(([newItem]) => newItem)
    },

    getItem(db, productCode) {
        return db   
            .from('shopily_item_list')
            .select('*')
            .where('code', productCode)
            .first()
    },

    getUser(db, userEmail) {
        return db
            .from('shopily_users')
            .select('*')
            .where('email', userEmail)
            .first()
    },

    deleteItem(db, userId, itemId) {
        return db
            .from('shopily_shopping_list')
            .where({user_id: userId,
                    item_id: itemId})
            .delete()
    },

    itemExists(db, userId, itemId) {
        return db('shopily_shopping_list')
            .where({ user_id: userId,
                    item_id: itemId })
            .first()
            .then(product => !!product)
    },

    changeStatus(db, userId, itemId, updatedItem) {
        return db
            .from('shopily_shopping_list')
            .where({
                user_id: userId,
                item_id: itemId 
            })
            .update(updatedItem)
            .returning('*')
            .then(([item]) => item)
    }
}

module.exports = ItemListService