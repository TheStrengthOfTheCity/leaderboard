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
            endpoint: '',
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

        vm.setEndpoint = async function() {
            return new Promise ((resolve, reject) => {
                $http.get('config.json')
                .then(
                    function success (response) { resolve(response.data.endpoint); },
                    function failure (err) {console.error(err); return ''; }
                );
            });
        }

        vm.getEvents = async function () {
            
        }

        vm.getData = async function () {
            return new Promise ((resolve, reject) => {
                $http.get(vm.endpoint + 'observations/?score=true')
                .then(
                    function success(response) { resolve(response.data); }, 
                    function failure(err) { console.error(err); }
                );
            });
        }

        vm.updateData = async function () {
            vm.getData()
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

        vm.run = function () {
            vm.setEndpoint()
            .then ((endpoint) => {
                vm.endpoint = endpoint;
                
                vm.updateData();
                vm.updateData();

                setInterval(vm.updateData, 4000);
            });

            vm.getEvents()
            .then((events) => {

            });
        }

        vm.run();
    }
})();