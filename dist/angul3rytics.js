(function () {
    angular.module('angul3rytics', []).provider('Angul3rytics', function () {
        var eventHandlersNames = ['Google'];
        this.setEventHandlers = function (handlers) {
            if (angular.isString(handlers)) {
                handlers = [handlers];
            }
            eventHandlersNames = [];
            angular.forEach(handlers, function (handler) {
                eventHandlersNames.push(capitalizeHandler(handler));
            });
        };
        var capitalizeHandler = function (handler) {
            return handler.charAt(0).toUpperCase() + handler.substring(1);
        };
        var pageChangeEvent = '$locationChangeSuccess';
        this.setPageChangeEvent = function (newPageChangeEvent) {
            pageChangeEvent = newPageChangeEvent;
        };
        this.$get = [
            '$injector',
            '$rootScope',
            '$location',
            function ($injector, $rootScope, $location) {
                var eventHandlers = [];
                angular.forEach(eventHandlersNames, function (handler) {
                    eventHandlers.push($injector.get('Angul3rytics' + handler + 'Handler'));
                });
                var forEachHandlerDo = function (action) {
                    angular.forEach(eventHandlers, function (handler) {
                        action(handler);
                    });
                };
                var service = {};
                service.init = function () {
                };
                service.trackEvent = function (category, action, opt_label, opt_value, opt_noninteraction) {
                    forEachHandlerDo(function (handler) {
                        if (category && action) {
                            handler.trackEvent(category, action, opt_label, opt_value, opt_noninteraction);
                        }
                    });
                };
                service.trackPageView = function (url) {
                    forEachHandlerDo(function (handler) {
                        if (url) {
                            handler.trackPageView(url);
                        }
                    });
                };
                $rootScope.$on(pageChangeEvent, function () {
                    service.trackPageView($location.url());
                });

                //BE added for ecommerce order tracking
                service.trackEcommerceTrans = function (transactionId, affiliation, total, tax, shipping, city, state, country) {
                    forEachHandlerDo(function (handler) {
                        if (transactionId) {
                            handler.trackEcommerceTrans(transactionId, affiliation, total, tax, shipping, city, state, country);
                        }
                    });
                };
                //BE added for ecommerce item tracking
                service.trackEcommerceItem = function (transactionId, sku, name, category, price, quantity) {
                    forEachHandlerDo(function (handler) {
                        if (transactionId) {
                            handler.trackEcommerceItem(transactionId, sku, name, category, price, quantity);
                        }
                    });
                };
                //BE added for ecommerce item tracking
                service.pushTransaction = function () {
                    forEachHandlerDo(function (handler) {
                        handler.pushTransaction();
                    });
                };

                return service;
            }
        ];
    });
}());
(function () {
    angular.module('angul3rytics').factory('Angul3ryticsConsoleHandler', [
        '$log',
        function ($log) {
            var service = {};
            service.trackPageView = function (url) {
                $log.log('URL visited', url);
            };
            service.trackEvent = function (category, action, opt_label, opt_value, opt_noninteraction) {
                $log.log('Event tracked', category, action, opt_label, opt_value, opt_noninteraction);
            };

            //BE added for ecommerce order tracking
            service.trackEcommerceTrans = function (transactionId, affiliation, total, tax, shipping, city, state, country) {
                $log.log('TRANSACTION Tracked', transactionId, affiliation, total, tax, shipping, city, state, country);
            };
            //BE added for ecommerce item tracking
            service.trackEcommerceItem = function (transactionId, sku, name, category, price, quantity) {
                $log.log('ITEM Tracked', transactionId, sku, name, category, price, quantity);
            };
            //BE added for ecommerce transaction push
            service.pushTransaction = function () {
                $log.log('TRANSACTION Pushed', 'Success!');
            };

            return service;
        }
    ]);
}());
(function () {
    angular.module('angul3rytics').factory('Angul3ryticsGoogleHandler', [
        '$log',
        function ($log) {
            var service = {};
            service.trackPageView = function (url) {
                _gaq.push([
                    '_set',
                    'page',
                    url
                ]);
                _gaq.push([
                    '_trackPageview',
                    url
                ]);
            };
            service.trackEvent = function (category, action, opt_label, opt_value, opt_noninteraction) {
                _gaq.push([
                    '_trackEvent',
                    category,
                    action,
                    opt_label,
                    opt_value,
                    opt_noninteraction
                ]);
            };

            //BE added for ecommerce order tracking
            //(transactionId, affiliation, total, tax, shipping, city, state, country)
            service.trackEcommerceTrans = function (transactionId, affiliation, total, tax, shipping, city, state, country) {
                _gaq.push([
                    '_addTrans',
                    transactionId,
                    affiliation,
                    total,
                    tax,
                    shipping,
                    city,
                    state,
                    country
                ]);
            };
            //BE added for ecommerce item tracking
            //(transactionId, sku, name, category, price, quantity)
            service.trackEcommerceItem = function (transactionId, sku, name, category, price, quantity) {
                _gaq.push([
                    '_addItem',
                    transactionId,
                    sku,
                    name,
                    category,
                    price,
                    quantity
                ]);
            };
            //BE added for ecommerce transaction push
            service.pushTransaction = function () {
                _gaq.push(['_trackTrans']);
            };

            return service;
        }
    ]).factory('Angul3ryticsGoogleUniversalHandler', function () {
        var service = {};
        service.trackPageView = function (url) {
            ga('set', 'page', url);
            ga('send', 'pageview', url);
        };
        service.trackEvent = function (category, action, opt_label, opt_value, opt_noninteraction) {
            ga('send', 'event', category, action, opt_label, opt_value, { 'nonInteraction': opt_noninteraction });
        };
        return service;
    });
}());
(function () {
    angular.module('angul3rytics').filter('trackEvent', [
        'Angul3rytics',
        function (Angul3rytics) {
            return function (entry, category, action, opt_label, opt_value, opt_noninteraction) {
                Angul3rytics.trackEvent(category, action, opt_label, opt_value, opt_noninteraction);
                return entry;
            };
        }
    ]);
    //BE added for ecommerce order tracking
    angular.module('angul3rytics').filter('trackEcommerceTrans', [
        'Angul3rytics',
        function (Angul3rytics) {
            return function (entry, transactionId, affiliation, total, tax, shipping, city, state, country) {
                Angul3rytics.trackEcommerceTrans(transactionId, affiliation, total, tax, shipping, city, state, country);
                return entry;
            };
        }
    ]);
    //BE added for ecommerce item tracking
    angular.module('angul3rytics').filter('trackEcommerceItem', [
        'Angul3rytics',
        function (Angul3rytics) {
            return function (entry, transactionId, sku, name, category, price, quantity) {
                Angul3rytics.trackEcommerceTrans(transactionId, sku, name, category, price, quantity);
                return entry;
            };
        }
    ]);
    //BE added for ecommerce item tracking
    angular.module('angul3rytics').filter('pushTransaction', [
        'Angul3rytics',
        function (Angul3rytics) {
            return function (entry) {
                Angul3rytics.pushTransaction();
                return entry;
            };
        }
    ]);
}());