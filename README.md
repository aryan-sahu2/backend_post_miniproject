# Express App with User Authentication

This is a simple Express application that demonstrates user authentication using JWT (JSON Web Tokens) and bcrypt for password hashing. Users can register, log in, log out, create posts, edit posts, like posts, and update their profile picture.

## Features

- **User Registration**: Users can register with a username, name, age, email, and password.
- **User Login**: Registered users can log in using their email and password.
- **User Authentication**: Authentication is managed using JWT tokens stored in cookies.
- **Profile Management**: Users can view their profile and upload a profile picture.
- **Post Management**: Users can create posts, edit their posts, and like posts.
- **Logout**: Users can log out, which clears their session token.

## Installation

1. Clone this repository
2. Navigate to the project directory
3. Install dependencies: `npm install`

## Configuration

1. Set up MongoDB: Ensure MongoDB is installed and running locally or provide a remote MongoDB URI in `config/db.js`.
2. Set JWT Secret: Change the JWT secret key in `app.js` to a secure random string.
3. Set up Multer: Configure Multer settings in `config/multerconfig.js` for handling file uploads.

## Usage

1. Start the server: `npm start` or `node app.js`
2. Visit `http://localhost:3000` in your browser to access the application.
3. Register a new user or log in with existing credentials.
4. Explore the features of the application.

## Dependencies

- express: Web framework for Node.js
- mongoose: MongoDB object modeling tool
- bcrypt: Password hashing library
- jsonwebtoken: JSON Web Token implementation
- multer: Middleware for handling file uploads
- ejs: Embedded JavaScript templates
- cookie-parser: Middleware for parsing cookies

## Credits

This application was created by [Aryan Sahu].

