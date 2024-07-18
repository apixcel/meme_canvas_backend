"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
class QueryBuilder {
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery;
        this.query = query;
        console.log("Initial query:", this.query);
    }
    search(searchableFields) {
        const searchTerm = this.query.searchTerm;
        if (searchTerm) {
            this.modelQuery = this.modelQuery.find({
                $or: searchableFields.map((field) => ({
                    [field]: { $regex: searchTerm, $options: "i" },
                })),
            });
        }
        return this;
    }
    filter() {
        const queryObj = Object.assign({}, this.query);
        const excludeFields = [
            "searchTerm",
            "sort",
            "limit",
            "page",
            "fields",
            "minPrice",
            "maxPrice",
        ];
        excludeFields.forEach((el) => delete queryObj[el]);
        if (queryObj.category) {
            queryObj.category = new mongoose_1.Types.ObjectId(queryObj.category);
        }
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        this.modelQuery = this.modelQuery.find(JSON.parse(queryStr));
        console.log("Query after general filtering:", queryStr);
        // Price filtering
        if (this.query.minPrice || this.query.maxPrice) {
            const priceFilter = {};
            if (this.query.minPrice) {
                priceFilter.$gte = Number(this.query.minPrice);
            }
            if (this.query.maxPrice) {
                priceFilter.$lte = Number(this.query.maxPrice);
            }
            this.modelQuery = this.modelQuery.find({
                price: priceFilter,
            });
        }
        return this;
    }
    sort() {
        let sortBy = "-createdAt";
        if (this.query.sort) {
            switch (this.query.sort) {
                case "price-asc":
                    sortBy = "discountPrice";
                    break;
                case "price-desc":
                    sortBy = "-discountPrice";
                    break;
                case "rating":
                    sortBy = "-rating";
                    break;
                default:
                    sortBy = this.query.sort;
            }
        }
        this.modelQuery = this.modelQuery.sort(sortBy);
        return this;
    }
    paginate() {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;
        const skip = (page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }
    fields() {
        var _a, _b;
        const fields = ((_b = (_a = this.query.fields) === null || _a === void 0 ? void 0 : _a.split(",")) === null || _b === void 0 ? void 0 : _b.join(" ")) || "-__v";
        this.modelQuery = this.modelQuery.select(fields);
        return this;
    }
}
exports.default = QueryBuilder;
// case "price-asc":
//   sortBy = "discountPrice";
//   break;
// case "price-desc":
//   sortBy = "-discountPrice";
