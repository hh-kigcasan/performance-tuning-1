const Mysql = require('mysql');
const STATUS = require("../config/constants").STATUS;
const LIMIT_SIZE = require("../config/constants").LIMIT_SIZE;
const executeQuery = require('../../system/database');
class Item {
    constructor() {
        this.offset = 0;
    }
    
    async fetchAll(filters = {}){
        let query = `SELECT SUM(order_history_items.qty) AS total_sold, items.name, items.price, items.image_url
                        FROM items
                        LEFT JOIN order_history_items ON order_history_items.item_id = items.id
                        LEFT JOIN order_history ON order_history.id=order_history_items.order_history_id AND status = ? 
                        WHERE items.is_active = 1 `;
        
        let params = [STATUS.DELIVERED];
       
        if(filters != {}){
           let {filtered_query, filter_params} = this.addClauses(filters, query, params);
           [query, params] = [filtered_query, filter_params];
        }
        
        //item sort
        query+=`GROUP BY items.price ${filters.sort} `;
        //page offset
        query+=`LIMIT ?, ${LIMIT_SIZE}`;
        params.push(this.offset);

        try{
			let get_items_query = Mysql.format(query, params);
			return await executeQuery(get_items_query);
		} catch(err){
            return err;
		}
    }

    async nextItems(filters){
        let old_offset = this.offset;
        this.offset += 10;
        let result = await this.fetchAll(filters);
        if(!result || result.length == 0){
            this.offset = old_offset;
            return "";
        }
        return result;
    }

    async prevItems(filters){
        this.offset -= 10;
        if(this.offset >= 0){
            return await this.fetchAll(filters);
        }
        this.offset = 0;
        return "";
    }

    addClauses(filters, query, params){
        let filtered_query = query;
        let filter_params = params;
        //item name
        if(filters.item){
            filtered_query+="AND items.name LIKE '%?%' ";
            filter_params.push(filters.item);
        }
        //item price
        const has_min_max = filters.min && filters.max;
        if(filters.min){
            filtered_query+=`AND ${has_min_max?"(":""} items.price >= ? `;
            filter_params.push(filters.min);
        }
        if(filters.max){
            filtered_query+=`${has_min_max?"AND":"OR"} items.price <= ? ${has_min_max?")":""} `;
            filter_params.push(filters.max);
        }
        //item category
        if(filters.category && filters.category != 0){
            filtered_query+="AND items.category_id = ? ";
            filter_params.push(filters.category);
        }
        //item locations
        if(filters.locations){            
            filtered_query+=`AND items.location_id IN (${Array(filters.locations.length).fill('?').join()}) `;
            filter_params = filter_params.concat(Array.from(filters.locations, Number));
        }
        
        return {filtered_query, filter_params};
    }
}

module.exports = new Item();