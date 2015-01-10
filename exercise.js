var app = angular.module('RetrhoRoullete', []);

app.controller("ExerciseCtrl", function($scope) {
    initExerciseList();
    initCardDeck();
    initRepsCategories();

    function initExerciseList() {
        $scope.exercisesToAdd = 5;
        $scope.numberOfExercises = $scope.exercisesToAdd+1;
        $scope.exercises = [
            {name: "Skip reps", className: classes.item}
        ];
        $scope.exerciseHistory = [];
    }

    function initCardDeck() {
        $scope.nextCard = 0;
        $scope.cards = [
            20, 20, // jokers
            2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 15,
            2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 15,
            2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 15,
            2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 15
        ];
        util.shuffle($scope.cards);
    }

    function initRepsCategories() {
        $scope.repsCategories = [
            { name: 'Easy', reps: '2-4', className:"bg-success" },
            { name: 'Normal', reps: '5-7', className:"bg-info"},
            { name: 'Hard', reps: '8-10', className:"bg-warning"},
            { name: 'Hero', reps: '15 0', className:"bg-danger"}
        ];
    }

    $scope.addExercise = function () {
        if (this.newExercise) {
            $scope.exercises.push({name: this.newExercise, className: classes.item});
            this.newExercise = "";
        }
    }

    $scope.deleteExercise = function(index) {
        $scope.exercises.splice(index,1);
    }

    $scope.computeNextExercise = function() {
        initNow();
        var nextExercise = getRandomExercise();
        initAnimateHelper(nextExercise);
        animateExerciseList();
    }

    function initNow() {
        if (!$scope.now) {
            $scope.now = new Date().getTime();
        }
    }

    function getRandomExercise() {
        var randomIndex = Math.floor(Math.random() * $scope.exercises.length);
        var startTime = initStartTime();
        return {
            id: randomIndex,
            name: $scope.exercises[randomIndex].name,
            reps: $scope.cards[$scope.nextCard++],
            timeInSeconds: Math.floor(startTime / 1000)
        };
    }

    function initStartTime() {
        var currentTime = new Date().getTime();
        return currentTime - $scope.now;
    }

    function initAnimateHelper(nextExercise) {
        animateHelper = {
            nextItemList: 0,
            lapsRemaining: 3,
            time: 100,
            timeDuringLastLap: 300,
            nextExercise: nextExercise
        };
    }

    function animateExerciseList() {
        var exerciseListDom = document.getElementsByClassName(classes.item);
        exerciseListDom[animateHelper.nextItemList].className = classes.item;

        animateHelper.nextItemList = (animateHelper.nextItemList + 1) % $scope.exercises.length;
        if (animateHelper.nextItemList == 0) {
            if (--animateHelper.lapsRemaining == 0) {
                animateHelper.time = animateHelper.timeDuringLastLap;
            }
        }

        exerciseListDom[animateHelper.nextItemList].className = classes.item+' '+classes.active;

        if (animateHelper.lapsRemaining ||
                animateHelper.nextItemList != animateHelper.nextExercise.id) {
            setTimeout(animateExerciseList, animateHelper.time);
        } else {
            exerciseListDom[animateHelper.nextItemList].className =
                classes.item+' '+classes.success;
            setNextExercise(animateHelper.nextExercise);
        }
    }

    function setNextExercise(nextExercise) {
        $scope.nextExercise = nextExercise;
        $scope.exerciseHistory.push(angular.copy(nextExercise));
        $scope.$apply();
    }

    $scope.done = function() {
        var startTime = initStartTime();
        $scope.exerciseHistory.push({
            name: 'Done',
            reps: 0,
            timeInSeconds : Math.floor(startTime / 1000)
        });
        delete $scope.nextExercise;
    }
});

var classes = {
    item: 'list-group-item',
    active: 'active',
    success: 'list-group-item-success'
};

var animateHelper = {};

var util = {};
util.shuffle = function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex ;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};
