myApp.controller('myCtrl', function ($scope, $location) {

    //----------enable/disenable enter-exit----------
    var lastEvent = JSON.parse(localStorage.getItem(localStorage.length - 1));
    if (lastEvent == null || lastEvent.activity=="EndTime")
        $scope.enableEnter = true;
    else $scope.enableEnter = false;
    //--------------------routing----------------------
    $scope.Route = function (pageName) {
        $scope.page = pageName;
        $location.path(pageName);
    };
    //--------------------initalazing----------------------
    $scope.EnterMessage = "Good Morning! Have A graet Day!";
    $scope.ExitMessage = "Good Buy!";
    $scope.timesArr = [];
    $scope.insertedTime;
    $scope.enterTime;
    $scope.exitTime;
    
    //----work's hours per work-day for statistics
    var fewHours = 2;
    var normalHours = 5;
    var longHours = 8;
    //---cnt for work's hours per work-day for statistics
    var cntFewHours = 0;
    var cntNormalHours = 0;
    var cntLongHours = 0;

    //-----------saves user's start-work's date & hour--------------
    $scope.SaveEnter = function (time) {//gets input time from data-picker
        localStorage.setItem(localStorage.length, JSON.stringify({ activity: "StartTime",
            date: new Date().toLocaleDateString(),
            Hour: new Date(time).toLocaleTimeString(),
            Time: Date(time)
        }))
        //------------------changing alements' visibility---------------
        $scope.isEnter = false;
        $scope.enableEnter = false;
        $scope.enableExit = true;
    }
    //-----------saves user's end-work's date & hour-------------
    $scope.ExitSave = function (time) {
        $scope.isExit = false;
        $scope.enableExit = false;
        $scope.enableEnter = true;
        $scope.showText = true;
        var Stime = new Date(JSON.parse(localStorage[localStorage.length - 1]).Time).getTime();
        var Etime = new Date(time).getTime();
        
        if((Stime>12&&Stime<=23)&&(Etime>=0&&Etime<12))
        {
            Etime += 24;
        }
        //--calc work hours per day
        var calc = (Etime - Stime) / 1000 / 60;
        var cntHours = Math.floor(calc / 60);
        if (calc < 0) {
            $scope.outMessage = "Wrong Time! Please Insert Exit Time Again";
            $scope.enableEnter = false;
        } 
        else {
            $scope.outMessage = "Good bye! Today You Worked " + Math.floor(calc / 60) + " Hours And " + Math.floor(calc % 60) + " Minutes!"
            localStorage.setItem(localStorage.length, JSON.stringify({
                activity: "EndTime",
                date: new Date().toLocaleDateString(),
                Hour: new Date(time).toLocaleTimeString(),
                Time: Date(time), Calc: calc
            }))
        }
        
    }


   
});