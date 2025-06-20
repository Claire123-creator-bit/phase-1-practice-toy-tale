let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".toy-form-container");
  const toyCollection = document.getElementById("toy-collection");
  const addToyForm = document.querySelector(".add-toy-form");


  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });


  fetch("http://localhost:3000/toys")
    .then(res => res.json())
    .then(toys => {
      toys.forEach(toy => {
        renderToyCard(toy);
      });
    });


  addToyForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = e.target.name.value;
    const image = e.target.image.value;

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        name: name,
        image: image,
        likes: 0
      })
    })
      .then(res => res.json())
      .then(newToy => {
        renderToyCard(newToy);
        addToyForm.reset();
      });
  });


  function renderToyCard(toy) {
    const card = document.createElement("div");
    card.className = "card";

    const h2 = document.createElement("h2");
    h2.textContent = toy.name;

    const img = document.createElement("img");
    img.src = toy.image;
    img.className = "toy-avatar";

    const p = document.createElement("p");
    p.textContent = `${toy.likes} Likes`;

    const likeBtn = document.createElement("button");
    likeBtn.className = "like-btn";
    likeBtn.id = toy.id;
    likeBtn.textContent = "Like ❤️";

    likeBtn.addEventListener("click", () => {
      const newLikes = toy.likes + 1;

      fetch(`http://localhost:3000/toys/${toy.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          likes: newLikes
        })
      })
        .then(res => res.json())
        .then(updatedToy => {
          toy.likes = updatedToy.likes;
          p.textContent = `${updatedToy.likes} Likes`;
        });
    });

    card.append(h2, img, p, likeBtn);
    toyCollection.appendChild(card);
  }
});
