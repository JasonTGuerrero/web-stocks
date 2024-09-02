document.addEventListener("DOMContentLoaded", function () {
	// Add event listener for Enter key in the stockSymbolInput
	var stockSymbolInput = document.getElementById("stockSymbolInput");
	stockSymbolInput.addEventListener("keydown", function (event) {
		if (event.key === "Enter") {
			// If Enter is pressed, trigger the search
			searchStock();
		}
	});
});

window.addEventListener('beforeunload', function(event) {
    // Clear the search bar input field
    document.getElementById("stockSymbolInput").value = "";
});

function writeCompanyProfileData(data) {
	var companyContentDisplay = document.getElementById("company");
	var companyLogo = data["logo"];
	var tableData = {
		"Company Name": data["name"],
		"Stock Ticker Symbol": data["ticker"],
		"Stock Exchange Code": data["exchange"],
		"Company IPO Date": data["ipo"],
		Category: data["finnhubIndustry"],
	};
	var companyProfile = `<div id='companyProfile'>`;
	companyProfile += `<img class='companyLogo' src='${companyLogo}'>`;
	companyProfile += `<table id='companyProfileTable'>`;
	companyProfile += `<tr><th>Company Name</th><td>${tableData["Company Name"]}</td></tr>`;
	companyProfile += `<tr><th>Stock Ticker Symbol</th><td>${tableData["Stock Ticker Symbol"]}</td></tr>`;
	companyProfile += `<tr><th>Stock Exchange Code</th><td>${tableData["Stock Exchange Code"]}</td></tr>`;
	companyProfile += `<tr><th>Company Start Date</th><td>${tableData["Company IPO Date"]}</td></tr>`;
	companyProfile += `<tr><th>Category</th><td>${tableData["Category"]}</td></tr>`;
	companyProfile += `</table>`;
	companyProfile += `</div>`;

	companyContentDisplay.innerHTML = companyProfile;
}

function formatUnixTimestamp(timestamp) {
	const months = [
		"January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
	];
	const dateObject = new Date(timestamp * 1000);
	const day = dateObject.getDate();
	const month = months[dateObject.getMonth()];
	const year = dateObject.getFullYear();
	
	const formattedDate = `${day} ${month}, ${year}`;
	return formattedDate;
}

function writeStockSummaryData(QuoteData, TrendsData, tickerSymbol) {
	var stockSummaryDisplay = document.getElementById("stockSummary");
	var tableData = {
		"Stock Ticker Symbol": tickerSymbol,
        "Trading Day" : QuoteData["t"],
        "Previous Closing Price" : QuoteData["pc"],
        "Opening Price" : QuoteData["o"],
        "High Price" : QuoteData["h"],
        "Low Price" : QuoteData["l"],
        "Change" : QuoteData["d"],
        "Change Percent" : QuoteData["dp"]
	};
	tableData["Trading Day"] = formatUnixTimestamp(tableData["Trading Day"]);
    var upArrow = "/static/images/GreenArrowUp.png";
    var downArrow = "/static/images/RedArrowDown.png";
    var arrow = "";
    if (tableData["Change"] > 0) {
        arrow = upArrow;
    } else if (tableData["Change"] < 0) {
        arrow = downArrow;
    }
    var stockSummary = `<div id='stockSummaryContent'>`;
	stockSummary += `<table id='stockSummaryTable'>`;
	stockSummary += `<tr><th>Stock Ticker Symbol</th><td>${tableData["Stock Ticker Symbol"].toUpperCase()}</td></tr>`;
	stockSummary += `<tr><th>Trading Day</th><td>${tableData["Trading Day"]}</td></tr>`;
	stockSummary += `<tr><th>Previous Closing Price</th><td>${tableData["Previous Closing Price"]}</td></tr>`;
	stockSummary += `<tr><th>Opening Price</th><td>${tableData["Opening Price"]}</td></tr>`;
	stockSummary += `<tr><th>High Price</th><td>${tableData["High Price"]}</td></tr>`;
    stockSummary += `<tr><th>Low Price</th><td>${tableData["Low Price"]}</td></tr>`;
    stockSummary += `<tr><th>Change</th><td>${tableData["Change"]}<img src='${arrow}' id="arrow"></td></tr>`;
    stockSummary += `<tr><th>Change Percent</th><td>${tableData["Change Percent"]}<img src='${arrow}' id="arrow"></td></tr>`;
	stockSummary += `</table>`;
	stockSummary += `</div>`;

	var trendData = TrendsData[0];
	stockSummary += `<div class="trend-container">`
	stockSummary += `<div class="recommendation-graph">`;
	stockSummary += `<div class="sell-label">Strong Sell</div>`
	stockSummary += `<div class="recommendation-cell strong-sell">${trendData["strongSell"]}</div>`;
	stockSummary += `<div class="recommendation-cell sell">${trendData["sell"]}</div>`;
	stockSummary += `<div class="recommendation-cell hold">${trendData["hold"]}</div>`
	stockSummary += `<div class="recommendation-cell buy">${trendData["buy"]}</div>`;
	stockSummary += `<div class="recommendation-cell strong-buy">${trendData["strongBuy"]}</div>`;
	stockSummary += `<div class="buy-label">Strong Buy</div>`
	stockSummary += `</div>`;
	stockSummary += `</div>`;
	stockSummary += `<div class="trend-label">Recommendation Trends</div>`

    stockSummaryDisplay.style.display = "none";
    stockSummaryDisplay.innerHTML = stockSummary;
}

function writeCompanyNewsData(data) {
	var latestNewsDisplay = document.getElementById("latestNews");
	var filteredNews = data.filter(obj => {
		const emptyKeys = ["image", "datetime", "url", "headline"];
		return !emptyKeys.some(key => obj[key] === '' || obj[key] === null || obj[key] === undefined);
	});
	filteredNews = filteredNews.slice(0, 5);
	filteredNews.forEach(story => {
		story["datetime"] = formatUnixTimestamp(story["datetime"]);
	});
	var latestNews = "";
	filteredNews.forEach(story => {
		latestNews += `<div class='news-div'>`;
		latestNews += `<img class='news-image' alt='urlImage' src='${story["image"]}'/>`;
		latestNews += `<div class='news-text'>`;
		latestNews += `<p class='news-headline'>${story["headline"]}</p>`;
		latestNews += `<p>${story["datetime"]}</p>`;
		latestNews += `<a href='${story["url"]}' target="_blank">See Original Post</a>`;
		latestNews += `</div>`;
		latestNews += `</div>`;
	});
	latestNewsDisplay.style.display = "none";
	latestNewsDisplay.innerHTML = latestNews;
}

function writeChartsData(data) {
    var volumes = [];
    var prices = [];
	const today = new Date();
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, '0');
	const day = String(today.getDate()).padStart(2, '0');
	const formattedDate = `${year}-${month}-${day}`;
    const results = data["results"];
    const ticker = data["ticker"]
    const chartTitle = `Stock Price ${ticker} ${formattedDate}`;
    const chartSubtitle = '<a id="charts-subtitle" href="https://polygon.io/" target="_blank">Source: Polygon.io</a>';
    results.forEach((result) => {
        prices.push([result["t"], result["c"]]);
        volumes.push([result["t"], result["v"]]);
    });

	const minPrice = Math.min(...prices.map(price => price[1]));
	const maxVolume = Math.max(...volumes.map(volume => volume[1]));

    Highcharts.stockChart('charts-region', {
        plotOptions: {
            column: {
                pointWidth: 6,
                color: '#000000',
				pointPadding: 0.1,
            	groupPadding: 0.1,
            }
        },
        title: {
			text: chartTitle,
			style: {
				marginBottom: '20px'
			}
		},
        subtitle: {
            text: chartSubtitle,
            useHTML: true,
			marginTop: 100
        },
        xAxis: {
            type: 'datetime',
            labels: {
                format: '{value: %e %b}'
            },
        },
        yAxis: [{
			title: { text: 'Stock Price' },
            opposite: false,
			offset: 10
        }, {
            title: { text: 'Volume' },
            opposite: true,
			max: 2 * maxVolume,
			offset: 10
        }],
        rangeSelector: {
			inputEnabled: false,
            buttons: [{
                type: 'day',
                count: 7,
                text: '7d'
            }, {
                type: 'day',
                count: 15,
                text: '15d'
            }, {
                type: 'month',
                count: 1,
                text: '1m'
            }, {
                type: 'month',
                count: 3,
                text: '3m'
            }, {
                type: 'month',
                count: 6,
                text: '6m'
            }],
            selected: 4,
        },
        series: [{
            name: 'Stock Price',
			type: 'area',
            data: prices,
			gapSize: 5,
            yAxis: 0,
			tooltip: {
				valueDecimals: 2
			},
			fillColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, Highcharts.getOptions().colors[0]],
                    [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                ]
            },
            threshold: null
          }, {
            name: 'Volume',
			type: 'column',
            data: volumes,
            yAxis: 1
          }],
		  responsive: {
            rules: [{
                condition: {
                    maxWidth: 800
                },
                chartOptions: {
                    rangeSelector: {
                        inputEnabled: false
                    }
                }
            }]
        }
    });
	
}


// Event listener for search button click
document.getElementById("searchButton").addEventListener("click", function () {
	var stockSymbol = document.getElementById("stockSymbolInput").value;
	// Show navbar and fetch Company Profile 2 data
	if (stockSymbol === "") {
		var alertMessage = document.getElementById("alertMessage");
		alertMessage.style.display = "block"; // Show alert message
		return;
	}

	document.getElementById("navbar").style.display = "flex";
	fetchCompanyProfileData(stockSymbol);
});

// Function to hide alert message when search input is not empty
function hideAlertMessage() {
	var stockSymbolInput = document.getElementById("stockSymbolInput");
	var alertMessage = document.getElementById("alertMessage");

	if (stockSymbolInput.value !== "") {
		alertMessage.style.display = "none"; // Hide alert message
	}
}

// Event listener for input events on the search text field
document.getElementById("stockSymbolInput").addEventListener("input", hideAlertMessage);

async function makeAPIrequest(route, stockSymbol) {
	try {
		const response = await fetch(`/${route}/${stockSymbol.toUpperCase()}`);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching data:', error);
		return null;
	}
}

function fetchCompanyProfileData(stockSymbol) {
	return makeAPIrequest('get_company_profile_data', stockSymbol);
}

function fetchCompanyQuoteData(stockSymbol) {
	return makeAPIrequest('get_company_quote_data', stockSymbol);
}

function fetchCompanyTrendsData(stockSymbol) {
	return makeAPIrequest('get_company_trends_data', stockSymbol);
}

function fetchCompanyNewsData(stockSymbol) {
	return makeAPIrequest('get_company_news_data', stockSymbol);
}

function fetchPolygonData(stockSymbol) {
	return makeAPIrequest('get_polygon_data', stockSymbol);
}

// Function to show/hide tabs and content
function showTab(tabName) {
	// Hide all content elements
	const contentElements = document.querySelectorAll('.content');
	contentElements.forEach(element => {
	  element.style.display = 'none';
	});
  
	// Show the selected tab's content
	const contentElement = document.getElementById(tabName);
	if (tabName === 'latestNews') {
		contentElement.style.display = 'block';
	}
	else {
		contentElement.style.display = 'flex';
	}
  
	// Highlight the selected tab
	const tabElements = document.querySelectorAll('.tabbutton');
	tabElements.forEach(element => {
	  if (element.id === tabName + 'Tab') {
		element.classList.add('selected-tab');
	  } else {
		element.classList.remove('selected-tab');
	  }
	});
}

function showNavbar() {
	const navbar = document.getElementById('navbar');
	navbar.style.display = 'flex';
	// Initially select the 'Company' tab
	showTab('company');
}

async function searchStock() {
    // Get the entered stock symbol from the input field
    var stockSymbol = document.getElementById("stockSymbolInput").value.trim();

    var alertMessage = document.getElementById("alertMessage");

    if (stockSymbol === "") {
        alertMessage.style.display = "block"; // Show alert message
        return;
    }

    try {
        // Concurrently fetch company profile data, polygon data, and news data
        const [companyProfileData, polygonData, companyNewsData] = await Promise.all([
            fetchCompanyProfileData(stockSymbol),
            fetchPolygonData(stockSymbol),
            fetchCompanyNewsData(stockSymbol)
        ]);

        if (Object.keys(companyProfileData).length === 0) {
            displayErrorMessage();
            return;
        }

        showNavbar();
        const companyProfile = document.getElementById('companyProfile');
        if (companyProfile) {
            companyProfile.parentNode.removeChild(companyProfile);
        }
        hideErrorMessage();
        const searchResult = document.getElementById('search-result');
        searchResult.style.display = 'block';

        // Write company profile data
        writeCompanyProfileData(companyProfileData);

        // Fetch company quote and trends data
        const companyQuoteData = await fetchCompanyQuoteData(stockSymbol);
        const companyTrendsData = await fetchCompanyTrendsData(stockSymbol);

        // Write stock summary data
        writeStockSummaryData(companyQuoteData, companyTrendsData, stockSymbol);

        // Write polygon data
        writeChartsData(polygonData);

        // Write company news data
        writeCompanyNewsData(companyNewsData);

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function displayErrorMessage() {
	resultArea = document.getElementById('search-result');
	resultArea.style.display = 'none';
	var errorResult = document.getElementById('error-result');
	errorResult.style.display = 'block';
}

function hideErrorMessage() {
	var errorResult = document.getElementById('error-result');
	errorResult.style.display = 'none';
}

function clearSearch() {
	document.getElementById('stockSymbolInput').value = '';
	const searchResult = document.getElementById('search-result');
	searchResult.style.display = 'none';
	const errorResult = document.getElementById('error-result');
	errorResult.style.display = 'none';
	const companyProfile = document.getElementById('companyProfile');
	if (companyProfile) {
		companyProfile.parentNode.removeChild(companyProfile);
	}
}