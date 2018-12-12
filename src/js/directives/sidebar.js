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
            templateUrl: 'directives/sidebar.html',
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
    viewSidebar.prototype.setIcon = function (icon) {

        this.icon = icon;
        return this;
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
            new viewSidebar('control', 'Control', '#!control')
                .setIcon('wrench'),
            new viewSidebar('settings', 'Settings')
                .setIcon('cogs')
                .addItems([
                    new viewSidebar('wireless-network', 'Wireless Network', '#!settings/wireless-network')
                        .setIcon('signal'),
                    new viewSidebar('hardware-settings', 'Hardware Settings', '#!settings/hardware-settings')
                        .setIcon('wrench'),
                    new viewSidebar('mqtt-settings', 'MQTT Settings', '#!settings/mqtt-settings')
                        .setIcon('cog'),
                    new viewSidebar('ntp-time-settings', 'NTP (Time) Settings', '#!settings/ntp-time-settings')
                        .setIcon('cloud'),
                    new viewSidebar('update', 'Update', '#!settings/update')
                        .setIcon('upload')
                ])
        ];
    };


})();