const Mysql = require('mysql');
const executeQuery = require('../../system/database');

class Category {
    async fetchAll(){
        const query = `SELECT id, name FROM categories`;
        try{
			let get_categories_query = Mysql.format(query);
			return await executeQuery(get_categories_query);
		} catch(err){
            return err;
		}
    }
}

module.exports = new Category();