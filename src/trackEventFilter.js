(function(){
    angular.module('angul3rytics').filter('trackEvent', function(Angul3rytics) {
        return function(entry, category, action, opt_label, opt_value, opt_noninteraction) {
            Angul3rytics.trackEvent(category, action, opt_label, opt_value, opt_noninteraction);
            return entry;
        }
    });
})();
