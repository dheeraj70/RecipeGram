# RecipeGram

RecipeGram is a full-stack web application that allows users to share and discover delicious recipes from around the world. Built using Node.js for the backend, React for the frontend, and MySQL for the database, RecipeGram provides a seamless and intuitive platform for food enthusiasts to connect, share, and explore culinary creations.
Live here: https://recipegram.site/

### Features:
- **User Authentication:** Secure user authentication system using Passport.js allows users to sign up, log in, and log out securely.
- **Recipe Sharing:** Users can create and post their recipes, sharing their favorite dishes with the RecipeGram community.
- **Recipe Discovery:** Explore a diverse collection of recipes contributed by other users, they can simply search for their desired recipe.
- **User Interaction:** Subscribe other users and build connections within the RecipeGram community.
- **Search and Filtering:** Easily search for recipes by keyword or tags.
- **Responsive Design:** RecipeGram is designed to be fully responsive, ensuring a seamless experience across devices of all sizes.

### Tech Stack:
- **Backend:** Node.js, Express.js
- **Frontend:** React.js, Bootstrap
- **Database:** MySQL
- **Authentication:** Passport.js for authentication using bcrypt
- **Deployment:** Hosted on AWS EC2 instance
- **Web Server:** Nginx for reverse proxy

### Installation:
1. Clone the repository: `git clone https://github.com/dheeraj70/RecipeGram`
2. Open config.js and rename the host, user, password according to your local mysql server.
3. Open CLI and run `mysql -u <your_username> -p` then enter your password.
4. Run `source script.sql`. This will load sample data which is needed for project to run.
5. Alternatively you can run the script.sql on Mysql Workbench.
6. Navigate to the backend folder: `cd backend`
7. Install backend dependencies: `npm install`
8. Run backend server: `node index.js`
9. Navigate to the frontend folder: `cd ../frontend/recipegram`
10. Install frontend dependencies: `npm install`
11. Run frontend server: `npm start`
12. Open your browser and navigate to `http://localhost:3000` to view the app.

### Contributing:
Contributions are welcome! Feel free to submit bug reports, feature requests, or pull requests to help improve RecipeGram.

### Author:
Dheeraj Kumar

Enjoy exploring and sharing recipes with RecipeGram! 🍽️🌟

