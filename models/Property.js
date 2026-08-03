const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title can not be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [2000, 'Description can not be more than 2000 characters']
    },
    location: {
        type: String,
        required: [true, 'Please add an address/location']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    bedrooms: {
        type: Number,
        required: [true, 'Please add number of bedrooms']
    },
    bathrooms: {
        type: Number,
        required: [true, 'Please add number of bathrooms']
    },
    area: {
        type: Number, // in sq. ft.
        required: [true, 'Please add property area (sq. ft.)']
    },
    category: {
        type: String,
        required: [true, 'Please specify property category'],
        enum: ['Apartment', 'House', 'Villa', 'Commercial', 'Land']
    },
    images: {
        type: [String],
        default: ['default_property.jpg']
    },
    status: {
        type: String,
        enum: ['available', 'sold', 'rented'],
        default: 'available'
    },
    ownerName: {
        type: String,
        required: true
    },
    ownerPhone: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Property', propertySchema);
