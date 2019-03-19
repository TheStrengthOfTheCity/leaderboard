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
            scores: [],
            endpoint: ''
        });

        var setEndpoint = async function() {
            return new Promise ((resolve, reject) => {
                $http.get('config.json')
                .then(
                    function success (response) { resolve(response.data.endpoint); },
                    function failure (err) {console.error(err); return ''; }
                );
            });
        }

        var getData = async function () {
            return new Promise ((resolve, reject) => {
                $http.get(vm.endpoint + 'observations/?score=true')
                .then(
                    function success(response) { resolve(response.data); }, 
                    function failure(err) { console.error(err); }
                );
            });
        }

        var updateData = async function () {
            getData()
            .then((data) => {
                vm.scores = data;
            })
            .catch((err) => {
                console.error(err);
            });
        }

        var run = function () {
            setEndpoint()
            .then ((endpoint) => {
                vm.endpoint = endpoint;
                
                updateData();
                updateData();

                setInterval(updateData, 4000);
            });
        }

        run();
    }
})();