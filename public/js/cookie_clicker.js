var num_grandmas = parseInt(document.getElementById("grandmas").innerHTML.split(' ')[2]);
console.log('Number of grandmas: ' + num_grandmas.toString());

function doGet() {
    $.ajax({
        url:"cookie_writer",
        type: "get",
        data: $('').serialize(),
        success: function(response) {
            r = document.getElementById("table");
            console.log("success");
            console.log(response);
            r.innerHTML = 'Cookies: ' + response;
        },
        error: function(stat, err) {
            r = document.getElementById("table");
            r.innerHTML = 'something went wrong with the cookie!';
        }
    });
}

function buy_grandma() {
    $.ajax({
        url:"grandma_clicker",
        type: "get",
        data: $('').serialize(),
        success: function(response) {
            console.log("success");
            console.log(response);
            if (num_grandmas < response.grandma_count) {
                r = document.getElementById("table");
                g = document.getElementById("grandmas");
                r.innerHTML = 'Cookies: ' + response.cookie_count;
                g.innerHTML = 'You have ' + response.grandma_count + ' grandmas';
                num_grandmas = parseInt(response.grandma_count);
            }
            else {
                r = document.getElementById("table");
                r.innerHTML = 'Not enough cookies to buy grandma';
            }
        },
        error: function(stat, err) {
            r = document.getElementById("table");
            r.innerHTML = 'Grandma is busy';
        }
    });
}

function reset() {
    $.ajax({
        url:"reset_clicker",
        type: "get",
        data: $('').serialize(),
        success: function(response) {
            s = document.getElementById("table");
            g = document.getElementById("grandmas");
            console.log("success");
            console.log(response);
            s.innerHTML = 'Cookies: ' + response.cookie_count;
            g.innerHTML = 'You have ' + response.grandma_count + ' grandmas';
            num_grandmas = 0;
        },
        error: function(stat, err) {
            r = document.getElementById("table");
            r.innerHTML = 'something went wrong with the cookie!';
        }
    });
}

function save() {
    $.ajax({
        url:"scoreboard_writer",
        type: "get",
        data: $('').serialize(),
        success: function(response) {
            s_element = document.getElementById("scoreboard");
            console.log("success");
            console.log(response);
            console.log(response.s_array);
            s_element.innerHTML = response.s_array.join("\n");
        },
        error: function(stat, err) {
            s = document.getElementById("scoreboard");
            s.innerHTML = 'something went wrong with the cookie!';
        }
    });
}
