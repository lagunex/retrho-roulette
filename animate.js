function DomAnimator(list, selectedIndex, classes, callback) {
    //{{{
    this.list = list;
    this.selectedIndex = selectedIndex;
    this.callback = callback;

    this.currentElement = 0;
    this.helper = {
        lapsRemaining: 5,
        time: 100,
        timeDuringLastLap: 300,
        classes: classes
    }

    this.animate = function() {
        this.resetCurrentElementClass();
        this.updateNextItemIndex();
        this.setActiveElement();

        if (this.helper.lapsRemaining || this.currentElement != this.selectedIndex) {
            var that = this;
            setTimeout(function(){that.animate();}, this.helper.time);
        } else {
            if (this.callback) {
                this.callback();
            }
        }
    }

    this.resetCurrentElementClass = function() {
        this.list[this.currentElement].className = this.helper.classes.unfocus;
    }

    this.updateNextItemIndex = function() {
        this.currentElement = (this.currentElement + 1) % this.list.length;
        if (this.currentElement == 0) {
            if (--this.helper.lapsRemaining == 0) {
                this.helper.time = this.helper.timeDuringLastLap;
            }
        }
    }

    this.setActiveElement = function() {
        var focusClass = '';
        if (this.helper.classes.focus.length == 1) {
            focusClass = this.helper.classes.focus[0];
        } else {
            focusClass = this.helper.classes.focus[this.currentElement];
        }
        this.list[this.currentElement].className = this.helper.classes.unfocus+' '+focusClass;
    }
    //}}}
}

function ProgressBarAnimator(categoryIndex,callback) {
    //{{{
    this.categoryIndex = categoryIndex;
    this.callback = callback;

    this.progressBarColors = [
        'progress-bar-success', 'progress-bar-info', 'progress-bar-warning', 'progress-bar-danger'
    ];

    this.animate = function() {
        var progressBarList = document.querySelectorAll('.progress')[0];
        // 2x + (54cards - x) = 100% => x = 46
        var increment = progressBarList.children.length <= 46 ? 2 : 1;
        var progressBarColor = this.progressBarColors[this.categoryIndex];
        var progressBarElement = this.createProgressBarElement(increment, progressBarColor);
        document.querySelectorAll('.progress')[0].appendChild(progressBarElement);
        if (this.callback) {
            this.callback();
        }
    }

    this.createProgressBarElement = function(percentage, colorClass) {
        var element = document.createElement('div');
        element.className = 'progress-bar '+colorClass;
        element.style.width = percentage+'%';
        return element;
    }

    this.setCategoryIndex = function(newIndex) {
        this.categoryIndex = newIndex;
    }
    //}}}
}

function RouletteAnimator(categoryIndex, exerciseIndex) {
    //{{{
    this.categoryIndex = categoryIndex;
    this.exerciseIndex = exerciseIndex;

    this.exerciseClasses = {
        unfocus: 'list-group-item',
        focus: [
            'list-group-item-success','list-group-item-info','list-group-item-warning','list-group-item-danger'
        ]
    };

    this.categoryClasses = {
        unfocus: 'col-xs-3 rep-category',
        focus: ['bg-success', 'bg-info', 'bg-warning', 'bg-danger'],
    };

    this.animateCategories = function(callback) {
        dom = document.getElementsByClassName(this.categoryClasses.unfocus);
        animator = new DomAnimator(dom, this.categoryIndex, this.categoryClasses, callback);
        animator.animate();
    }

    this.animateExercises = function(callback) {
        dom = document.querySelectorAll('#collapseTwo .'+this.exerciseClasses.unfocus);
        var classes = {
            unfocus: this.exerciseClasses.unfocus,
            focus: [this.exerciseClasses.focus[this.categoryIndex]]
        };
        animator = new DomAnimator(dom, this.exerciseIndex, classes, callback);
        animator.animate();
    }

    this.animateProgressBar = function(callback) {
        var animator = new ProgressBarAnimator(this.categoryIndex, callback);
        animator.animate();
    }
    //}}}
}
