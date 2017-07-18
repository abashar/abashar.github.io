# abashar.github.io
NYC Application Filings Query Tool.

 1. Design choice based on the requirements: 
	
    1) Using API from https://data.cityofnewyork.us/Housing-
    Development/DOB-Job-Application-Filings/ic3t-wcy2
	
    2) All user events ie. search, pagination are using direct ajax call to https://data.cityofnewyork.us/resource/rvhx-8trz.json.
	
    3) Solution is AJAX based and data is loading as json with AJAX so this tool is not using any DB to store data. 
	If this is an internal DB then a server side page can create an API to use with AJAX 
	
    4) This query tool is without angular.js or react.js, 
		- Using plain JavaScript and JQuery. 
		- Used JQuery Tablesort package for sorting. 
		- Page template is copied from http://www.simonsfoundation.org so it can be incorporated http://www.simonsfoundation.org. 
		- Colors and styling are based on http://www.simonsfoundation.org style guide.
	
    5) Initial data load, search, pagination are based on endpoints that return search results. These endpoints are using AJAX.
	
    6) Query tool has search option based on available data fields, reset option, sort and pagination option. 
	
	7) User should be able to search and sort your results on all the field

    8) While pagination the page will invoke AJAX call so the page doesn't have to be refreshed for each request. 
	


2. I would use Angular mainly because of search input validation, sorting. There is no search data validation to this code. Can be added as required.
