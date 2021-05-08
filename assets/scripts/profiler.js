var table = document.createElement("div");
var content = document.getElementById('profiler').dataset.value;
table.innerHTML = content;
document.body.appendChild(table);     