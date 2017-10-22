(function ($) {
  Drupal.behaviors.barn_party_booking = {
		    attach: function (context, settings) {
		    	if ($('body').hasClass('page-barn-party-booking-form')) {
		    		var bf = new partyBookingForm($);
		    	}
		    	
		    }
  };
})(jQuery);
var partyBookingForm = function($) {
	
	this.options = {
			availableDates : {},
			calendarContainer: null,
			date: null,
			partyType: null,
			price: null,
			min_child_num: 5,
			max_child_num: 30,
			farm: false,
			farmSlots: ['10:00','11:00','12:30'],
			endpoint_available: '/barn/party-booking-available-slots/',
			endpoint_submit: '/node/add/booking',
			formNames: [
			  'date_time', 'title', 'age', 'your_name', 'email', 'phone', 'address',
			  'number_of_childrens','age_on_birthday','special_requests','number_of_trays',
			  'number_of_balloons']
	};
	
	this.confirmBooking = function() {
		var $this = this;
		var o = $this.options;

		var f = $('<form></form>')
		.attr('action',o.endpoint_submit)
		.attr('method','POST');
		var emptyRequired = [];
		$('.column-container :input').each(function() {
			var inp = $(this);
			if (o.formNames.indexOf(inp.attr('name')) > -1) {
				if (inp.attr('required') && (!inp.val() || inp.val() == '')) {
					emptyRequired.push(inp.prev('label').text());
				} else {
					var cln = inp.clone().appendTo(f);
					if (inp.is('textarea')) {
						cln.val(inp.val());
					}
				}
			}
		});
		var emptyRequiredCount = emptyRequired.length;
		if (emptyRequiredCount > 0) {
			f.remove();
			var alertTxt = '';
			for (var i=0; i<emptyRequiredCount; i++) {
				alertTxt+='"'+emptyRequired[i]+'" is a required field!\n'
			}
			alert(alertTxt);
		} else {
			var extField = $('<input type="text" name="extras" value="">');
			$this.options.extraCheckboxes.each(function() {
				var cbx = $(this);
				if (cbx.is(':checked')) {
					var v = extField.val();
					extField.val(v+' '+cbx.attr('name'));
				}
			});
			f.append(extField);
			var partyTypeTxt = o.partyTypeSelect.find('option[value="'+o.partyType+'"]').text();
			f.append('<input type="hidden" name="party_type" value="'+partyTypeTxt+'">');
			f.append('<input type="hidden" name="new-booking-form" value="true">');
			f.trigger('submit');
			f.remove();
			$this.clearSlots();
		}
	}
	
	this._getPartyTypesByDate = function(date,callback) {
		var seconds = date.getTime()/1000;
		var $this = this;
		var o = $this.options;
		$.ajax({
			url: o.endpoint_available+seconds,
			dataType: 'json',
			success: function(d) {
				o.availableDates = d;
				if (typeof callback == 'function') {
					callback.apply($this);
				}
			}
		});
		
	};
	
	this._getDatePickerOptions = function() {
		var $this = this;
		var o = $this.options;
		var opt = {
			defaultDate: o.date,
			minDate: 1,
			maxDate: new Date(2018,6,22),
			onChangeMonthYear: function(y,m) {
				$this.resetPartyTypes();
				$this.clearSlots();
				$this.disableOptions();
			},
			onSelect: function(dateText,inst) {
				var date = new Date(dateText)/*.getTime()/1000*/;
				//$this.showAvailableSlots(date);
				$this.options.partyTypeSelect.hide();
				$this.clearSlots();
				$this._getPartyTypesByDate(date,$this.populatePartyTypes);
			}
		};
		return opt;
	}
	
	this.calendarInit = function() {
		var $this = this;
		var o = $this.options;
		$this.clearSlots();
		var calendarContainer = o.calendarContainer
		.datepicker('destroy')
    	.datepicker($this._getDatePickerOptions());
	
	};
	
	this.calendarReset = function(date) {
		var $this = this;
		if (date) {
			$this.options.date = date;
		}
		$this.options.calendarContainer
		.datepicker('destroy')
		.datepicker($this._getDatePickerOptions())
		.datepicker('show');
		
		$('.option-column').css('opacity',0.5)
		.find(':input').attr("disabled", true);
	};
	
	this.clearSlots = function() {
		
		this.options.slotContainer.html('');
		this.options.confirmdateBtn.hide();
		$('input#date-time').val('');
		this.disableOptions();
	};
	
	this.resetPartyTypes = function() {
		var o = this.options;
		o.partyTypeSelect.hide().find('option').each(function(i,v) {
			if (i != 0) {
				$(v).remove();
			}
		});
	};
	
	this.populatePartyTypes = function() {
		var o = this.options;
		this.resetPartyTypes();
		for (var i in o.availableDates) {
			if (i != 'booked') {
				var pt = o.availableDates[i];
				o.partyTypeSelect.append('<option value="'+i+'">'+pt['label']+'</option>');
			}
		}
		o.partyTypeSelect.show();
	};
	
	this.setPartyType = function(type) {
		var $this = this;
		var o = $this.options;
		if (type && type != '' && type in o.availableDates) {	
			//Set vars
			o.partyType = type;
			var partyinfo = o.availableDates[o.partyType];
			o['min_child_num'] = partyinfo['min_child_num'];
			o['max_child_num'] = partyinfo['max_child_num'];
			o['partyInfo'] = partyinfo['party_info'];
			if ('fee' in partyinfo) {
				o['fee'] = partyinfo['fee'];
			}
			o['farm'] = partyinfo['farm'];
			if ('price' in partyinfo) {
				o.price = parseFloat(partyinfo['price'],10);
			} else {
				alert('Sorry there was an error. The page will refresh automatically!')
				window.location.reload(true);
			}
			$this.showAvailableSlots();
		
		} else {
			$this.clearSlots();
		}
		
	};

	
	this.enableOptions = function() {
		var $this = this;
		var o = $this.options;
		o.optionsContainer.css('opacity',1)
		.find(':input').removeAttr("disabled");
		o.descContainer.find('.entry-price').text($this.options.price.toFixed(2));
		o.descContainer.find('.min-child-num').text('Min booking of '+$this.options['min_child_num']+' children.');
		o.descContainer.find('.party-info').html($this.options.partyInfo);
		if (o['farm'] == true && o.farmSlots.indexOf(o.slotTime) > -1) {
			o.farmCheckbox.show();
		} else {
			o.farmCheckbox.hide();
		}
		o.descContainer.show();
	};
	
	this.disableOptions = function() {
		this.options.optionsContainer.css('opacity',0.5)
		.find(':input').attr("disabled", true);
		this.options.descContainer.hide();
		this.options.descContainer.find('.party-info').text('');
		this.options.priceContainer.val(0);
		//this.options.numChildContainer.val('');
	};
	
	this.calculatePrice = function() {
		var price = 0;
		var o = this.options;
		var numChild = parseInt(o.numChildContainer.val(),10);
		var ppc = o.price;
		if (numChild && numChild != '') {
			price = numChild*ppc;
			if (o.fee) {
				price = price+o.fee;
			}
			//Get Extras
			o.extraCheckboxes.each(function() {
				var ext = $(this);
				if (this.checked) {
					var extPrice = ext.attr('data-price');
					if (extPrice) {
						var extPriceNum = parseFloat(extPrice,10);
						if (ext.attr('data-pc')) {
							extPriceNum = extPriceNum*numChild;
						} else if (ext.attr('data-qty')) {
							var qtyCont = $('#'+ext.attr('id')+'-qty').show()
							.find('input').attr('required',true);
							var qty = parseInt(qtyCont.find('input').val());
							if (qty && qty != '') {
								extPriceNum = extPriceNum*qty;
							} else {
								extPriceNum = 0;
							}
						}
						price = price+extPriceNum;
					}
					
				} else {
					if (ext.attr('data-qty')) {
						var qtyField = $('#'+ext.attr('id')+'-qty').hide()
						.find('input').removeAttr('required').val('');
					}
				}
			});
			//Populate inoutbox
			o.priceContainer.val(price.toFixed(2));
			
		} else {
			return;
		}
		
	};
	
	this.showAvailableSlots = function(t) {
		var $this = this;
		var o = $this.options;
		$this.clearSlots();
		$this.disableOptions();
		var slotContainer = o.slotContainer;
		var slots = o.availableDates[o.partyType]['times'];
		if (!slots) {
			alert('There wan an error. This page will refresh');
			window.loaction.reload();
			return;
		}
		if (slots.length == 0) {
			slotContainer.html('Sorry, no slots available for the current selection. Please, try selecting a different party type.')
			return;
		}
		for (var i=0; i<slots.length; i++) {
			var slotSeconds = parseInt(slots[i],10);
			var slotMilSeconds = slotSeconds*1000;
			var slotDate = new Date(slotMilSeconds);
			var slotHours = slotDate.getHours();
			var slotMinutes = ('0'+slotDate.getMinutes()).slice(-2);
			var slotLabel = slotHours+':'+slotMinutes+' - '+(slotHours+2)+':'+slotMinutes;
			var slotHtml = '<label for="slot-'+slotSeconds+'" class="pure-radio">';
			slotHtml += '<input id="slot-'+slotSeconds+'" type="radio" name="slot" value="'+slotSeconds+'"> '+slotLabel+'</label>';
			slotContainer.append(slotHtml);
		}
		slotContainer.find('input:radio[name="slot"]').change(function(){
			$this.disableOptions();
			$this.options.confirmdateBtn.show();
		})
	};
	
	
	var __construct = function($this) {
		$this.options.calendarContainer = $('#calendar');
		$this.options.slotContainer = $('#slots').html('');
		$this.options.optionsContainer = $('.option-column');
		$this.options.allInputs = $('.column-container :input');
		$this.options.descContainer = $('#price-description');
		$this.options.farmCheckbox = $('#farm-check').parent('label');
		$this.options.priceContainer = $('#price-to-pay').val(0);
		$this.options.numChildContainer = $('input[name="number_of_childrens"]').change(function() {
			var nc = $(this);
			var ncv = parseInt(nc.val());
			if (!isNaN(ncv)) {
				if (ncv < $this.options['min_child_num']) {
					nc.val($this.options['min_child_num']);
					alert('Sorry, party booking require a minimum of '+$this.options['min_child_num']+' children per party.')
				} else if (ncv > $this.options['max_child_num']) {
					nc.val($this.options['max_child_num']);
					alert('Sorry, we can only host a maximum of '+$this.options['max_child_num']+' children per party.')
				}
				$this.calculatePrice();
			} else {
				nc.val('');
			}
		});
		$this.disableOptions();
		$this.options.confirmdateBtn = $('#confirm-date').hide()
		.click(function() {
			
			var dt = $this.options.slotContainer.find('input[name="slot"]:checked').val();
			var d = new Date(dt*1000);
			$this.options.slotTime = d.getHours()+':'+('0'+d.getMinutes()).slice(-2);
			$('input#date_time')
			.val(d.getTime());
			$this.enableOptions();
		});
		
		$this.options.confirmBookingBtn = $('#confirm-booking')
		.hide()
		.click(function() {
			$this.confirmBooking();
		});
		$this.calendarInit();
		
		$this.options.partyTypeSelect = $('#party-type').change(function() {
			$this.setPartyType($(this).val());
			
		}).hide();
		
		
		
		
		
		$this.options.extraCheckboxes = $('#extras').find('input[type="checkbox"]').click(function() {
			$this.calculatePrice();
		});
		var qtyInput = $('.extra-qty-input','#extras').change(function() {
			$this.calculatePrice();
		}).parent().hide();
		
		setInterval(function() {
			$this.options.numChildContainer.trigger('change');
			qtyInput.trigger('change');
			var requredInp = 0;
			var requredInpFull = 0;
			$this.options.allInputs.each(function() {
				var inp = $(this);
				if (inp.attr('required')) {
					requredInp++
					if (inp.val() != '') {
						requredInpFull++
					}
				}
			});
			if (requredInp == requredInpFull) {
				$this.options.confirmBookingBtn.show();
			} else {
				$this.options.confirmBookingBtn.hide();
			}
		},2000);
		
		//Validation rules
		$('input#age').change(function() {
			var i = $(this);
			var v = parseInt(i.val());
			if (isNaN(v)) {
				i.val('');
			}
		});
		$('input#email').change(function() {
			var i = $(this);
			var v = i.val();
			var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
			if(!re.test(v)) {
				 i.val('');
			}
		});
		$('input#phone').change(function() {
			var i = $(this);
			var v = i.val();
			if(v.length != 11 || v.substring(0,2) != '07') {
				 i.val('');
			}
		});
	}(this);
};