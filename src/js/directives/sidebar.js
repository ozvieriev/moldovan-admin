(function () {
    'use strict';

    angular
        .module('app.directives')
        .directive('ngSidebar', directive);

    function directive() {

        return {
            link: link,
            restrict: 'A',
            replace: true,
            templateUrl: 'ui/directives/sidebar.html',
            scope: {}
        };

        function link(scope, element, attrs) {

            scope.items = viewSidebarBuilder.build();
        }
    };

    var viewSidebar = function (id, title, href) {

        this.id = id;
        this.title = title;
        this.href = href || null;
        this.items = [];
    };
    viewSidebar.prototype.addItems = function (items) {

        angular.forEach(items, function (item) {
            this.push(item);
        }, this.items);

        return this;
    };

    var viewSidebarBuilder = function () { };
    viewSidebarBuilder.build = function () {

        return [
            new viewSidebar('control', 'Control', '#!control'),
            new viewSidebar('settings', 'Settings')
                .addItems([
                    new viewSidebar('wireless-network', 'Wireless Network', '#!settings/wireless-network'),
                    new viewSidebar('hardware-settings', 'Hardware Settings', '#!settings/hardware-settings'),
                    new viewSidebar('mqtt-settings', 'MQTT Settings', '#!settings/mqtt-settings'),
                    new viewSidebar('ntp-time-settings', 'NTP (Time) Settings', '#!settings/ntp-time-settings'),
                    new viewSidebar('update', 'Update', '#!settings/update')
                ])
        ];
    };


})();