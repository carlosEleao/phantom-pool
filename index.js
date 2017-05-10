const phantom = require("phantom");
const phantomjs = require('phantomjs-prebuilt');
const sleep = require('thread-sleep');


function phantomPool() {

    let _size;
    let _pool = [];

    function createPool(size) {
        for (let i = 0; i < _size; i++) {
            _pool[i] = {
                instance: _createPhantom(),
                inUse: false
            }
        }
    }

    function getInstance() {
        return new Promise((resolve, reject) => {
            while (true) {
                for (let i = 0; i < _size; i++) {
                    if (_pool[i].inUse === false) {
                        _pool[i].inUse = true;
                        return _pool[i]
                    }
                }
                sleep(1000);
            }
        });
    }

    function releseInstance(phantom) {
        return new Promise(() => {
            _pool.forEach((item) => {
                if (Object.is(item.instance, phantom)) {
                    item.inUse = false;
                }
            });
        });
    }

    function _createPhantom() {
        return phantom.create(['--ignore-ssl-errors=yes', '--load-images=no'], {
            phantomPath: phantomjs.path
        });
    }
}

module.expots = phantomPool;