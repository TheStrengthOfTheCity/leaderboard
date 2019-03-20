(function () {

    'use strict';

    // creates an angular module called leaderboard - bound to body through ng-app directive
    var app = angular.module('leaderboard', []);

    // creating controller
    app.controller('Main', control);

    // Inject the $http service. Need $http to make HTTP requests to the API
    control.$inject = ['$http'];

    // Pass any injected services to the controller constructor function
    function control($http) {

        var vm = angular.extend(this, {
            title: 'The Strength Of The City',
            events: [],
            activities: [],
            scores: [],
            base: '',
            sortColumn: '',
            reverseSort: false
        });

        vm.sortData = function (column) {
            vm.reverseSort = (vm.sortColumn == column) ? !vm.reverseSort : false;
            vm.sortColumn = column;
        }

        vm.getSortClass = function (column) {
            if (vm.sortColumn == column) {
                return vm.reverseSort ? 'arrowDown' : 'arrowUp';
            }

            return '';
        }
        
        vm.getData = async function (endpoint) {
            return new Promise ((resolve, reject) => {
                $http.get(vm.base + endpoint)
                .then(
                    function success(response) { resolve(response.data); }, 
                    function failure(err) { console.error(err); }
                );
            });
        }

        vm.updateScores = function () {
            vm.getData('observations/?score=true')
            .then((data) => {
                
                for (var i = 0; i < data.length; i++) {
                    data[i].score = parseFloat(data[i].score);
                }

                vm.scores = data;
            })
            .catch((err) => {
                console.error(err);
            });
        }

        vm.refresh = function () {
            vm.updateScores();

            vm.getData('events/')
            .then((events) => {
                for (var i = 0; i < events.length; i++) {
                    if (vm.events.includes(events[i].name) == false)
                        vm.events.push(events[i].name);
                }
            })
            .catch((err) => { console.error(err); });

            vm.getData('activities/')
            .then((activities) => {
                for (var i = 0; i < activities.length; i++) {
                    if (vm.activities.includes(activities[i].name) == false)
                        vm.activities.push(activities[i].name);
                }
            })
            .catch((err) => { console.error(err); });
        }

        vm.run = function () {
            vm.getData('config.json')
            .then ((data) => {
                vm.base = data.base;

                vm.sortColumn = 'rank';

                vm.updateScores();
                vm.updateScores();

                vm.getData('events/')
                .then((events) => {
                    for (var i = 0; i < events.length; i++) {
                        vm.events.push(events[i].name);
                    }
                })
                .catch((err) => { console.error(err); });

                vm.getData('activities/')
                .then((activities) => {
                    for (var i = 0; i < activities.length; i++) {
                        vm.activities.push(activities[i].name);
                    }
                })
                .catch((err) => { console.error(err); });

                setInterval(vm.refresh, 3000);
            });
        }

        vm.run();
    }
})();