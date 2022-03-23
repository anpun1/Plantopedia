document.getElementById('submit-btn').addEventListener('click', (event) => {
    console.log('called');
    event.preventDefault();
    const xhr = new XMLHttpRequest();
    var formData = new FormData();
    var file = document.getElementById('myFile').files[0];
    formData.append("thefile", file);
    const isFlower = document.getElementById('flowerRadio').checked;

    formData.append('organs', isFlower ? 'flower' : 'leaf');
    const BASE_URL = '/uploadimage';
    xhr.open('POST', BASE_URL);
    const plantid = document.getElementById('plantid');
    plantid.innerText = 'Loading...';

    // We check that get request was successful
    xhr.addEventListener('load', (loadEvent) => {
        if (xhr.status >= 200 && xhr.status < 400) {
            var my_obj = JSON.parse(xhr.response);
            const results = my_obj.results;
            console.log(results[0].score);
            // This is my div
            
            console.log(my_obj);
            var table = document.createElement("table");
            table.style.border = "1px solid #000";
            var tr = document.createElement("tr");
            var h1 = document.createElement("th");
            tr.appendChild(h1);
            h1.textContent = "Score";
            var h2 = document.createElement("th");
            h2.textContent = "Common Names";
            tr.appendChild(h2);
            var h3 = document.createElement("th");
            h3.textContent = "Family";
            tr.appendChild(h3);
            var h4 = document.createElement("th");
            h4.textContent = "Genus";
            tr.appendChild(h4);
            const csvRows = [["Score", "Common Names", "Family", "Genus"]]

            table.appendChild(tr)

            for (const row of results) {
                const tr = document.createElement("tr");
                console.log(row);
                const values = [`${Math.round(row.score * 100)}%` + '', row.species.commonNames.join(', '), row.species.family.scientificName, row.species.genus.scientificName];
                csvRows.push(values);
                for (const column of values) {
                    const td = document.createElement('td');
                    td.textContent = column;
                    tr.appendChild(td);
                }
                table.appendChild(tr);
            }
            console.log(table);
            plantid.innerHTML = '';
            plantid.appendChild(table);
            var btn = document.createElement('button');
            btn.innerHTML ="Download Results";
            plantid.appendChild(btn);
            btn.addEventListener("click", function() {
                const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
                var encodedUri = encodeURI(csvContent);
                var link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "NatureID_data.csv");
                document.body.appendChild(link); // Required for FF
                
                link.click(); // This will download the data file named "my_data.csv".
            });
         } else {
            document.getElementById('plantid').textContent = 'Error with network request';
        }

    });

    xhr.send(formData);
});

