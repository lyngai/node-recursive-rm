'use strict';

var fs = require('fs');
var path = require('path');

var errors = {
    ROOT_PATH_REQUIRED: 1,
    UNSAFE_OPERATION: 2,
};

var msgs = {
    1: 'RootPath cannot be null under safeDelete mode',
    2: 'Danger: Not a valid path for remove operation',
};

function handleError(error) {
    console.error(error);
}

module.exports = {

    removeDir: function (_path, safeDelete = true, rootPath = null, callback) {
        var errorHandle = (callback instanceof Function) ? callback : handleError;
        if (safeDelete) {
            if (rootPath == null) {
                errorHandle({
                    code: errors.ROOT_PATH_REQUIRED,
                    Error: msgs[errors.ROOT_PATH_REQUIRED],
                });
                return;
            }
            var pathInfo = path.parse(_path);
            if (!_path.startsWith(rootPath) || (pathInfo.root === pathInfo.dir && pathInfo.base === '' && pathInfo.name === '')) {
                errorHandle({
                    code: errors.UNSAFE_OPERATION,
                    Error: msgs[errors.UNSAFE_OPERATION],
                });
                return;
            }
        }
        var del = function (dir) {
            var files = fs.readdirSync(dir);
            if(files.length === 0) {
                console.info('remove dir', dir);
                fs.rmdirSync(dir);
                return;
            }
            files.map(function (file) {
                var __path = path.join(dir, file);
                var stat = fs.statSync(__path);
                if (stat.isFile()) {
                    console.info(' delete file', __path);
                    fs.unlinkSync(__path);
                } else {
                    del(__path);
                }
            });
            console.info('remove dir', dir);
            fs.rmdirSync(dir);
        }

        try{
            del(_path);
        } catch (err) {
            errorHandle(err);
        }
    },

    promises: {

        removeDir: function (_path, safeDelete = true, rootPath = null) {
            return new Promise(function (resolve, reject) {
                if (safeDelete) {
                    if (rootPath == null) {
                        reject({
                            code: errors.ROOT_PATH_REQUIRED,
                            Error: msgs[errors.ROOT_PATH_REQUIRED],
                        });
                        return;
                    }
                    var pathInfo = path.parse(_path);
                    if (!_path.startsWith(rootPath) || (pathInfo.root === pathInfo.dir && pathInfo.base === '' && pathInfo.name === '')) {
                        reject({
                            code: errors.UNSAFE_OPERATION,
                            Error: msgs[errors.UNSAFE_OPERATION],
                        });
                        return;
                    }
                }
                var del = function (dir) {
                    var files = fs.readdirSync(dir);
                    if(files.length === 0) {
                        console.info('remove dir', dir);
                        fs.rmdirSync(dir);
                        return;
                    }
                    files.map(function (file) {
                        var __path = path.join(dir, file);
                        var stat = fs.statSync(__path);
                        if (stat.isFile()) {
                            console.info(' delete file', __path);
                            fs.unlinkSync(__path);
                        } else {
                            del(__path);
                        }
                    });
                    console.info('remove dir', dir);
                    fs.rmdirSync(dir);
                }

                try{
                    del(_path);
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        },
    },

    errors: errors,

};
