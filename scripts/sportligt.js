// spotlights.js
fetch("data/members.json")
  .then(res => res.json())
  .then(data => {
    const goldSilver = data.members.filter(m => m.level === "gold" || m.level === "silver");
    const selected = goldSilver.sort(() => 0.5 - Math.random()).slice(0, 3);
    const container = document.getElementById("spotlight-container");
    container.innerHTML = "";
    selected.forEach(member => {
      const card = document.createElement("div");
      card.className = "spotlight-card card";
      card.innerHTML = `
        <h3>${member.name}</h3>
        <p>${member.description}</p>
        <p>Email: <a href="mailto:${member.email}">${member.email}</a></p>
        <p>Phone: ${member.phone}</p>
      `;
      container.appendChild(card);
    });
  });
