"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenException = exports.InternalServerErrorException = exports.ConflictException = exports.NotFoundException = exports.UnAuthorizedException = exports.BadRequestException = exports.ApplicationException = void 0;
class ApplicationException extends Error {
    status;
    data;
    constructor(message, status, data) {
        super(message);
        this.status = status;
        this.data = data;
    }
}
exports.ApplicationException = ApplicationException;
class BadRequestException extends ApplicationException {
    constructor(message, data) {
        super(message, 400, data);
    }
}
exports.BadRequestException = BadRequestException;
class UnAuthorizedException extends ApplicationException {
    constructor(message, data) {
        super(message, 401, data);
    }
}
exports.UnAuthorizedException = UnAuthorizedException;
class NotFoundException extends ApplicationException {
    constructor(message, data) {
        super(message, 404, data);
    }
}
exports.NotFoundException = NotFoundException;
class ConflictException extends ApplicationException {
    constructor(message, data) {
        super(message, 409, data);
    }
}
exports.ConflictException = ConflictException;
class InternalServerErrorException extends ApplicationException {
    constructor(message, data) {
        super(message, 500, data);
    }
}
exports.InternalServerErrorException = InternalServerErrorException;
class ForbiddenException extends ApplicationException {
    constructor(message, data) {
        super(message, 403, data);
    }
}
exports.ForbiddenException = ForbiddenException;
