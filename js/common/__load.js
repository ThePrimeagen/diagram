// No reason for common to exist separate from lib right?
require([
    'js/common/data',
    'js/common/methods'
], function() {
    console.log('js/common/__load');
});