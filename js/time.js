/*时间转换函数*/
    function getCurrentDate(data) {
         var date = new Date(data);
         var monthArray=new Array
         ("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug",
         "Sep","Oct","Nov","Dec");
         var weekArray = new Array("Sun","Mon","Tue",
              "Wed","Thu","Fri","Sat");
         month=date.getMonth();
         day=date.getDate();
         if(day.toString().length == 1){
             day="0"+day.toString();
         }
         var time = weekArray[date.getDay()]+" "+day+" "+monthArray[month]+". "+
             date.getFullYear() ;
         	 return time;   
    }
