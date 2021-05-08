class Profiler {
    constructor(session, posts) {
        this.session = session;
        this.posts = posts;
        this.database = {};
    }
    addDatabaseCall(db_queries, db_values) {
        this.database[db_queries] = db_values;
    }
    getCompiledHTML() {
        return this.renderSession() + this.renderPosts() + this.renderDatabase();
    }
    renderSession() {
        return this.renderHTML("SESSION DATA", this.session);
    }
    renderPosts() {
        return this.renderHTML("POST DATA", this.posts);
    }
    renderDatabase() {
        return this.renderHTML("DATABASE", this.database);
    }
    renderHTML(title, data) {
        let output = `<fieldset id="ci_profiler_post" style="width:80%; border:1px solid #009900;padding:6px 10px 10px 10px;margin:10px auto;background-color:#eee;">
                        <legend style="color:#009900;">${title}</legend>
                        <table style="width:100%;">
                            <tbody>`;
        for (const [key, value] of Object.entries(data)) {
            output+=`<tr>
                        <td style="width:50%;padding:5px;color:#000;background-color:#ddd;">${key}</td>
                        <td style="width:50%;padding:5px;color:#009900;font-weight:normal;background-color:#ddd;">${JSON.stringify(value)}</td>
                    </tr>`;
        }
        output+=`</tbody></table></fieldset>`;
        return output;
    }
}
module.exports = Profiler;