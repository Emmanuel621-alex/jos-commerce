// courses.js
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector("#discover .grid-container");

  // Fetch the JSON data
  fetch("data/commerce.json")
    .then(response => {
      if (!response.ok) throw new Error("Failed to fetch commerce data");
      return response.json();
    })
    .then(courses => {
      courses.forEach(course => {
        // Create card container
        const card = document.createElement("div");
        card.className = "course-card";

        // Populate card content
        card.innerHTML = `
          <img src="${course.image}" alt="${course.title}" loading="lazy">
          <h2>${course.title}</h2>
          <p class="address">${course.address}</p>
          <p class="description">${course.description}</p>
          <a href="${course.link}" class="learn-more" aria-label="Learn more about ${course.title}">Learn More</a>
        `;

        // Append card to container
        container.appendChild(card);
      });

      // Image hover effect for larger screens only
      const images = container.querySelectorAll("img");
      if (window.innerWidth >= 768) {
        images.forEach(image => {
          image.addEventListener("mouseenter", () => {
            image.style.transform = "scale(1.05)";
          });
          image.addEventListener("mouseleave", () => {
            image.style.transform = "scale(1)";
          });
        });
      }
    })
    .catch(error => {
      console.error("Error loading commerce data:", error);
      container.innerHTML = "<p>Sorry, course data could not be loaded at this time.</p>";
    });

  // localStorage: last visit message
  const lastVisit = localStorage.getItem("lastVisit");
  const message = lastVisit
    ? `Welcome back! Your last visit was on ${lastVisit}`
    : "Welcome to the Discover page!";
  alert(message);
  localStorage.setItem("lastVisit", new Date().toLocaleString());
});
