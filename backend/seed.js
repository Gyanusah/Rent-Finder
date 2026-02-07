import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const User = require('./models/User.js');
const Property = require('./models/Property.js');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

const sampleUsers = [
    {
        name: 'John Tenant',
        email: 'tenant@example.com',
        password: 'password123',
        phone: '9876543210',
        role: 'tenant',
    },
    {
        name: 'Priya Owner',
        email: 'owner@example.com',
        password: 'password123',
        phone: '9987654321',
        role: 'owner',
    },
    {
        name: 'Amit Admin',
        email: 'admin@example.com',
        password: 'password123',
        phone: '9765432109',
        role: 'admin',
    },
];

const sampleProperties = [
    {
        title: '2BHK Apartment in Bandra',
        description:
            'Beautiful 2BHK apartment in heart of Bandra. Recently renovated with modern amenities. Close to schools, hospitals, and shopping centers.',
        address: '123 Marine Drive, Bandra',
        city: 'Mumbai',
        area: 'Bandra',
        pincode: '400050',
        rent: 65000,
        deposit: 195000,
        maintenance: 3000,
        propertyType: 'full_house',
        roomType: '2BHK',
        roomCount: 2,
        bathrooms: { total: 2, attached: 2, common: 0 },
        furnishing: 'semi-furnished',
        floor: { current: 3, total: 5 },
        roomSize: { value: 850, unit: 'sqft' },
        balcony: true,
        amenities: {
            wifi: true,
            ac: true,
            parking: true,
            powerBackup: true,
            waterSupply: true,
            lift: true,
        },
        rules: { smoking: false, drinking: false, pets: false },
        familyAllowed: true,
        bachelorAllowed: false,
        availability: { available: true },
        images: [
            { url: 'https://i.pinimg.com/736x/f4/ac/08/f4ac087ed911cbf03d69fc678e7f237c.jpg', uploadedAt: new Date() },
            { url: 'https://i.pinimg.com/736x/f4/ac/08/f4ac087ed911cbf03d69fc678e7f237c.jpg', uploadedAt: new Date() },
        ],
    },
    {
        title: 'Single Room in Andheri',
        description:
            'Cozy single room perfect for working professionals. Includes WiFi, AC, and attached bathroom. Very close to Metro station.',
        address: '456 Link Road, Andheri',
        city: 'Mumbai',
        area: 'Andheri',
        pincode: '400053',
        rent: 18000,
        deposit: 54000,
        maintenance: 1000,
        propertyType: 'single_room',
        roomType: 'Single Room',
        roomCount: 1,
        bathrooms: { total: 1, attached: 1, common: 0 },
        furnishing: 'furnished',
        floor: { current: 2, total: 4 },
        roomSize: { value: 250, unit: 'sqft' },
        balcony: false,
        amenities: {
            wifi: true,
            ac: true,
            parking: false,
            powerBackup: true,
            waterSupply: true,
        },
        rules: { smoking: false, drinking: false, pets: false },
        familyAllowed: false,
        bachelorAllowed: true,
        availability: { available: true },
        images: [
            { url: 'https://i.pinimg.com/736x/f4/ac/08/f4ac087ed911cbf03d69fc678e7f237c.jpg', uploadedAt: new Date() },
        ],
    },
    {
        title: '1BHK Flat in Dahisar',
        description:
            'Affordable 1BHK flat in peaceful Dahisar. Close to market and public transport. Perfect for young couples.',
        address: '789 Western Express Road, Dahisar',
        city: 'Mumbai',
        area: 'Dahisar',
        pincode: '400068',
        rent: 35000,
        deposit: 105000,
        maintenance: 1500,
        propertyType: 'full_house',
        roomType: '1BHK',
        roomCount: 1,
        bathrooms: { total: 1, attached: 1, common: 0 },
        furnishing: 'unfurnished',
        floor: { current: 1, total: 3 },
        roomSize: { value: 450, unit: 'sqft' },
        balcony: true,
        amenities: {
            wifi: false,
            ac: false,
            parking: true,
            powerBackup: true,
            waterSupply: true,
            lift: false,
        },
        rules: { smoking: false, drinking: false, pets: false },
        familyAllowed: true,
        bachelorAllowed: true,
        availability: { available: true },
        images: [
            { url: 'https://i.pinimg.com/736x/f4/ac/08/f4ac087ed911cbf03d69fc678e7f237c.jpg', uploadedAt: new Date() },
            { url: 'https://i.pinimg.com/736x/f4/ac/08/f4ac087ed911cbf03d69fc678e7f237c.jpg', uploadedAt: new Date() },
            { url: 'https://i.pinimg.com/736x/f4/ac/08/f4ac087ed911cbf03d69fc678e7f237c.jpg', uploadedAt: new Date() },
        ],
    },
    {
        title: 'Shared Room in Fort',
        description:
            'Bed space in shared 2BHK apartment in central Mumbai. All utilities included. Ideal for students.',
        address: '321 Fort Street, Mumbai',
        city: 'Mumbai',
        area: 'Fort',
        pincode: '400001',
        rent: 12000,
        deposit: 36000,
        maintenance: 500,
        propertyType: 'shared_room',
        roomType: 'Double Room',
        roomCount: 1,
        bathrooms: { total: 1, attached: 0, common: 1 },
        furnishing: 'furnished',
        floor: { current: 5, total: 6 },
        roomSize: { value: 150, unit: 'sqft' },
        balcony: false,
        amenities: {
            wifi: true,
            ac: true,
            parking: false,
            powerBackup: true,
            waterSupply: true,
            images: [
                { url: 'https://i.pinimg.com/736x/f4/ac/08/f4ac087ed911cbf03d69fc678e7f237c.jpg', uploadedAt: new Date() },
            ],
        },
        rules: { smoking: false, drinking: false, pets: false },
        familyAllowed: false,
        bachelorAllowed: true,
        availability: { available: true },
    },
    {
        title: '3BHK Villa in Powai',
        description:
            'Spacious 3BHK villa with private garden and garage. Gated community with 24/7 security. Premium amenities.',
        address: '567 Powai Lake Road, Powai',
        city: 'Mumbai',
        area: 'Powai',
        pincode: '400076',
        rent: 95000,
        deposit: 285000,
        maintenance: 5000,
        propertyType: 'full_house',
        roomType: '3BHK',
        roomCount: 3,
        bathrooms: { total: 3, attached: 3, common: 0 },
        furnishing: 'furnished',
        floor: { current: 1, total: 1 },
        roomSize: { value: 1200, unit: 'sqft' },
        balcony: true,
        amenities: {
            wifi: true,
            ac: true,
            parking: true,
            powerBackup: true,
            waterSupply: true,
            lift: false,
            gym: true,
            swimming_pool: true,
            garden: true,
        },
        rules: { smoking: true, drinking: true, pets: true },
        images: [
            { url: 'https://i.pinimg.com/736x/f4/ac/08/f4ac087ed911cbf03d69fc678e7f237c.jpg', uploadedAt: new Date() },
            { url: 'https://i.pinimg.com/736x/f4/ac/08/f4ac087ed911cbf03d69fc678e7f237c.jpg', uploadedAt: new Date() },
            { url: 'https://i.pinimg.com/736x/f4/ac/08/f4ac087ed911cbf03d69fc678e7f237c.jpg', uploadedAt: new Date() },
            { url: 'https://i.pinimg.com/736x/f4/ac/08/f4ac087ed911cbf03d69fc678e7f237c.jpg', uploadedAt: new Date() },
        ],
        familyAllowed: true,
        bachelorAllowed: false,
        availability: { available: true },
    },
];

const seedDatabase = async () => {
    try {
        await connectDB();

        // Clear existing data
        await User.deleteMany({});
        await Property.deleteMany({});

        console.log('Creating sample users...');
        const createdUsers = await User.insertMany(sampleUsers);

        console.log('Creating sample properties...');
        // Assign properties to the owner
        const ownerUser = createdUsers.find((u) => u.role === 'owner');
        const propertiesWithOwner = sampleProperties.map((prop) => ({
            ...prop,
            owner: ownerUser._id,
        }));

        await Property.insertMany(propertiesWithOwner);

        console.log('✅ Database seeded successfully!');
        console.log('\nSample Login Credentials:');
        console.log('Tenant: tenant@example.com / password123');
        console.log('Owner: owner@example.com / password123');
        console.log('Admin: admin@example.com / password123');

        mongoose.disconnect();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
