var app = angular.module('RetrhoRoullete', []);

app.controller("ExerciseCtrl", function($scope) {
    initExerciseList();
    initCardDeck();

    function initExerciseList() {
        $scope.exercisesToAdd = 5;
        $scope.numberOfExercises = $scope.exercisesToAdd+1;
        $scope.exercises = [
            {name: "Skip reps", className: "default"}
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

    $scope.addExercise = function () {
        if (this.newExercise) {
            $scope.exercises.push({name: this.newExercise, className: "default"});
            this.newExercise = "";
        }
    }

    $scope.computeNextExercise = function() {
        initNow();
        $scope.nextExercise = getRandomExercise();
        $scope.exerciseHistory.push(angular.copy($scope.nextExercise));
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
            name: $scope.exercises[randomIndex].name,
            reps: $scope.cards[$scope.nextCard++],
            timeInSeconds: Math.floor(startTime / 1000)
        };
    }

    function initStartTime() {
        var currentTime = new Date().getTime();
        return currentTime - $scope.now;
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
