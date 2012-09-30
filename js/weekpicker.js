/**
 * jQueryUI Weekpicker, version 1.0.0
 * (c) YinYang
 * http://yinyangit.wordpress.com/2012/09/30/jquery-weekpicker-plugin-dua-tren-jquery-ui-datepicker
 * Last Update: 9/30/2012
 */
(function(){
    // week picker plugin
    var configs = {};

    $.fn.weekpicker = function (options, func) {

        var $this = $(this);
		var $calendar = $this.nextAll("div:first");
		
        var id = $this.attr("id");
		
		// create a new property to store config data
        if (!configs[id])
            configs[id] = { date: new Date() };
        var defaults = configs[id];        
		
        var displayYear = defaults.date.getFullYear();
				
				
        var selectCurrentWeek = function () {
            window.setTimeout(function () {
               $calendar.find('.ui-datepicker-current-day a').addClass('ui-state-active')
            }, 1);
        };

        var selectWeek = function (date, hideOnSelect) {
            if (!date) {
                date = $calendar.datepicker('getDate');
                if (!date)
                    date = new Date();
            }
			
            var dat = date.getDate();
            var day = date.getDay();

            defaults.startDate = new Date(date.getFullYear(), date.getMonth(), 1);
            if (day == 0)
                day = 7;
            defaults.startDate.setDate(dat - day + 1);
            defaults.endDate = new Date(date.getFullYear(), date.getMonth(), 1);
            defaults.endDate.setDate(dat - day + 7);

            if (date) {
                var week = date.getWeek();
                $this.val(week + " (" + defaults.startDate.toDateString() + ")");
            }
			
            if (defaults.selectHandlers) {
                for(var i in defaults.selectHandlers)
					defaults.selectHandlers[i](defaults.startDate, defaults.endDate, $this[0]);
            }

            $calendar.datepicker('setDate', defaults.startDate);
            if (hideOnSelect)
                $this.weekpicker("hide");

            selectCurrentWeek();

            displayYear = defaults.startDate.getFullYear();
        };
		
		// weekpicker methods
        if (typeof options == "string") {			
            if (options == "hide") {
                $calendar.fadeOut("fast");				
            }
            else if (options == "show") {				
               if ($calendar.is(":visible"))
                    return;
                $calendar.css("left",$this.position().left).show();
            }
            else if (options == "onSelect") {
                if (!defaults.selectHandlers)
                    defaults.selectHandlers = [];
                defaults.selectHandlers.push(func);
            }
            else if (options == "getDates") {
                return { start: defaults.startDate, end: defaults.endDate };
            }
            else if (options == "setDate") {
                selectWeek(func);
            }
        }
        else { // initialize weekpicker
            $.extend(defaults, options);
			$this.addClass("datepicker hasDatepicker");//.css("float","left");            
            $this.after("<button style='display:inline;margin: 1px 0px 0px -20px;position: relative;width:20px;height:20px' class='ui-state-default'>...</button><div class='weekcalendar'></div>");
			$calendar =  $this.nextAll("div:first");			
           
            $calendar.css({ "position": "absolute", "z-index": 1000,"float": "left" });
            var ishover = false;
           
			$.extend(defaults, {                
                showOn: null,
                buttonImageOnly: true,
                buttonText: "",
                // buttonImage: "",
                showOtherMonths: true,
                selectOtherMonths: true,
				firstDay: 1,
                showWeek: true,
                changeYear: true,
                changeMonth: true,
                calculateWeek: function (date) {
                    var week = date.getWeek();
                    var dat = date.getDate();
                    var day = date.getDay();
                    if (day == 0)
                        day = 7;
                    var startD = new Date(date.getFullYear(), date.getMonth(), 1);
                    startD.setDate(dat - day + 1);

                    if (displayYear != startD.getFullYear()) {
                        var endD = new Date(date.getFullYear(), date.getMonth(), 1);
                        endD.setDate(dat - day + 7);
                        if (startD.getFullYear() != endD.getFullYear())
                            week = 1;
                    }

                    return week;
                },
                onSelect: function (dateText, inst) {
                    selectWeek(null, true);
                },
                beforeShowDay: function (date) {
                    var cssClass = '';
                    if (date >= defaults.startDate && date <= defaults.endDate)
                        cssClass = 'ui-datepicker-current-day';
                    return [true, cssClass];
                },
                onChangeMonthYear: function (year, month, inst) {
                    selectCurrentWeek();
                    displayYear = year;
                }
            });
			
			$calendar.datepicker(defaults);
			 
            var show = function () {	
				ishover = true;			
                $this.weekpicker("show");
            }
		
            $calendar.hide();
						
            $this.mousedown(show);  
			
			function enter() {
                ishover = true;
            }
			function leave() {
                ishover = false;
            }
			
            $calendar.mouseenter(enter).mouseleave(leave);
            $this.mouseenter(enter).mouseleave(leave);
			
            $("*").bind("click", function (e) {			
                if (!ishover) {
                    $this.weekpicker("hide");
                }
				
            });
            $this.nextAll("button.ui-state-default:first").mouseenter(enter).mouseleave(leave).click(function () {
				// toggle calendar visibility
               if($calendar.is(":visible"))
                    $this.weekpicker("hide");
                else
                    show();
            });

            // set initial value    
             selectWeek(defaults.date);
        }
    }
    
	 $('.weekcalendar table.ui-datepicker-calendar tr').die().live({
        mousemove: function () { $(this).find('td a').addClass('ui-state-hover'); },
        mouseleave: function () { $(this).find('td a').removeClass('ui-state-hover'); }
    });
	
})();

// http://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
Date.prototype.getWeek = function () {
    // Copy date so don't modify original
    d = new Date(this);
    d.setHours(0, 0, 0);
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    // Get first day of year
    var yearStart = new Date(d.getFullYear(), 0, 1);
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7) + 1;
    // Return array of year and week number
    return weekNo;
}
