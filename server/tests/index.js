'use strict'

let entryFile;
const index = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Jasmine Spec Runner</title><link rel="stylesheet"href="https://cdnjs.cloudflare.com/ajax/libs/jasmine/2.4.1/jasmine.css" media="screen" title="no title" charset="utf-8"><script src="https://cdnjs.cloudflare.com/ajax/libs/jasmine/2.4.1/jasmine.js" charset="utf-8"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/jasmine/2.4.1/jasmine-html.js" charset="utf-8"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/jasmine/2.4.1/boot.js" charset="utf-8"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.7/angular.js"></script><script src="https://code.angularjs.org/1.3.5/angular-mocks.js"></script><script src="'+ entryFile + '"></script><script src="spec.js" charset="utf-8"></script></head><body></body></html>';

module.exports = {
  getIndex(file) {
    console.log('Entry file', entryFile);
    return '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Jasmine Spec Runner</title><link rel="stylesheet"href="https://cdnjs.cloudflare.com/ajax/libs/jasmine/2.4.1/jasmine.css" media="screen" title="no title" charset="utf-8"><script src="https://cdnjs.cloudflare.com/ajax/libs/jasmine/2.4.1/jasmine.js" charset="utf-8"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/jasmine/2.4.1/jasmine-html.js" charset="utf-8"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/jasmine/2.4.1/boot.js" charset="utf-8"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.7/angular.js"></script><script src="https://code.angularjs.org/1.3.5/angular-mocks.js"></script></head><body><script src="'+ file + '"></script><script src="spec.js" charset="utf-8"></script></body></html>';
  }
};
