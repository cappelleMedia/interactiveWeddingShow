/**
 * Created by Jens on 19-Oct-16.
 */

class BaseController {
    constructor(model) {
        this.model = model;
    }

    addObj(data, callback) {
        let self = this;
        let validationErrors = "";
        let newObj = null;
        newObj = new this.model(data);
        newObj.save(function (err) {
            if (err) {
                if (err.name === 'ValidationError') {
                    validationErrors = self.handleValidationErrors(err);
                }
                return callback(err, 400, validationErrors);
            }
            callback(err, newObj, null);
        });
    }

    getAll(limit, skip, callback) {
        this.model
            .find()
            .skip(skip)
            .limit(limit)
            .exec(function (err, objects) {
                if (err) {
                    callback(err, 500);
                } else {
                    if (!objects || !objects.length) {
                        callback(err, 404);
                    } else {
                        callback(err, objects);
                    }
                }
            });
    }

    getOne(id, callback) {
        this.model
            .findById(id)
            .exec(function (err, obj) {
                BaseController.getResult(err, obj, callback);
            });
    }

    delete(jwt, id, callback) {
        //TODO check jwt == admin then delete
    }

    handleValidationErrors(err) {
        console.log('should be overridden by subclass');
        console.log(err);
        //should be overridden by all subs
        // throw TypeError('not implemented, should be implemented by subclass');
    }

    static getResult(err, value, callback) {
        if (!value) {
            callback(err, 404);
        } else {
            callback(err, value);
        }
    }
}

module.exports = BaseController;