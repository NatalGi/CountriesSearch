"use strict";

$(function() {
	var url = 'https://restcountries.eu/rest/v2/name/';
	var countriesList = $('#countries');
	var countryName = $('#country-name');

	$('#search').click(searchCountries);
	countryName.keyup(function(event) {
		if($('#country-name').val().length > 1) {
			countriesList.addClass('show');
			searchCountries();
		} else {
			countriesList.removeClass('show');
		}
	});

	countryName.click(function() {
		countryName.val('');
	});

	function searchCountries(many = true) {
		var countryName = $('#country-name').val();
		if(!countryName.length) countryName = 'Poland';
		$.ajax({
			url: url + countryName,
			method: 'GET',
			success: function(resp) {
				if(many) {
					showCountriesList(resp);
				} else {
					showCountry(resp);
				}					
			},
			error: hideList
		});			
	};

	function showCountriesList(resp) {
		countryName.removeClass('error');
		countriesList.empty();
		resp.forEach(function(item) {
			$('<li>').text(item.name).appendTo(countriesList);
		});

		$('#countries li').click(function() {
			countryName.val($(this).text());
			countriesList.removeClass('show');
			searchCountries(false);
		});
	};

	function showCountry(resp) {
		$('#flag').attr('src', resp[0].flag);
		$('#info-name').text(resp[0].name);
		$('#info-reg').text(resp[0].region);
		$('#info-cap').text(resp[0].capital);
		$('#info-area').text(resp[0].area + ' sq. km');
		$('#info-pop').text(numSeparator(resp[0].population) + ' thousands');

		var langList = resp[0].languages;
		var langs = '';
		langList.forEach(function(item) {
			langs += item.name + ', ';
		});
		langs = langs.substr(0, langs.length - 2);
		$('#info-lang').text(langs);

		var currList = resp[0].currencies;
		var currs = '';
		currList.forEach(function(item) {
			currs += item.name + ', ';
		});
		currs = currs.substr(0, currs.length - 2);
		$('#info-curr').text(currs);
	
		$('.country-info-section table').addClass('show');
	}

	function numSeparator(number) {
		var correctNum = '';
		var strNum = '' + number;
		var thousands = 1000;

		for(var i = 0, y = number; y > thousands-1; i++) {
			var midIndex = strNum.length - (3 * (i + 1) + i);
			strNum = strNum.substr(0, midIndex) + ',' + strNum.substr(midIndex, strNum.length);
			thousands = Math.pow(1000, i + 2);
		}

		return strNum;
	}

	function hideList() {
		countryName.addClass('error');
		countriesList.removeClass('show');
	};
});