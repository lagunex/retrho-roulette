function RouletteAnimator(nextExercise, callback) {
    this.exerciseHelper = {
            nextItemList: 0,
            lapsRemaining: 3,
            time: 100,
            timeDuringLastLap: 300,
            nextExercise: nextExercise
    };
    this.categoryHelper = {
        nextItemList: 0,
        lapsRemaining: 5,
        time: 100,
        timeDuringLastLap: 300,
        reps: nextExercise.reps
    }
    this.callback = callback;

    this.exerciseClasses = {
        item: 'list-group-item',
        active: 'active',
        success: 'list-group-item-success'
    };
    this.categoryClasses = {
        item: 'col-xs-6 rep-category',
        classes: ['bg-success', 'bg-info', 'bg-warning', 'bg-danger'],
        ranges: [
            {min: 2, max: 4}, {min: 5, max: 7}, {min: 8, max: 10}, {min: 15, max: 20}
        ]
    };

    this.animateRoulette = function() {
        this.animateCategories();
    }

    this.animateCategories = function() {
        var helper = this.categoryHelper;
        var classes = this.categoryClasses;
        var categoryListDom = document.getElementsByClassName(classes.item);

        this.resetCurrentElementClass(categoryListDom, helper, classes);
        this.updateNextItemIndex(categoryListDom, helper, classes);
        this.setActiveElement(categoryListDom, helper,
            classes.item, classes.classes[helper.nextItemList]
        );

        if (helper.lapsRemaining ||
                !(classes.ranges[helper.nextItemList].min <= helper.reps &&
                  classes.ranges[helper.nextItemList].max >= helper.reps)) {
            var that = this;
            setTimeout(function(){that.animateCategories();}, helper.time);
        } else {
            this.animateExerciseList();
        }
    }

    this.resetCurrentElementClass = function(listDom, helper, classes) {
        listDom[helper.nextItemList].className = classes.item;
    }

    this.updateNextItemIndex = function(listDom, helper, classes) {
        helper.nextItemList =
            (helper.nextItemList + 1) % listDom.length;
        if (helper.nextItemList == 0) {
            if (--helper.lapsRemaining == 0) {
                helper.time = helper.timeDuringLastLap;
            }
        }
    }

    this.setActiveElement = function(listDom, helper, regularClass, activeClass) {
        listDom[helper.nextItemList].className = regularClass+' '+activeClass;
    }

    this.animateExerciseList = function() {
        var helper = this.exerciseHelper;
        var classes = this.exerciseClasses;
        var exerciseListDom = document.getElementsByClassName(classes.item);

        this.resetCurrentElementClass(exerciseListDom, helper, classes);
        this.updateNextItemIndex(exerciseListDom, helper, classes);
        this.setActiveElement(exerciseListDom, helper, classes.item, classes.active);

        if (helper.lapsRemaining ||
                helper.nextItemList != helper.nextExercise.id) {
            var that = this;
            setTimeout(function(){that.animateExerciseList();}, helper.time);
        } else {
            this.setActiveElement(exerciseListDom, helper, classes.item, classes.success);
            this.callback();
        }
    }
}
