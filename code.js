const ALL_MAKES_API_URL = 'https://vpic.nhtsa.dot.gov/api/vehicles/GetAllMakes?format=json';
const MAKE_MODELS_API_URL = 'https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/<make>?format=json';
const SELLER_NAME_ERROR_MSG = 'Seller name is empty';
const SELLER_ADDRESS_ERROR_MSG = 'Address is empty';
const INVALID_PHONE_FORMAT_ERROR_MESSAGE = 'Phone number format is invalid';
const EMPTY_PHONE_ERROR_MESSAGE = 'Phone number is empty';
const EMPTY_MAKE_ERROR_MESSAGE = 'Make field is empty';
const UNRECOGNIZED_MAKE_ERROR_MESSAGE = 'We dont know such make name';
const EMPTY_MODEL_ERROR_MESSAGE = 'Model field is empty';
const UNRECOGNIZED_MODEL_ERROR_MESSAGE = 'We dont know such model of <make>';


var autoincremented_id = 0;
var allMakes = [];
var allModels = [];

$(document).ready(function () {
	getAllMakes();
	
	$('input[name="firstname"]').blur(validateSellerName);
	$('input[name="address"]').blur(validateSellerAddress);
	$('input[name="phonenum"]').blur(validatePhoneNumber);
	$('input[name="make"]').blur(validateMake);
	$('input[name="model"]').blur(validateModel);
	
});


function addCar() {
	
	let results = new Array (validateSellerName(),
							 validateSellerAddress(),
							 validatePhoneNumber(),
							 validateMake(),
							 validateModel() 
							)
	
	if (!results.includes(false)) {
		let seller_name = $('input[name="firstname"]').val();
		let seller_address = $('input[name="address"]').val();
		let seller_phone = $('input[name="phonenum"]').val();
		let vehicle_year = $('select[name="year"] option:selected').html();
		let vehicle_manufacturer = $('select[name="make"] option:selected').html();
		let vehicle_model = $('input[name="model"]').val();

		let vehicle_data = { year: vehicle_year,
							 make: vehicle_manufacturer,
							 model: vehicle_model
						   };

		let data_to_save = { name: seller_name, 
							address: seller_address, 
							phone: seller_phone, 
							vehicle: vehicle_data
							};

		window.localStorage.setItem(autoincremented_id, JSON.stringify(data_to_save));
		autoincremented_id += 1;
	}
}


function getAllMakes() {
	$.ajax({
            url: ALL_MAKES_API_URL,
            type: 'GET',
			async: true,
			success: function(data) {
				result = data['Results'];
				result.forEach(function(element) {
					allMakes.push(element['Make_Name'].toLowerCase());
				}) 
			}
	});
}

async function getMakeModels(make) {
	api_url = MAKE_MODELS_API_URL.replace('<make>', make.toLowerCase());
	$.ajax({
            url: api_url,
            type: 'GET',
			async: false,
			success: function(data) {
				result = data['Results'];
				result.forEach(function(element) {
					allModels.push(element['Model_Name'].toLowerCase());
				}) 
			}
	});
	
	return allModels;
}

function validateSellerName() {
	let sname = $('input[name="firstname"]').val();
	if (sname == '') {
		$('#snameErrorMessage').html(SELLER_NAME_ERROR_MSG);
		return false;
	} else {
		$('#snameErrorMessage').html('');
	}
}

function validateSellerAddress() {
	let address = $('input[name="address"]').val();
	if (address == '') {
		$('#addressErrorMessage').html(SELLER_ADDRESS_ERROR_MSG);
		return false;
	} else {
		$('#addressErrorMessage').html('');
	}
}

function validatePhoneNumber() {
	let phone = $('input[name="phonenum"]').val();

	if (phone != "") {
        let first_pattern = /^\((\d{3})\)(\d{3})-(\d{4})$/;
		let second_pattern = /^(\d{3})-(\d{3})-(\d{4})$/
        var result = first_pattern.test(phone) || second_pattern.test(phone);
        if (!result) {
            $("#phoneErrorMessage").html(INVALID_PHONE_FORMAT_ERROR_MESSAGE);
        } else {
            $("#phoneErrorMessage").html('');
        }
        return result;
    } else {
		$("#phoneErrorMessage").html(EMPTY_PHONE_ERROR_MESSAGE);
		return false;
	}
    $("#phoneErrorMessage").html('');
    return true;
}

function validateMake() {
	let make = $('input[name="make"]').val().toLocaleLowerCase();
	
	if (make == '') {
		$('#makeErrorMessage').html(EMPTY_MAKE_ERROR_MESSAGE);
		return false;
	} else if (!allMakes.includes(make)) {
		$('#makeErrorMessage').html(UNRECOGNIZED_MAKE_ERROR_MESSAGE);
		return false;
	} else {
		$('#makeErrorMessage').html('');
		return true;
	}
}

async function validateModel() {
	let make = $('input[name="make"]').val().toLocaleLowerCase();
	let model = $('input[name="model"]').val().toLocaleLowerCase();
	
	if (model == '') {
		$('#modelErrorMessage').html(EMPTY_MODEL_ERROR_MESSAGE);
		return false;
	}
	
	if (validateMake()) {
		models = await getMakeModels(make);
		
		if (!models.includes(model)) {
			let errorMessage = UNRECOGNIZED_MODEL_ERROR_MESSAGE.replace('<make>', make.charAt(0).toUpperCase() + make.slice(1));
			$('#modelErrorMessage').html(errorMessage);
			return false;
		}
	}
	
	$('#modelErrorMessage').html('');
	return true;
}


//how to perform search?
//how to display list of vehicles?
//Fill models options from the parsed csv file
