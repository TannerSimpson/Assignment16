const craftsContainer = document.getElementById('crafts-container');
const modal = document.getElementById('myModal');
const close = document.getElementsByClassName('close')[0];
const popupTitle = document.getElementById('popup-title');
const popupImage = document.getElementById('popup-image');
const popupDescription = document.getElementById('popup-description');
const popupSupplies = document.getElementById('popup-supplies');

// Function to create craft elements
function createCraftElement(craft) {
    const craftDiv = document.createElement('div');
    craftDiv.classList.add('craft');

    const image = document.createElement('img');
    image.src = 'images/' + craft.image;
    image.alt = craft.name;

    craftDiv.appendChild(image);

    craftDiv.addEventListener('click', function () {
        popupTitle.textContent = craft.name;
        popupImage.src = 'images/' + craft.image;
        popupDescription.textContent = "Description: " + craft.description;
        popupSupplies.innerHTML = "Supplies: " + '';
        craft.supplies.forEach(function (supply) {
            const li = document.createElement('li');
            li.textContent = supply;
            popupSupplies.appendChild(li);
        });
        modal.style.display = 'block';
    });

    return craftDiv;
}

// Populate crafts from JSON file
fetch('json/crafts.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(craft => {
            const craftElement = createCraftElement(craft);
            craftsContainer.appendChild(craftElement);
        });
    })
    .catch(error => console.error('Error fetching crafts:', error));

// Close modal when X button is clicked
close.onclick = function () {
    modal.style.display = 'none';
}

// Close modal when user clicks outside the modal
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}