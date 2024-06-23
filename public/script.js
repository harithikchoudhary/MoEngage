//Handle Login
function login() {
  event.preventDefault();
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Invalid username or password");
      }
      return response.json();
    })
    .then((data) => {
      localStorage.setItem("token", data.token);
      alert("Login successful!");
      window.location.href = "search.html";
    })
    .catch((error) => {
      document.getElementById("loginError").innerText = error.message;
    });
}

// handle signup
function signup() {
  event.preventDefault();
  const username = document.getElementById("signupUsername").value;
  const email = document.getElementById("signupEmail").value;
  const mobile = document.getElementById("signupMobile").value;
  const password = document.getElementById("signupPassword").value;

  fetch("/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, mobile, password }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Registration failed");
      }
      return response.json();
    })
    .then((data) => {
      alert("Registration successful! Please login.");
      window.location.href = "index.html";
    })
    .catch((error) => {
      alert(error.message);
    });
}

//Search breweries
function searchBreweries() {
  event.preventDefault();
  const searchType = document.getElementById("searchType").value;
  const searchQuery = document.getElementById("searchQuery").value;

  fetch(`/search?type=${searchType}&query=${searchQuery}`)
    .then((response) => response.json())
    .then((data) => {
      displayBreweries(data);
    })
    .catch((error) => {
      console.error("Error fetching breweries:", error);
      alert("Failed to fetch breweries. Please try again.");
    });
}

// Display breweries
function displayBreweries(breweries) {
  const breweryList = document.getElementById("breweryList");
  breweryList.innerHTML = "";

  breweries.forEach((brewery) => {
    const breweryCard = document.createElement("div");
    breweryCard.classList.add("brewery");
    breweryCard.innerHTML = `
      <h3>${brewery.name}</h3>
      <p><strong>Address:</strong> ${brewery.street}, ${brewery.city}, ${brewery.state} ${brewery.postal_code}</p>
      <p><strong>Phone:</strong> ${brewery.phone}</p>
      <p><strong>Website:</strong> <a href="${brewery.website_url}" target="_blank">${brewery.website_url}</a></p>
      <button onclick="viewBreweryDetails('${brewery.id}')">View Details</button>
    `;
    breweryList.appendChild(breweryCard);
  });
}

function viewBreweryDetails(id) {
  window.location.href = `brewery.html?id=${id}`;
}

function displayBreweryDetails(brewery) {
  const breweryDetails = document.getElementById("breweryDetails");
  breweryDetails.innerHTML = `
    <h2>${brewery.name}</h2>
    <p><strong>Address:</strong> ${brewery.street}, ${brewery.city}, ${brewery.state} ${brewery.postal_code}</p>
    <p><strong>Phone:</strong> ${brewery.phone}</p>
    <p><strong>Website:</strong> <a href="${brewery.website_url}" target="_blank">${brewery.website_url}</a></p>
  `;
}

function fetchBreweryDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const breweryId = urlParams.get("id");

  fetch(`/brewery/${breweryId}`)
    .then((response) => response.json())
    .then((data) => {
      displayBreweryDetails(data);
      fetchReviews(breweryId);
    })
    .catch((error) => {
      console.error("Error fetching brewery details:", error);
      alert("Failed to fetch brewery details. Please try again.");
    });
}

function fetchReviews(breweryId) {
  fetch(`/brewery/${breweryId}`)
    .then((response) => response.json())
    .then((data) => {
      const reviewsContainer = document.getElementById("reviews");
      reviewsContainer.innerHTML = "<h2>Reviews</h2>";

      if (data.reviews.length === 0) {
        reviewsContainer.innerHTML += "<p>No reviews yet.</p>";
      } else {
        data.reviews.forEach((review) => {
          const reviewDiv = document.createElement("div");
          reviewDiv.classList.add("review");
          reviewDiv.innerHTML = `
          <p><strong>User:</strong> ${review.userId}</p>
          <p><strong>Rating:</strong> ${review.stars}/5</p>
          <p><strong>Description:</strong> ${review.description}</p>
        `;
          reviewsContainer.appendChild(reviewDiv);
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching reviews:", error);
      alert("Failed to fetch reviews. Please try again.");
    });
}

function addReview() {
  event.preventDefault();
  const stars = document.getElementById("stars").value;
  const description = document.getElementById("description").value;
  const token = localStorage.getItem("token");
  const urlParams = new URLSearchParams(window.location.search);
  const breweryId = urlParams.get("id");

  fetch(`/brewery/${breweryId}/review`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ stars, description }),
  })
    .then((response) => {
      if (response.ok) {
        alert("Review added successfully!");
        fetchReviews(breweryId);
      } else {
        throw new Error("Failed to add review.");
      }
    })
    .catch((error) => {
      console.error("Error adding review:", error);
      alert("Failed to add review. Please try again.");
    });
}

if (window.location.pathname.includes("brewery.html")) {
  document.addEventListener("DOMContentLoaded", fetchBreweryDetails);
}
