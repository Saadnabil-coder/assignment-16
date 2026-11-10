"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseRepository = void 0;
class DatabaseRepository {
    Model;
    constructor(Model) {
        this.Model = Model;
    }
    async create(data) {
        return await this.Model.create(data);
    }
    async findById({ id, select, populate, lean, }) {
        let query = this.Model.findById(id);
        if (select) {
            query = query.select(select);
        }
        if (populate) {
            query = query.populate(populate);
        }
        if (lean) {
            query = query.lean();
        }
        return await query;
    }
    async findOne({ filter, select, populate, lean, }) {
        let query = this.Model.findOne(filter);
        if (select) {
            query = query.select(select);
        }
        if (populate) {
            query = query.populate(populate);
        }
        if (lean) {
            query = query.lean();
        }
        return await query;
    }
    async findAll({ filter, select, populate, lean, }) {
        let query = this.Model.find(filter || {});
        if (select) {
            query = query.select(select);
        }
        if (populate) {
            query = query.populate(populate);
        }
        if (lean) {
            query = query.lean();
        }
        return await query;
    }
    async updateOne({ filter, data }) {
        return await this.Model.updateOne(filter, data);
    }
    async findByIdAndUpdate({ id, data, select, populate, lean, }) {
        let query = this.Model.findByIdAndUpdate(id, data, {
            new: true,
        });
        if (select) {
            query = query.select(select);
        }
        if (populate) {
            query = query.populate(populate);
        }
        if (lean) {
            query = query.lean();
        }
        return await query;
    }
    async deleteOne(filter) {
        return await this.Model.deleteOne(filter);
    }
    async findByIdAndDelete(id) {
        return await this.Model.findByIdAndDelete(id);
    }
    async countDocuments(filter) {
        return await this.Model.countDocuments(filter || {});
    }
    async exists(filter) {
        return await this.Model.exists(filter);
    }
    async findOneAndUpdate({ filter, data, select, populate, lean, }) {
        let query = this.Model.findOneAndUpdate(filter, data, {
            new: true,
        });
        if (select) {
            query = query.select(select);
        }
        if (populate) {
            query = query.populate(populate);
        }
        if (lean) {
            query = query.lean();
        }
        return await query;
    }
    async findExists(filter) {
        return await this.Model.exists(filter);
    }
}
exports.DatabaseRepository = DatabaseRepository;
