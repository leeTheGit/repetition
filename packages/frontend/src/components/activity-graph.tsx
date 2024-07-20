import React from 'react'


export const ActivityGraph = () => {


  
        /*** draw months ***/ 
        
        const calendar = {
            "january": 31,
            "february": 28,
            "march": 31,
            "april": 30,
            "may": 31,
            "june": 30,
            "july": 31,
            "august": 31,
            "september": 30,
            "october": 31,
            "november": 30,
            "december": 31,
        }

        // var month = moment();
    //     var outputMonth = "<ol class = 'month'>";
    //     for (i = 0; i <= 12; i++) {
    //       var durationMonth = moment.duration({'months' : 1});
    //       outputMonth += "<li>";
    //       outputMonth += moment(month).format("MMM");
    //       outputMonth += "</li>";
    //       month = moment(month).subtract(durationMonth);
    //     }
    //     outputMonth += "</ol>";
        
    //     var output = "<ol><div class = 'week'>";
    //     var day = moment();
        
    //     /* Calculate the offset for days of the week to line up correctly */
    //     var dayOfWeekOffset = 6 - (parseInt(moment().format("d"),10));
    //     for (i = 0; i < (dayOfWeekOffset); i++) { output += "<li class = 'offset'></li>"; }
        
    //     /*** draw calendar ***/
        
    //     for (i = 365; i >= 0; i--) {
    //       output += "<li>";
    //       output += '<span class = "tooltip">' + moment(day).format("MM-DD-YY")  +  '</span>';
    //       output += "</li>";
          
    //       var duration = moment.duration({'days' : 1});
    //       day = moment(day).subtract(duration);
    //     }
        
    //     output += "</div></ol>";
    //     document.getElementById("month").innerHTML = outputMonth;
    //     document.getElementById("days").innerHTML = output;


    return (
        <div className = "activity-chart">
        <h1>Github-like Achievements Calendar</h1>
          <ol className = "days-of-week">
            <li>M</li>
            <li>W</li>
            <li>F</li>
          </ol>
        <div id = "month" className="month"></div>
        <div id = "days" className = "days"></div>
        <div className = "key">
        <span>Less</span>
        <ul>
          <li className = "activity-four"></li>
          <li className = "activity-three"></li>
          <li className = "activity-two"></li>
          <li className = "activity"></li>
          <li className = "day-key"></li>
        </ul>
        <span>More</span>
        </div>
      </div>
    )

}