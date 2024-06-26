Brewery Review System

Welcome to the Brewery Review System, a web application for searching breweries and adding reviews. 
This project integrates with the Open Brewery DB API and provides a user-friendly interface for interacting with brewery data.

Features

1. Authentication:
   - User signup and login functionality.
   - JWT-based authentication for secure access to features.

2. Search Breweries:
   - Search breweries by city, name, and type using the Open Brewery DB API.

3. Brewery Details:
   - View detailed information about a selected brewery.
   - Display brewery name, address, phone number, website URL, state, city, and current average rating based on user reviews.

4. Reviews:
   - Users can add reviews (rating from 1-5 and description) for breweries.
   - All reviews are stored in a hosted database and fetched dynamically when viewing brewery details.

Pages

1. Login/Signup Page:
   - Allows new users to sign up.
   - Existing users can log in to access the search page.

2. Search Page:
   - Displays a search form to search breweries by city, name, or type.
   - Results show basic brewery details and allow users to click for more details.

3. Brewery Page:
   - Shows comprehensive details of a selected brewery.
   - Displays existing reviews with ratings and descriptions.
   - Allows logged-in users to add new reviews.

Technologies Used

- Frontend: HTML, CSS, JavaScript (Vanilla)
- Backend: Node.js, Express.js, MongoDB (for storing reviews)
- Authentication: JSON Web Tokens (JWT)
- External API: Open Brewery DB API

Setup Instructions
To run this project locally, follow these steps:
1. Clone the repository:

   git clone https://github.com/harithikchoudhary/MoEngage.git

   cd brewery-review-system
   

3. Install dependencies:
   npm install
   
5. Set up environment variables:
   - Create a .env file in the root directory.
   - Add the following variables:
   - 
     JWT_SECRET=your_jwt_secret_here
     MONGO_URI=your_mongodb_connection_string_here
     

6. Start the server:

   npm start
   
7. Open your browser and navigate to http://localhost:4000 to access the application.


![Screenshot 2024-06-24 053717](https://github.com/harithikchoudhary/MoEngage/assets/125364799/cbd19347-f7a2-4c43-b865-8f0159a7afd1)

![Screenshot 2024-06-24 053729](https://github.com/harithikchoudhary/MoEngage/assets/125364799/7688651c-e228-4f02-86b3-b24a555256be)

![Screenshot 2024-06-24 053756](https://github.com/harithikchoudhary/MoEngage/assets/125364799/0bc33f80-5208-4f2d-ac44-f4578ab0fba6)
![Screenshot 2024-06-24 053819](https://github.com/harithikchoudhary/MoEngage/assets/125364799/7fba32e8-eda3-434f-9542-dd048944d296)

![Screenshot 2024-06-24 053909](https://github.com/harithikchoudhary/MoEngage/assets/125364799/66748254-335f-4b58-8836-cd9b7e1b115c)
