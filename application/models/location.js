const Mysql = require('mysql');
const executeQuery = require('../../system/database');

class Location {
    async fetchAll(){
        const query = `SELECT id, name FROM locations`;
        try{
			let get_categories_query = Mysql.format(query);
			return await executeQuery(get_categories_query);
		} catch(err){
            return err;
		}
    }
}

module.exports = new Location();