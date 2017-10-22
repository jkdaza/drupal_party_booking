(function ($) {
  Drupal.behaviors.barn_party_booking_node_form = {
		    attach: function (context, settings) {
	    		$('.booking-hidden').each(function() {
	    			var hdn = $(this);
	    			var val = '';
	    			var label = '';
	    			if (hdn.is('input')) {
	    				val = hdn.val();
	    				
	    			} else {
	    				val = hdn.find(':input').val();
	    				label = hdn.find('label').text().replace(' *','')+': <br/>';
	    			}
	    			if (val != '') {
	    				var edtBtn = $('<a href="#"> Edit</a>').click(function(e) {
	    					e.preventDefault();
	    					hdn.toggle();
	    				});
	    				var summaryItm = $('<div>'+label+val+'</div>').append(edtBtn).prepend('<br/>');
	    				hdn.before(summaryItm);
	    			}
	    			
	    			
	    		});
	    		var edtBtn = $('<a href="#"> Edit</a>').click(function(e) {
					e.preventDefault();
					$(this).prev().toggle();
				});
	    		var food = $('#edit-field-food-und').hide().after(edtBtn);	
	    		var extras = $('#edit-field-extras-und').hide().after(edtBtn.clone());	
		    }
  };
})(jQuery);