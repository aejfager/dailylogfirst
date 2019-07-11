const form = document.querySelector("form");
const loadingElement = document.querySelector(".loading");
const successtoast = document.querySelector(".alert alert-success");
const dailylogsElement = document.querySelector(".dailylogs");
const API_url = "http://localhost:5000/dailylogs";

loadingElement.style.display = "";

listAllDailylogs();

form.addEventListener("submit", event => {
  event.preventDefault();
  const formData = new FormData(form);
  const username = formData.get("username");
  const discussion = formData.get("discussion");

  const dailylog = {
    username,
    discussion
  };

  console.log(dailylog);
  form.style.display = "none";
  loadingElement.style.display = "";

  fetch(API_url, {
    method: "POST",
    body: JSON.stringify(dailylog),
    headers: {
      "content-type": "application/json"
    }
  })
    .then(response => response.json())
    .then(CreatedDailylog => {
      console.log(CreatedDailylog);
      form.reset();
      form.style.display = "";
      listAllDailylogs();
      loadingElement.style.display = "none";
    });
});
function listAllDailylogs() {
  dailylogsElement.innerHTML = "";
  fetch(API_url)
    .then(response => response.json())
    .then(dailylogs => {
      console.log(dailylogs);

      dailylogs.reverse();
      dailylogs.forEach(dailylog => {
        const div = document.createElement("div");
        div.setAttribute("class", "card bg - light mb - 3");

        const header = document.createElement("h3");
        header.textContent = dailylog.username;
        header.setAttribute("class", "card-title");

        const discussions = document.createElement("p");
        discussions.textContent = dailylog.discussion;
        discussions.setAttribute("class", "card-text");

        const date = document.createElement("small");
        date.textContent = new Date(dailylog.created);

        div.appendChild(header);
        div.appendChild(discussions);
        div.appendChild(date);

        dailylogsElement.appendChild(div);
      });
      loadingElement.style.display = "none";
    });
}
