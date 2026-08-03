require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Property = require('./models/Property');
const bcrypt = require('bcryptjs');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/realestate');

const properties = [
    {
        title: "Luxurious 5 BHK Duplex Penthouse",
        description: "Experience the pinnacle of luxury living in this stunning duplex penthouse atop a premium high-rise. Features panoramic views of the Mumbai skyline, a private terrace with jacuzzi, modular kitchen with European appliances, and a dedicated home theatre. The property comes with 3 designated parking spots and 24x7 security.",
        location: "Worli Sea Face, Mumbai, Maharashtra",
        price: 18500000,
        bedrooms: 5,
        bathrooms: 5,
        area: 5200,
        category: "Apartment",
        images: [
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        ],
        ownerName: "Rajesh Mehta",
        ownerPhone: "+91 98201 44512"
    },
    {
        title: "Premium 4 BHK Independent Villa",
        description: "A grand independent villa nestled in the heart of Jubilee Hills with a private swimming pool, landscaped garden, and Italian marble flooring throughout. The villa features a grand entrance lobby, spacious living areas, a fully-equipped modular kitchen, and a rooftop terrace perfect for entertaining. Smart home automation included.",
        location: "Jubilee Hills, Hyderabad, Telangana",
        price: 9800000,
        bedrooms: 4,
        bathrooms: 4,
        area: 4800,
        category: "Villa",
        images: [
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        ],
        ownerName: "Priya Reddy",
        ownerPhone: "+91 94410 78234"
    },
    {
        title: "Modern 3 BHK Apartment in Whitefield",
        description: "Beautifully designed 3 BHK apartment in a gated society with world-class amenities. The apartment features an open-plan living area, a modular kitchen, large balcony with garden view, and premium fittings. Society amenities include a clubhouse, gym, swimming pool, and children's play area. Walking distance to major IT parks.",
        location: "Whitefield, Bengaluru, Karnataka",
        price: 4200000,
        bedrooms: 3,
        bathrooms: 3,
        area: 1850,
        category: "Apartment",
        images: [
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        ],
        ownerName: "Suresh Nair",
        ownerPhone: "+91 97400 11289"
    },
    {
        title: "Spacious 3 BHK Flat in South Delhi",
        description: "Well-maintained and spacious 3 BHK apartment on the 8th floor of a premium society in Greater Kailash. Features a large living area, separate dining room, full-size modular kitchen, and two balconies. The society has 24x7 power backup, security, and a well-maintained garden. Prime location with excellent connectivity.",
        location: "Greater Kailash II, New Delhi",
        price: 7500000,
        bedrooms: 3,
        bathrooms: 2,
        area: 2100,
        category: "Apartment",
        images: [
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        ],
        ownerName: "Amit Sharma",
        ownerPhone: "+91 99100 33456"
    },
    {
        title: "Prime Commercial Space in BKC",
        description: "Premium Grade-A commercial office space in the heart of Bandra Kurla Complex, Mumbai's premier business district. The space features an open floor plan, high ceilings, central air conditioning, dedicated server room, and 8 covered parking spaces. Ideal for IT/ITES companies, banks, and corporate headquarters.",
        location: "Bandra Kurla Complex, Mumbai, Maharashtra",
        price: 55000000,
        bedrooms: 0,
        bathrooms: 6,
        area: 8500,
        category: "Commercial",
        images: [
            "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        ],
        ownerName: "Kapoor Estates Pvt. Ltd.",
        ownerPhone: "+91 22 4567 8901"
    },
    {
        title: "Elegant 4 BHK Builder Floor in Gurgaon",
        description: "Newly constructed 4 BHK builder floor with modern architecture and premium interiors. Features include a large terrace, modular kitchen with chimney and hob, vitrified tile flooring, wooden flooring in bedrooms, and designer bathrooms. Excellent connectivity to NH-48 and major business hubs of Gurugram.",
        location: "DLF Phase 4, Gurugram, Haryana",
        price: 6500000,
        bedrooms: 4,
        bathrooms: 4,
        area: 2800,
        category: "House",
        images: [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        ],
        ownerName: "Vikram Malhotra",
        ownerPhone: "+91 98116 72390"
    }
];

const seedData = async () => {
    try {
        await User.deleteMany();
        await Property.deleteMany();

        // Create Admin User (password is stored pre-hashed so we bypass the pre-save hook)
        const admin = new User({
            fullName: "Admin User",
            email: "admin@realstate.com",
            phone: "+91 98000 00000",
            password: "admin123",   // will be hashed by pre-save hook
            role: "admin"
        });
        await admin.save();

        // Add admin reference to properties
        const propertiesWithOwner = properties.map(p => ({ ...p, owner: admin._id }));
        await Property.insertMany(propertiesWithOwner);

        console.log('✅ Indian Data Imported Successfully!');
        process.exit();
    } catch (error) {
        console.error(`❌ Error with data import: ${error}`);
        process.exit(1);
    }
};

seedData();
