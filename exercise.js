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
            { name: 'Easy', min: 2, max: 4,
                alertClass: 'alert-success', className:"bg-success", icon: "easy-color.png" },
            { name: 'Normal', min: 5, max: 7,
                alertClass: 'alert-info', className:"bg-info", icon: "normal-color.png"},
            { name: 'Hard', min: 8, max: 10,
                alertClass: 'alert-warning', className:"bg-warning", icon: "hard-color.png"},
            { name: 'Hero', min: 15, max: 20,
                alertClass: 'alert-danger', className:"bg-danger", icon: "hero-color.png"}
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
        var nextReps = getNextReps();
        var nextExercise = getRandomExercise(nextReps);
        var animator = new RouletteAnimator(nextReps.id, nextExercise.id);
        animator.animateCategories(function(){
            animator.animateExercises(function(){
                animator.animateProgressBar(function(){
                    setNextExercise(nextExercise);
                });
            });
        });
    }

    function getNextReps() {
        var reps = $scope.cards[$scope.nextCard++];
        var index = 0;
        $scope.repsCategories.forEach(function(cat, catIndex) {
            if (cat.min <= reps && cat.max >= reps) {
                index = catIndex;
            }
        });
        return { reps: reps, id: index};
    }

    function initNow() {
        //{{{
        if (!$scope.now) {
            $scope.now = new Date().getTime();
        }
        //}}}
    }

    function getRandomExercise(nextReps) {
        //{{{
        var randomIndex = Math.floor(Math.random() * $scope.exercises.length);
        var startTime = getStartTime();
        return {
            id: randomIndex,
            name: $scope.exercises[randomIndex].name,
            reps: nextReps.reps,
            timeInMilli: startTime,
            alertClass: $scope.repsCategories[nextReps.id].alertClass
        };
        //}}}
    }

    function getStartTime() {
        //{{{
        var currentTime = new Date().getTime();
        return currentTime - $scope.now;
        //}}}
    }

    function setNextExercise(nextExercise, categoryIndex) {
        //{{{
        $scope.exercises[nextExercise.id].totalReps += nextExercise.reps;
        $scope.nextExercise = nextExercise;
        $scope.exerciseHistory.unshift(angular.copy(nextExercise));
        $scope.$apply();
        //}}}
    }

    $scope.done = function() {
        //{{{
        var startTime = getStartTime();
        $scope.exerciseHistory.push({
            name: 'Done',
            reps: 0,
            timeInSeconds : Math.floor(startTime / 1000)
        });
        $scope.showTotals = true;
        delete $scope.nextExercise;
        showResults();
        //}}}
    }

    function showResults() {
        //{{{
        $('#collapseTwo').collapse('hide');
        $('#collapseThree').collapse('show');
        //}}}
    }
});

