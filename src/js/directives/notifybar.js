(function () {

    'use strict';
    angular
        .module('app.directives')
        .directive('ngNotifybar', directive);

    directive.$inject = ['$rootScope', '$interval'];

    function directive($rootScope, $interval) {

        var directive = {
            link: link,
            template:
                ['<div class="angular-notify angular-notify-{{::notification.type}} angular-notify-enter" data-ng-repeat="notification in notifications">',
                    '<p class="title" data-ng-bind="::notification.title"></p>',
                    '<p class="notify-content" data-ng-bind="::notification.content"></p>',
                    '<div/>'
                ].join(''),
            scope: {},
            restrict: 'A'
        };
        return directive;

        function link($scope, element, attr) {

            element.css('position', 'fixed');
            $scope.notifications = [];

            var interval = null;

            $rootScope.$on('notify', function (event, json) {

                var notification = new viewNotification(json);
                $scope.notifications.push(notification);

                if (interval)
                    return;

                interval = $interval(function () {

                    var now = new Date();
                    for (var index = 0; index < $scope.notifications.length; index++) {

                        if ($scope.notifications[index].timeoutTime < now)
                            $scope.notifications.splice(index--, 1);
                    }

                    if (!$scope.notifications.length) {

                        $interval.cancel(interval);
                        interval = null;
                    }
                }, 1000);
            });
        }
    }

    var viewNotification = function (json) {

        this.type = json.type;
        this.title = json.title;
        this.content = json.content;

        var timeoutTime = new Date();
        timeoutTime.setMilliseconds(timeoutTime.getMilliseconds() + json.timeout);

        this.timeoutTime = timeoutTime;
    };

})();