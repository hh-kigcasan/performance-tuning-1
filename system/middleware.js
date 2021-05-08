const Profiler = require('./profiler');
class Middleware {
    load(req, res, next){
        if(req.app.locals.enable_profiler){
            res.locals.profiler = new Profiler(req.session, req.body);
        }
        res.view = function(name, respond){
            res.locals.page_name = name;
            respond();
        };
        res.debug = function(respond){
            res.locals.page_name = "default";
            respond();
        };
        res.setOutput = function(output){
            res.locals.output = output;
        }; 
        res.setValidation = function(err){
            res.locals.validation = err;
        };  
        res.recordSQLProfile = function(query, values){
            if(res.locals.profiler) {
                res.locals.profiler.addDatabaseCall(query, values);
            }
        }
        next();  
    }
    send(req, res){
        let profiler_html = "";
        if(res.locals.profiler){
            profiler_html = res.locals.profiler.getCompiledHTML();
        }
        let json = { 
            current_user: req.session.current_user, 
            output: res.locals.output,
            profiler: profiler_html,
            validation: res.locals.validation
        };
        res.render(res.locals.page_name, json);
    }
} 
module.exports = new Middleware();