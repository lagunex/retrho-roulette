var app = angular.module('RetrhoRoulette', []);

app.controller("ExerciseCtrl", function($scope) {
    initExerciseList();
    initCardDeck();
    initRepsCategories();

    function initExerciseList() {
        $scope.exercisesToAdd = 5;
        $scope.numberOfExercises = $scope.exercisesToAdd+1;
        $scope.exercises = [ { name: "Skip reps", totalReps: 0 }];
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
            { name: 'Easy', reps: '2-4', className:"bg-success", icon: "easy-color.png" },
            { name: 'Normal', reps: '5-7', className:"bg-info", icon: "normal-color.png"},
            { name: 'Hard', reps: '8-10', className:"bg-warning", icon: "hard-color.png"},
            { name: 'Hero', reps: '15 or 20', className:"bg-danger", icon: "hero-color.png"}
        ];
    }

    $scope.addExercise = function () {
        if (this.newExercise) {
            $scope.exercises.push({ name: this.newExercise, totalReps: 0 });
            this.newExercise = "";
        }
    }

    $scope.deleteExercise = function(index) {
        $scope.exercises.splice(index,1);
    }

    $scope.computeNextExercise = function() {
        initNow();
        var nextReps = $scope.cards[$scope.nextCard++];
        var nextExercise = getRandomExercise(nextReps);
        var animator = new RouletteAnimator(nextExercise,
            function() {
                setNextExercise(nextExercise);
            }
        );
        animator.animateRoulette();
    }

    function initNow() {
        if (!$scope.now) {
            $scope.now = new Date().getTime();
        }
    }

    function getRandomExercise(nextReps) {
        var randomIndex = Math.floor(Math.random() * $scope.exercises.length);
        var startTime = getStartTime();
        return {
            id: randomIndex,
            name: $scope.exercises[randomIndex].name,
            reps: nextReps,
            timeInMilli: startTime
        };
    }

    function getStartTime() {
        var currentTime = new Date().getTime();
        return currentTime - $scope.now;
    }

    function setNextExercise(nextExercise) {
        $scope.exercises[nextExercise.id].totalReps += nextExercise.reps;
        $scope.nextExercise = nextExercise;
        $scope.exerciseHistory.unshift(angular.copy(nextExercise));
        $scope.$apply();
    }

    $scope.done = function() {
        var startTime = getStartTime();
        $scope.exerciseHistory.push({
            name: 'Done',
            reps: 0,
            timeInSeconds : Math.floor(startTime / 1000)
        });
        delete $scope.nextExercise;
        showResults();
    }

    function showResults() {
        $('#collapseTwo').collapse('hide');
        $('#collapseThree').collapse('show');
    }
});

