// Project namespaces
var projectsfari = function(){
	config = {
		totalrow : 0,
		limit : 10,
		offset : 0,
		searchfield : '',
		searchterm : '',
		api : 'https://data.cityofnewyork.us/resource/rvhx-8trz.json',
		// Was not able to set up the MongoDB so using the array to store fields
		datafields : ['applicant_license__', 'applicant_professional_title', 'applicant_s_first_name', 'applicant_s_last_name',
					  'approved', 'assigned', 'bin__', 'block', 'borough', 'building_type', 'city_', 'city_owned', 'community___board',
					  'dobrundate', 'doc__',  'efiling_filed', 'enlargement_sq_footage', 'equipment', 'existing_dwelling_units', 
					  'existing_height', 'existing_occupancy', 'existing_zoning_sqft', 'existingno_of_stories', 'fee_status', 
					  'fully_paid', 'house__', 'initial_cost', 'job__', 'job_description', 'job_status', 'job_status_descrp',
					  'job_type', 'landmarked', 'latest_action_date', 'lot', 'mechanical', 'owner_s_business_name', 'owner_s_first_name',
					  'owner_s_house_number', 'owner_s_last_name', 'owner_shouse_street_name', 'owner_sphone__', 'paid', 'pre__filing_date',
					  'professional_cert', 'proposed_dwelling_units', 'proposed_height', 'proposed_no_of_stories', 'proposed_occupancy',
					  'proposed_zoning_sqft', 'state', 'street_frontage', 'street_name', 'total_est__fee', 'zip', 'zoning_dist1', 
					  'zoning_dist2'],
	}
	
	// Display data table
	function displayData(data){
		var datarow = '';
		
		// Empty rows before add more rows 
		$( '#myTable tbody' ).empty();
		// Update pagination with data total
		$( '.datapagination .total' ).text( data.length );

		// Set up the table header
		for( var obj in data ){
			datarow += '<tr class="datarow">';
			for( var i = 0; i < config.datafields.length; i++ ){
				if ( undefined != data[obj][config.datafields[i]] ) {
					datarow += '<td class="divcol">' + data[obj][config.datafields[i]] + '</td>';
				} else {
					datarow += '<td class="divcol"> -- </td>';
				}
			}
			datarow += '</tr>';
		}
		
		// Display data rows
		$( 'tbody' ).append( datarow );
		
		// Refrest Tablebort
		$("#myTable").trigger("update");
		var sorting = [[0,0]];
		$("#myTable").trigger("sorton",[sorting]);
	}
	
	// Process all data loads
	function processData( type ){
		var param = '',
			currentdata = $( '.datapagination .currentrows' ),
			currenttotal = 0;
			
		// Setup data ajax url based on search, pagination and initial call
		switch( type ){
			case 'init':
				param = '?$offset=' + config.offset;
				break;
			case 'display':
				param = '?$offset=' + config.offset + '&$limit=' + config.limit;
				break;
			case 'initsearch':
				param = '?$offset=' + config.offset + '&' + config.searchfiled + '=' + config.searchterm;
				break;
			case 'search':
				param = '?$offset=' + config.offset + '&$limit=' + config.limit + '&' + config.searchfiled + '=' + config.searchterm;
				break;
			default:
				param = '';
				break;
		}

		// Ajax call to invoke API
		$.ajax({
			type: 'GET',
			url: config.api + param,
			data: {},
			dataType: 'json',
			beforeSend: function(){
				// Loding image 
			},
			success: function( data ){
				if( type == 'init' || type == 'initsearch' ) {
					config.totalrow = data.length;
					$( '.datapagination .totalrows' ).text( config.totalrow );
					config.initialdisplay = false;
				}
				
				if( type == 'display' || type == 'search' ) {
					displayData(data);
				}
				
				currenttotal = ( config.offset+10 > config.totalrow ) ? config.totalrow : config.offset+10;
				currentdata.text( ( config.offset+1 ) + ' - ' + currenttotal );
			},
			error: function( xhr ){
				console.log( xhr.status );
			}
		});
	}
	
	// initial display
	function init(){
		var headerrow = '',
			item = '',
			itemcount = 1,
			selectoption = '';
			
		headerrow += '<thead>'; 
		headerrow += '	<tr class="headerrow">';
		
		for(var i = 0; i < config.datafields.length; i++){
			item = config.datafields[i].replace(/\_/g, ' ');
			headerrow += '<td class="divcol">'+ item +'</td>';
			selectoption += '<option value="'+ config.datafields[i] +'">'+ item +'</option>';
			itemcount++;
		}
		
		headerrow += '</tr>';
		headerrow += '</thead>'; 
		headerrow += '<tbody>'; 
		headerrow += '</tbody>'; 
		
		$( '.datatable' ).append( headerrow );
		$( '.dataoption' ).append( selectoption );
		$( '.datatable' ).css({'width': itemcount * 227 });
			
		processData( 'init' );
		processData( 'display' ); 
	}

	// Search data
	function searchOption(){
		// Resore default on reset
		$( 'body' ).on( 'click', '.searchbox .resetbtn', function(){
			config.offset = 0;
			config.searchfiled = '';
			config.searchterm = '';
			processData( 'init' );
			processData( 'display' );
			
			$( 'table.datatable thead tr td' ).removeClass( 'tablesorter-headerAsc tablesorter-headerDesc' ).addClass( 'tablesorter-headerUnSorted' );
		});
		
		// Search trigger 
		$( 'body' ).on( 'click', '.searchbox .searchbtn', function(){
			config.searchfiled = $( 'select option:selected' ).val();
			config.searchterm = $( '.datavalues' ).val();

			if( config.searchfiled && config.searchterm ){
				processData( 'initsearch' );
				processData( 'search' );
			}
		});
	}
	
	// Pagination Handler
	function pagination(){
		$( 'body' ).on( 'click', '.datapagination .btn', function(){
			if( $( this ).hasClass( 'datanext' ) ){
				config.offset += config.limit;
			} else {
				config.offset -= config.limit;
			}
			
			if( config.searchfiled && config.searchterm ){
				processData( 'search' );
			} else {
				processData( 'init' );
				processData( 'display' );
			}
			display(config.offset);
			
		});

		// Display next and prev button
		function display( offset ){
			var prevbtn = $( '.datapagination .dataprev' ),
				nextvbtn = $( '.datapagination .datapnext' );
			
			var prevdisplay = ( offset != 0 ) ? 'block' : 'none',
				nextdisplay = ( offset == 100 ) ? 'none' : 'block';
			
			prevbtn.css({'display':prevdisplay});
			nextvbtn.css({'display':nextdisplay});
		};
	}
	
	// Initial table sort
	function sortData(){
		$(document).ready(function() { 
			$('#myTable').tablesorter();
		})
	};
	
	return {
		init: init,
		searchOption: searchOption,
		pagination : pagination,
		sortData : sortData,
		
	}
}();

projectsfari.init();
projectsfari.searchOption();
projectsfari.pagination();
projectsfari.sortData();
