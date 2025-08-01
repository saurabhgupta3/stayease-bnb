const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.object({
        filename: Joi.string().allow("", null).default("listingimage"),
        url: Joi.string().allow("", null).default("/images/default.jpg"),
    }),

    location: Joi.string().required(),
    price: Joi.number().required(),
    country: Joi.string().required(),
}).required();

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
});
