const CategoryModel = require('../models/category');
const LocationModel = require('../models/location');
const ItemModel = require('../models/item');

class Merchandise {
    async index(req, res){
        let categories = await CategoryModel.fetchAll();
        let locations = await LocationModel.fetchAll();
        res.render('index', {"categories": categories, "locations": locations});
    }

    async displayItems(req, res){         
        let items = "";  
        if(req.body.pagination == "next"){
            items = await ItemModel.nextItems(req.body);
        } else if(req.body.pagination == "prev"){
            items = await ItemModel.prevItems(req.body);
        } else{
            items = await ItemModel.fetchAll(req.body);
        }
        res.render('./partials/items', {"items": items});
    }
}
module.exports = new Merchandise();