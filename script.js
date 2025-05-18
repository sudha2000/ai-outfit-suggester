const form = document.getElementById("outfitForm");
const suggestionBox = document.getElementById("suggestionBox");

// Clear previous results
function clearImages() {
  suggestionBox.innerHTML = "";
  suggestionBox.style.display = "none";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  clearImages();

  const occasion = document.getElementById("occasion").value;
  const mood = document.getElementById("mood").value;
  const location = document.getElementById("location").value;

  // Send data to backend
  const res = await fetch("/get-outfit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ occasion, mood, location }),
  });

  if (!res.ok) {
    console.error("Failed to get outfit images.");
    return;
  }

  const data = await res.json();

  // Display images with their product URLs
  if (Array.isArray(data.imageUrls)) {
    data.imageUrls.forEach((imgSrc, index) => {
      const container = document.createElement("div");
      container.style.marginBottom = "30px";

      const img = document.createElement("img");
      img.src = imgSrc;
      img.alt = "Outfit suggestion";
      img.style.width = "200px";
      img.style.marginBottom = "10px";
      container.appendChild(img);

      if (Array.isArray(data.productUrls) && data.productUrls[index]) {
        const linkList = document.createElement("ul");

        data.productUrls[index].forEach((url) => {
          const linkItem = document.createElement("li");
          linkItem.style.marginBottom = "10px"; // one line space
          const link = document.createElement("a");
          link.href = url;
          link.target = "_blank";
          link.textContent = url;
          linkItem.appendChild(link);
          linkList.appendChild(linkItem);
        });

        container.appendChild(linkList);
      }

      suggestionBox.appendChild(container);
    });
  }

  suggestionBox.style.display = "block";
});
