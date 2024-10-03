// generatePackageJson.js

const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');
const { exec } = require('child_process');

const rootDir = __dirname; // Root directory where script is located

// Method to generate package.json file
const generatePackageJson = async () => {
    // Get user input for package.json fields
    const packageJson = await getUserInput();

    // Add dependencies
    packageJson.dependencies = await addDependencies();

    try {
        // Write package.json file
        await fs.writeFile(path.join(rootDir, 'package.json'), JSON.stringify(packageJson, null, 2));
        console.log('Created package.json file successfully.');
    } catch (error) {
        console.error(`Error creating package.json file: ${error}`);
    }
};

// Helper function to get user input
const getUserInput = async () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const userInput = {};

    try {
        userInput.name = await askQuestion(rl, 'Package name: ');
        userInput.version = await askQuestion(rl, 'Version (default: 1.0.0): ', '1.0.0');
        userInput.description = await askQuestion(rl, 'Description: ', 'WIP');
        userInput.main = await askQuestion(rl, 'Main file: ', 'index.js');
        userInput.author = await askQuestion(rl, 'Author: ', 'Anonymous');
        console.log('Please wait while we set it up...');
    } catch (error) {
        console.error('Error getting user input:', error);
    } finally {
        rl.close();
    }

    return userInput;
};


// Helper function to add dependencies
const addDependencies = async () => {
    // Define your project dependencies here
    const dependencies = ['@hapi/hapi', 'lab', 'dotenv', 'sequelize', 'mysql2', 'mongoose','hapi-mvc','bcrypt','@hapi/cookie'];

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

    return dependencyVersions;
};

// Helper function to ask question and get user input
const askQuestion = (rl, question, defaultValue = '') => {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.trim() || defaultValue);
        });
    });
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

// Check if the script is being run directly
if (require.main === module) {
    // If so, call the generatePackageJson function
    generatePackageJson().catch(error => {
        console.error('Error generating package.json:', error);
        process.exit(1);
    });
} else {
    // If not, export the function for importing
    module.exports = generatePackageJson;
}
