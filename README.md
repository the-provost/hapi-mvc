# hapi-mvc
[![npm version](https://img.shields.io/npm/v/hapi-mvc.svg?style=badge)](https://www.npmjs.com/package/hapi-mvc)
[![License](https://img.shields.io/github/license/the-provost/hapi-mvc.svg?style=badge)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/the-provost/hapi-mvc.svg?style=badge)](https://github.com/the-provost/hapi-mvc/stargazers)
[![GitHub tag](https://img.shields.io/github/tag/the-provost/nevm-mvc-scaffold.svg?style=badge)](https://github.com/the-provost/hapi-mvc/tags)
![NPM Downloads](https://img.shields.io/npm/dt/hapi-mvc)

---

This is a Hapi.js project setup script designed to initialize your project structure and install required dependencies.

## Project Overview

hapi-mvc provides a basic project structure and setup for starting a new Hapi.js project following the Model-View-Controller (MVC) pattern.

## Getting Started

To get started with hapi-mvc, follow these steps:

1. **Installation**: Clone the repository or download the source code to your local machine.

2. **Setup**: Run the setup script to initialize the project structure and install required dependencies:
    ```
    npm install
    ```

3. **Custom Setup**: After installing dependencies, execute the custom setup script to further configure your project:
    ```
    node install.js
    ```

4. **Configuration**: Review and modify the `.env` file to configure your environment variables as needed.

5. **Start the Server**: Run the server using the provided script:
    ```
    npm start
    ```

6. **Explore**: Explore the generated project structure and start building your Hapi.js application.

## Project Structure

The project structure follows a typical MVC pattern with the following directories:

- `controllers`: Contains controller logic for handling requests.
- `config`: Contains configuration files such as authentication strategies.
- `routes`: Contains route definitions.
- `models`: Contains data models or schemas.
- `helpers`: Contains utility/helper functions.
- `templates`: Contains template files for views (if applicable).
- `test`: Contains test files for testing the application.

## Contributing

Contributions to hapi-mvc are welcome! If you have suggestions, enhancements, or bug fixes, feel free to open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
