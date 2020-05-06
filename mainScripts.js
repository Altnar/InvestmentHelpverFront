let serverAdr = "http://localhost:8090/"
let isAutorise = false
let user = ""
let table = document.querySelector('table');
let searchButton = document.querySelector('.searhButton');
let seachLine = document.querySelector('.searchLine');
let autoButton = document.getElementById("autoButton")
let autoLine = document.getElementById("autoLine")
let autoName = document.getElementById("Authorization")
searchButton.onclick = function() {

    table.classList.add('newsList');
    table.classList.remove('newsListHidden');

    let symbolName = seachLine.value
    table.innerHTML = getNews(symbolName)
    drawChart(symbolName)
    if (isAutorise){
        sendHistory(symbolName, user)
    }
}

autoButton.onclick = function() {
    let userName = autoLine.value
    if (userName.length > 1) {
        autoName.innerText = "User: " + userName
    }
    autoButton.style = "visibility:hidden"
    autoLine.style = "visibility:hidden"
    user = userName
    isAutorise = true
}

function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function sendHistory(symbolName, userName) {
    httpGet(serverAdr + symbolName + ";" + userName + ";writeDB")
}
function getNews(symbolName) {
    let table = document.querySelector('table');
    let jsn = httpGet(serverAdr + symbolName + ";_;news")
    let pjsn = JSON.parse(jsn)
    let htmltext = ""

    for (var i = 0; i < pjsn.length; i++) {
        htmltext = htmltext + "<tr><td>" + Object.entries(pjsn[i])[0][1] + "</td><td><a href=" + Object.entries(pjsn[i])[1][1]+ "> LINK </a></td></tr>"
    }
    return htmltext
}

function drawChart(symbolName) {
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);

    let jsn = httpGet(serverAdr + symbolName + ";_;plot")
    let pjsn = JSON.parse(jsn)
    let plotData = [['Date', 'Price']];
    for (var i = 0; i < pjsn.length; i++) {
        plotData.push([Object.entries(pjsn[i])[0][1].slice(0,10), Object.entries(pjsn[i])[4][1]])
    }
    function drawChart() {
        var data = google.visualization.arrayToDataTable(plotData);

        var options = {
            colors: ['#D9A036', '#F2E750', '#8C6723', '#403014'],
            curveType: 'function',
            backgroundColor: '#0D0D0D',
            vAxis: {
                textStyle:{color: '#FFF'},
                gridlines: {
                    color: 'transparent'
                }
            },
            hAxis: {
                textStyle:{color: '#FFF'},
                gridlines: {
                    color: 'transparent'
                }
            },
            legend: {position: 'none'},
            chartArea:{left:250},
        };

        var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

        chart.draw(data, options);
    }
}