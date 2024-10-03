const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');
const { exec } = require('child_process');

const rootDir = __dirname; // Root directory where script is located

// Welcome message
const welcomeMessage = () => {
    console.log('\x1b[1m Welcome to the Hapi.js project setup script!\x1b[0m');
    console.log('\x1b[1m This script will initialize your project structure and install required dependencies.\x1b[0m');
    console.log('\x1b[1m Let\'s get started...\x1b[0m');
    console.log('\n');
    // Print Divider:
    showDivider('-', 40);
};

function showDivider(character, length) {
    console.log(character.repeat(length));
    console.log(); // Empty line for separation
}

// Display progress message
const progressMessage = (message) => {
    console.log(message);
    console.log('--------------------------------------');
};

// Install required npm packages
const installPackages = async (packages) => {
    console.log('Installing packages...');
    try {
        await execCommand(`npm install ${packages} --save`);
        console.log('Packages installed successfully.');
    } catch (error) {
        console.error(`Error installing npm packages: ${error.message}`);
    }
};

// Helper function to execute shell commands
const execCommand = (command, options = {}) => {
    return new Promise((resolve, reject) => {
        exec(command, options, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve(stdout);
            }
        });
    });
};

// Define required npm packages
const requiredPackages = '@hapi/hapi lab dotenv sequelize mysql2 mongoose bcrypt @hapi/cookie';

// Create directories
const createDirectories = async () => {
    progressMessage('Creating directories...');
    const directories = [
        path.join(rootDir, 'controllers/api'),
        path.join(rootDir, 'controllers/web'),
        path.join(rootDir, 'config'),
        path.join(rootDir, 'helpers'),
        path.join(rootDir, 'models'),
        path.join(rootDir, 'routes/api/v1'),
        path.join(rootDir, 'routes/api/v2'),
        path.join(rootDir, 'routes/web'),
        path.join(rootDir, 'templates'),
        path.join(rootDir, 'tests'),
        path.join(rootDir, 'database'),
        path.join(rootDir, 'database/migrations'),
        path.join(rootDir, 'database/factories'),
        path.join(rootDir, 'database/seeders'),
    ];

    try {
        for (const dir of directories) {
            await fs.mkdir(dir, { recursive: true });
            console.log(`Created directory: ${dir}`);
        }
        console.log('\n');
    } catch (error) {
        console.error(`Error creating directories: ${error}`);
    }
};

// Create files
const createFiles = async () => {
    progressMessage('Creating files...');
// Define the files to be created
const files = [
    {
        path: path.join(rootDir, 'config/webAuth.js'),
        content: `

// Load environment variables from .env file
require('dotenv').config();

// Get cookie password from environment variable
const cookiePassword = process.env.COOKIE_PASSWORD;

// Import necessary modules
const bcrypt = require('bcrypt');

//Import the necessary Models
const User = require('../models/User'); // Assuming you have a User model defined

// Define the webRegisterHandler function
const webRegisterHandler = async (request, h) => {
    try {

        if (!h) {
            throw new Error('Response toolkit (h) is undefined');
        }

        // Check if request object or payload is undefined
        if (!request || !request.payload) {
            return h.response({ message: 'Invalid request payload' }).code(400);
        }

        // Extract user input from the request payload
        const { firstName, lastName, email, phone, username, password, confirmPassword } = request.payload;

        // Check if request payload is valid
        if (!firstName || !lastName || !email || !phone || !username || !password || !confirmPassword) {
            return h.response({ message: 'Invalid request payload' }).code(400);
        }


        // Check if passwords match
        if (password !== confirmPassword) {
            return h.response({ message: 'Passwords do not match' }).code(400);
        }

        // Check if the email is already registered
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return h.response({ message: 'Email is already registered' }).code(400);
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user record
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            phone,
            username,
            password: hashedPassword // Store the hashed password in the database
        });

        // Optionally, you can generate a JWT token or create a session for the newly registered user

        // Return a success message or any additional data as needed
        return h.response({ message: 'User registered successfully', user: newUser }).code(201);
    } catch (error) {
        console.error('Error registering user:', error);
        return h.response({ message: 'An error occurred while registering user' }).code(500);
    }
};



// Define web authentication strategy using cookies
const webAuthStrategy = async (request, h) => {
    // Implement your authentication logic here
    // For example, check if user is authenticated using cookies
    const isAuthenticated = await webAuthHelper.authenticateUser(request);

    if (isAuthenticated) {
        return h.authenticated({ credentials: { user: isAuthenticated } });
    } else {
        return h.unauthenticated({ message: "Authentication failed" });
    }
};

// Logout handler
const webLogoutHandler = async (request, h) => {
    // Implement logout logic here
    // For example, clear session or JWT token
    return h.response().unstate('session'); // Clear session cookie
};

module.exports = {
    webRegisterHandler,
    webAuthStrategy,
    webLogoutHandler,
    cookiePassword
};
`
    },

    {
        path: path.join(rootDir, 'config/apiAuth.js'),
        content: `

// Load environment variables from .env file
require('dotenv').config();

// Get JWT secret from environment variable
const jwtSecret = process.env.JWT_SECRET;

// Import necessary modules
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Assuming you have a User model defined

// Define the apiRegisterHandler function
const apiRegisterHandler = async (request, h) => {
    try {
        // Extract user input from the request payload
        const { firstName, lastName, email, phone, username, password, confirmPassword } = request.payload;

        // Check if passwords match
        if (password !== confirmPassword) {
            return h.response({ message: 'Passwords do not match' }).code(400);
        }

        // Check if the email is already registered
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return h.response({ message: 'Email is already registered' }).code(400);
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user record
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            phone,
            username,
            password: hashedPassword // Store the hashed password in the database
        });

        // Optionally, you can generate a JWT token or create a session for the newly registered user

        // Return a success message or any additional data as needed
        return h.response({ message: 'User registered successfully', user: newUser }).code(201);
    } catch (error) {
        console.error('Error registering user:', error);
        return h.response({ message: 'An error occurred while registering user' }).code(500);
    }
};


// Define API authentication strategy using JWT
const apiAuthStrategy = async (request, h) => {
    // Implement your authentication logic here
    // For example, verify JWT token
    const token = request.headers.authorization;
    const isAuthenticated = await apiAuthHelper.authenticateUser(token);

    if (isAuthenticated) {
        return h.authenticated({ credentials: { user: isAuthenticated } });
    } else {
        return h.unauthenticated({ message: "Authentication failed" });
    }
};

// Logout handler
const apiLogoutHandler = async (request, h) => {
    // Implement logout logic here
    // For example, invalidate JWT token
    return h.response().code(200); // Respond with success status code
};

module.exports = {
    apiRegisterHandler,
    apiAuthStrategy,
    apiLogoutHandler,
    jwtSecret
};
`
    },

    {
        path: path.join(rootDir, 'routes.js'),
        content: `

// Import routes from different modules
const webRoutes = require('./routes/web/web.js');
const apiV1Routes = require('./routes/api/v1/v1.js');
const apiV2Routes = require('./routes/api/v2/v2.js');

// Define an array to hold all routes
const routes = [
    // Add routes from different modules
    ...webRoutes,
    ...apiV1Routes,
    ...apiV2Routes
];

// Export the routes array
module.exports = routes;

`
    },
    { path: path.join(rootDir, '.env'), content: `# Environment Variables\nNODE_ENV=development    # or "production"\nDB=mysql    # Change this to "mongodb" to use MongoDB or "sqlite" to use SQLite\nHOST=localhost\nPORT=3000\nDB_HOST=localhost\nDB_USER=root\nDB_PASSWORD=password\nDB_NAME=my_database\n# Add more environment variables as needed\nCOOKIE_PASSWORD='cookies'\nJWT_SECRET=''` },
    { path: path.join(rootDir, 'hapi-server.js'), content: `
    const Hapi = require('@hapi/hapi');
const routes = require('./routes');
// Import the cookie plugin
const Cookie = require('@hapi/cookie');

const initServer = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: process.env.HOST || 'localhost'
    });

    // Register the cookie plugin
    await server.register(Cookie);


    try {

        // console.log('Server object:', server);
        // Register routes
        console.log('Routes:', routes);
        server.route(routes);
        return server;
    } catch (error) {
        console.error('Error registering routes:', error);
        throw error;
    }
};

module.exports = initServer;

    ` },
    { path: path.join(rootDir, 'controllers/authController.js'), content: `
    
    
    // Require authentication setup files
const { webRegisterHandler, webLogoutHandler, cookiePassword } = require('../config/webAuth');
const { apiRegisterHandler, apiLogoutHandler, jwtSecret } = require('../config/apiAuth');

// Export authentication strategies and handlers
module.exports = {
    webRegisterHandler,
    webLogoutHandler,
    apiRegisterHandler,
    apiLogoutHandler,
    cookiePassword,
    jwtSecret
};
    
    ` },
    { path: path.join(rootDir, 'controllers/web/authController.js'), content: `
    // Import necessary modules
const { webRegisterHandler, webLogoutHandler, cookiePassword } = require('../../controllers/authController');

// Define a function to initialize web authentication
const initWebAuth = async (server) => {
    try {
        // Check if the authentication strategy already exists
        if (!server.auth.strategy('webAuthStrategy')) {
            // Update web authentication strategy with the 'cookie' scheme
            server.auth.strategy('webAuthStrategy', 'cookie', {
                cookie: {
                    name: 'session', // Name of the cookie
                    password: cookiePassword, // Password used to encrypt cookie
                    isSecure: false // Change to true in production, should be true if using HTTPS
                },
                redirectTo: '/login' // Redirect to login page if unauthenticated
            });
        }
    } catch (error) {
        // If the authentication strategy already exists, log a message
        if (error.message.includes('strategy name already exists')) {
            console.log('Web authentication strategy already exists.');
        } else {
            // Otherwise, log the error
            console.error('Error updating webAuthStrategy:', error.message);
        }
    }

    // Register routes for web authentication
    // const webAuthRoutes = require('../../routes/web/web');
    // server.route(webAuthRoutes);

    // Return necessary values
    return {
        webRegisterHandler,
        webAuthStrategy: server.auth.strategy('webAuthStrategy'),
        webLogoutHandler,
        cookiePassword
    };
};



// Export the function
module.exports = initWebAuth;
` },
    { path: path.join(rootDir, 'controllers/api/authController.js'), content: `
    // Import necessary modules
const { apiRegisterHandler, apiAuthStrategy, apiLogoutHandler, jwtSecret } = require('../authController');

// Define a function to initialize API authentication
const initApiAuth = (server) => {
    // Update API authentication strategy
    server.auth.strategy('apiAuthStrategy', 'jwt', {
        key: jwtSecret, // Secret key for JWT token
        validate: async (decoded, request, h) => {
            // Implement token validation logic here if needed
            return { isValid: true };
        },
        verifyOptions: { algorithms: ['HS256'] } // Specify the algorithm used for JWT token
    });

    // Register routes for API authentication
    const apiAuthRoutes = require('../../routes/api/v1/auth');
    server.route(apiAuthRoutes);

    // Return necessary values
    return {
        apiRegisterHandler,
        apiAuthStrategy,
        apiLogoutHandler,
        jwtSecret
    };
};

// Export the function
module.exports = initApiAuth;

` },
    {
        path: path.join(rootDir, 'config/db.js'),
        content: `

const { Sequelize } = require('sequelize');
const mongoose = require('mongoose');

// Load environment variables from .env file
require('dotenv').config();

// Log the value of process.env.DB
console.log('Database type from .env:', process.env.DB);

// Get environment-specific configurations
const environment = process.env.NODE_ENV || 'development';

// Initialize database based on DB value in .env file
let dbInstance;

if (process.env.DB === 'sqlite') {
    // Use Sequelize for SQL databases
    const dbConfigs = {
        development: {
            dialect: process.env.DB_DIALECT || 'sqlite',
            storage: process.env.DB_STORAGE || ':memory:'
        },
        production: {
            dialect: process.env.DB_DIALECT || 'sqlite',
            storage: process.env.DB_STORAGE || 'db/database.sqlite'
        }
    };

    const dbConfig = dbConfigs[environment];

    dbInstance = new Sequelize({
        dialect: 'sqlite',
        storage: dbConfig.storage
    });

    } else if(process.env.DB === 'mysql') {
        dbInstance = new Sequelize({
            dialect: 'mysql',
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            username: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'database'
        });
    }
else if (process.env.DB == 'mongodb') {
    // Use Mongoose for MongoDB
    const dbURI = 'mongodb://localhost:27017/database';

            mongoose.connect(dbURI, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });

        dbInstance = mongoose.connection;

        dbInstance.on('error', console.error.bind(console, 'MongoDB connection error:'));
        dbInstance.once('open', () => {
            console.log('Connected to MongoDB database successfully');
        });
    } else {
        throw new Error('Invalid database specified in .env file');
    }

    module.exports = dbInstance;


    `
    },
    {
        path: path.join(rootDir, 'server.js'),
        content: `
        require('dotenv').config(); // Load environment variables from .env file
const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const initServer = require('./hapi-server');
const db = require('./config/db'); // Import the db module
const authController = require('./controllers/authController'); // Import the auth controller

const startServer = async () => {
    try {
        // Establish database connection
        await db.authenticate();
        console.log('Database connection has been established successfully.');

        // Initialize Hapi server
        const server = await initServer();

        // Register authentication strategies and routes
        const {
            webRegisterHandler,
            webLogoutHandler,
            apiRegisterHandler,
            apiLogoutHandler,
            cookiePassword,
            jwtSecret
        } = authController;
        
        // Register web routes
        // routes.web.forEach(route => server.route(route));

        // Register mobile routes under '/api' prefix
        // server.realm.modifiers.route.prefix = '/api';
        // routes.api.v1.forEach(route => server.route(route));
        // routes.api.v2.forEach(route => server.route(route));


        // Start the server
        await server.start();
        console.log('Server running on %s:%s', server.info.host, server.info.port);
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
};

startServer();

`
    },
    { path: path.join(rootDir, 'models/User.js'), content: `
    // Import Sequelize and DataTypes
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Import your Sequelize instance from db.js

// Define the User model
const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Export the User model
module.exports = User;



//For mongodb or mongoose, model would follow this convention:
// Import Mongoose
//const mongoose = require('mongoose');

// Define the User schema
//const userSchema = new mongoose.Schema({
//    firstName: { type: String, required: true },
    // Define other fields as needed
//});

// Create and export the User model from the schema
//module.exports = mongoose.model('User', userSchema);
    ` },

    { path: path.join(rootDir, 'routes/web/auth.js'), content: `
    const { webRegisterHandler, webLogoutHandler } = require('../../controllers/authController');

// Define routes for API authentication
module.exports = [
    {
        method: 'POST',
        path: '/register',
        handler: webRegisterHandler // Remove the parentheses here
    },
    {
        method: 'GET',
        path: '/logout',
        handler: webLogoutHandler // Remove the parentheses here
    }
];

    ` },

    { path: path.join(rootDir, 'routes/web/web.js'), content: `
    // Import routes from different modules
const authRoutes = require('./auth');
// Import other web routes if you have them

// Consolidate routes into an array
const webRoutes = [
    ...authRoutes,
    // Add other web routes here if needed
];

// Export the consolidated web routes
module.exports = webRoutes;
    ` },
    { path: path.join(rootDir, 'routes/api/v1/auth.js'), content: `
    const { apiRegisterHandler, apiLogoutHandler } = require('../../../controllers/authController');

// Define routes for API authentication
module.exports = [
    {
        method: 'POST',
        path: '/register',
        handler: apiRegisterHandler // Implement registration handler for API
    },
    {
        method: 'GET',
        path: '/logout',
        handler: apiLogoutHandler // Implement logout handler for API
    }
];  
    ` },

    { path: path.join(rootDir, 'routes/api/v1/v1.js'), content: `
    // Import routes from different modules
const authRoutes = require('./auth');
// Import other API v1 routes if you have them

// Define the prefix for all routes in this file
const prefix = '/api/v1';

// Prepend the prefix to each route path
const prefixedAuthRoutes = authRoutes.map(route => ({
    ...route,
    path: prefix + route.path
 // Concatenate the prefix with the route path
}));

// Consolidate routes into an array
const apiV1Routes = [
    ...prefixedAuthRoutes,
    // Add other API v1 routes here if needed
];

// Export the consolidated API v1 routes
module.exports = apiV1Routes;
    ` },

    { path: path.join(rootDir, 'routes/api/v2/auth.js'), content: `
    const { apiRegisterHandler, apiLogoutHandler } = require('../../../controllers/authController');

// Define routes for API authentication
module.exports = [
    {
        method: 'POST',
        path: '/register',
        handler: apiRegisterHandler // Implement registration handler for API
    },
    {
        method: 'GET',
        path: '/logout',
        handler: apiLogoutHandler // Implement logout handler for API
    }
];
    ` },

    { path: path.join(rootDir, 'routes/api/v2/v2.js'), content: `
    // Import routes from different modules
const authRoutes = require('./auth');
// Import other API v2 routes if you have them

// Define the prefix for all routes in this file
const prefix = '/api/v2';

// Prepend the prefix to each route path
const prefixedAuthRoutes = authRoutes.map(route => ({
    ...route,
    path: prefix + route.path
 // Concatenate the prefix with the route path
}));

// Consolidate routes into an array
const apiV2Routes = [
    ...prefixedAuthRoutes,
    // Add other API v2 routes here if needed
];

// Export the consolidated API v2 routes
module.exports = apiV2Routes;

    ` },
    { path: path.join(rootDir, 'tests/testInstallation.js'), content: `
    const { execSync } = require('child_process');

describe('Installation Tests', () => {
    test('Should install required npm packages', () => {
        try {
            execSync('npm install @hapi/hapi dotenv lab sequelize mysql2 mongoose');
        } catch (error) {
            throw new Error('Failed to install required npm packages');
        }
    });
});
    ` },
    { path: path.join(rootDir, 'tests/testDirectoryCreation.js'), content: `
    const fs = require('fs');
const path = require('path');

describe('Directory Creation Tests', () => {
    test('Should create required directories', () => {
        // Define directories
        const directories = [
            './controllers/api',
            './controllers/web',
            './config',
            './helpers',
            './models',
            './routes/api/v1',
            './routes/api/v2',
            './routes/web',
            './templates'
        ];

        directories.forEach(dir => {
            expect(fs.existsSync(dir)).toBe(true);
        });
    });
});
    ` },
    { path: path.join(rootDir, 'tests/testFileCreation.js'), content: `
    const fs = require('fs');
const path = require('path');

describe('File Creation Tests', () => {
    test('Should create required files', () => {
        // Define files
        const files = [
            './config/webAuth.js',
            './config/apiAuth.js',
            './routes.js',
            './.env',
            './hapi-server.js',
            './controllers/authController.js',
            './controllers/web/authController.js',
            './controllers/api/authController.js',
            './routes/web/auth.js',
            './routes/api/v1/auth.js'
        ];

        files.forEach(file => {
            expect(fs.existsSync(file)).toBe(true);
        });
    });
});
    ` },

    { path: path.join(rootDir, 'tests/testServerExecution.js'), content: `
    const initServer = require('../hapi-server');

describe('Server Execution Tests', () => {
    test('Should start the server without errors', async () => {
        try {
            const server = await initServer();
            await server.stop();
        } catch (error) {
            throw new Error('Failed to start the server');
        }
    });
});
    ` },

    { path: path.join(rootDir, 'tests/testEnvVariableConfiguration.js'), content: `
    describe('Environment Variable Configuration Tests', () => {
    test('Should load environment variables from .env file', () => {
        // Assert that required environment variables are set
        expect(process.env.HOST).toBeDefined();
        expect(process.env.PORT).toBeDefined();
        expect(process.env.DB_HOST).toBeDefined();
        expect(process.env.DB_USER).toBeDefined();
        expect(process.env.DB_PASSWORD).toBeDefined();
        expect(process.env.DB_NAME).toBeDefined();
    });
});
    ` },

    { path: path.join(rootDir, 'tests/testAuthenticationStrategies.js'), content: `
    describe('Authentication Strategies Tests', () => {
    // Add tests for webAuthStrategy and apiAuthStrategy if needed
});

    ` },
    { path: path.join(rootDir, 'tests/testRouteRegistration.js'), content: `
    describe('Route Registration Tests', () => {
    // Add tests for route registration if needed
});
    ` }
];

    try {
        for (const file of files) {
            await fs.writeFile(file.path, file.content);
            console.log(`Created file: ${file.path}`);
        }
        console.log('\n');
    } catch (error) {
        console.error(`Error creating files: ${error}`);
    }
};

// Method to generate package.json file
const generatePackageJson = async () => {
    // Define your project dependencies here
    const dependencies = ['hapi', 'lab', 'dotenv', 'sequelize', 'mysql2', 'mongoose'];

    // Object to hold dependency versions
    const dependencyVersions = {};

    // Fetch latest versions for each dependency
    for (const dependency of dependencies) {
        try {
            const result = await execCommand(`npm show ${dependency} version`);
            const version = result.trim(); // Trim any whitespace
            dependencyVersions[dependency] = `^${version}`; // Prefix with ^ for compatibility
        } catch (error) {
            console.error(`Error fetching latest version for ${dependency}: ${error}`);
        }
    }

    console.log(dependencies);

    // Package.json object
    const packageJson = {
        name: 'your-project-name',
        version: '1.0.0',
        description: 'Description of your project',
        main: 'index.js',
        scripts: {
            start: 'node server.js'
            // Add more scripts if needed
        },
        author: 'Your Name',
        license: 'MIT', // Change the license if needed
        dependencies: dependencyVersions,
        // Add other fields as needed
    };

    try {
        // Write package.json file
        await fs.writeFile(path.join(rootDir, 'package.json'), JSON.stringify(packageJson, null, 2));
        console.log('package.json exists already.');
    } catch (error) {
        console.error(`Error creating package.json file: ${error}`);
    }
};


// Main setup function
const setupProject = async () => {
    welcomeMessage();
    await installPackages(requiredPackages);
    await createDirectories();
    await createFiles();
    await generatePackageJson(); // Call the method to generate package.json
    console.log('Project setup completed successfully!');
    console.log('Please review the .env file to configure your environment variables.');
    console.log('Now from your project directory, execute setup.js to get your package.json file. use "node setup.js"');
};

// Run setup function
setupProject().catch(error => {
    console.error('Error setting up project:', error);
    process.exit(1);
});

