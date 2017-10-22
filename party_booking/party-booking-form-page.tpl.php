<div><p>Your current selection:</p></div>
<div class="top-summary">
	<div class="pure-form">
		<label for="deposit">Deposit &pound;</label>
    <input id="deposit" type="text" class="pure-input-rounded" size="5" readonly value="<?php echo $prices['deposit']; ?>">
    <label for="price-to-pay">Total price &pound;</label>
    <input id="price-to-pay" type="text" class="pure-input-rounded" size="6" readonly><sup>1</sup>
		<div id="confirm-booking" class="booking-btn"><img src="/<?php echo $module_path; ?>/img/next_btn.png" alt="Next"/></div>
	</div>
	
</div>

<div class="column-container pure-g">
	<div class="column date-column pure-u-1-3 pure-form-stacked pure-form">
		<h3>Party Time</h3>
		<div><p>Please find more information about our parties on the <a href="/barn/big-play-barn-parties">Party page</a>.</p></div>
		
		<div id="calendar" class="booking-date-set"></div>
		
		<div class="pure-u-1">
	  	<label for="party-type">Party type</label>
	    <select id="party-type" class="pure-input-1">
	    	<option value="">Please select...</option>
			</select>
	  </div>
	
		<div class="pure-g" class="booking-date-set">
			<div id="slots" class="pure-form-stacked pure-form pure-u-1-2"></div>
			<div id="confirm-date" class="booking-btn pure-u-1-2"><img src="/<?php echo $module_path; ?>/img/confirm_date.png" alt="Confirm date"/></div>
		</div>
		<div><input id="date_time" type="hidden" name="date_time"/></div>
	</div>
	<div class="column option-column pure-u-1-3 pure-form-stacked pure-form">
		<h3>Party Options</h3>
			<fieldset>
			
			<div class="pure-control-group" id="children-num">
				<label>Number of Children</label>
				<input type="text" name="number_of_childrens" size="5" required>
				<div class="description" id="price-description" style="display:none;">
					<p>Charged at &pound;<span id="entry-price" class="entry-price"></span> per child.</p>
					<p class="min-child-num"></p>
					<p class="party-info"></p>
					</div>
			</div>

			<h4>Food:</h4>
			<div id="food">
				<label for="hot-food" class="pure-radio">
	        <input id="hot-food" type="radio" name="food" value="hot" checked>
	        Hot Food
	    	</label>
	    	<label for="cold-food" class="pure-radio">
	        <input id="cold-food" type="radio" name="food" value="cold" checked>
	        Cold Finger Buffet
	    	</label>
    	</div>
    	<div>
  			<h4>Extras:</h4>
 				<div id="extras">
					
					<label for="trays-check" class="pure-checkbox">
        		<input id="trays-check" type="checkbox" value="" name="trays" data-price="16.50" data-qty="true">
        		Adult Trays (&pound;16.50 per 10 portion tray)
    			</label>
    			<div class="pure-control-group" id="trays-check-qty">
						<label>Number of Trays:</label>
						<input type="text" class="extra-qty-input" name="number_of_trays" size="4" value="1">
					</div>
    			
    			<label for="cups-check" class="pure-checkbox">
        		<input id="cups-check" type="checkbox" value="" name="cups" data-price="1.75" data-pc="true">
        		Party Bags (&pound;1.75 per child) 
    			</label>
    			
    			<label for="icecream-check" class="pure-checkbox">
        		<input id="icecream-check" type="checkbox" name="icecream" value="" data-price="1" data-pc="true">
        		 Funny Feet Icecreams (&pound;1 per child) 
    			</label>
    			
    			<label for="balloons-check" class="pure-checkbox">
        		<input id="balloons-check" type="checkbox" name="balloons" value="" data-price="3.95" data-qty="true">
        		Party Balloons (&pound;3.95)
    			</label>
    			<div class="pure-control-group" id="balloons-check-qty">
						<label>Number of Balloons:</label>
						<input type="text" class="extra-qty-input" name="number_of_balloons" size="4" value="1">
					</div>
    			
    			<label for="farm-check" class="pure-checkbox" style="display:none;">
        		<input id="farm-check" type="checkbox" name="farm" value="" data-price="3.5" data-pc="true">
        		Visit Farm (&pound;3.50 per child, &pound;1 per adult)
    			</label>
				</div>
			</div>
    	
    	
    	<div class="pure-control-group">
    		<label for="special-requests">Special requests</label>
    		<textarea id="special-requests" name="special_requests" class="pure-input-1"></textarea>
    	</div>

    	
			<div class="pure-u-1" id="adult-num"></div>
		</fieldset>
	</div>
	<div class="column person-column pure-u-1-3">
		<div class="pure-form pure-form-stacked">
    	<fieldset>
        <div class="pure-control-group">
            <label for="title">Child name</label>
            <input class="pure-input-1" id="title" name="title" type="text" required/>
        </div>
        
        <div class="pure-control-group">
            <label for="age">Age on Birthday</label>
            <input id="age" name="age_on_birthday" type="text" size="4" required/>
        </div>

        <div class="pure-control-group">
            <label for="your-name">Your name</label>
            <input class="pure-input-1" id="your-name" name="your_name" type="text" required/>
        </div>
        
        <div class="pure-control-group">
            <label for="email">Email</label>
            <input class="pure-input-1" id="email" name="email" type="text" required/>
        </div>
        
        <div class="pure-control-group">
            <label for="phone">Mobile Phone</label>
            <input class="pure-input-1" id="phone" name="phone" type="text" required/>
        </div>
        
        <div class="pure-control-group">
    			<label for="address">Address</label>
    			<textarea class="pure-input-1" id="address" name="address" class="pure-input-1" cols="5" required></textarea>
    		</div>
        
       </fieldset>
      </div>
	</div>
</div>
<div><p>Should you have problems with this booking form, please use our <a href="/barn/front/calendar/month">legagcy booking form</a>.</p></div>
<div><sup>1</sup> The total price shown here is based on the options selected on this page. You will only be required to pay the deposit at the time of booking. You will be paying the outstanding balance on the party day.</div>