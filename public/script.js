const craftsContainer = document.getElementById('crafts-container');
const modal = document.getElementById('myModal');
const addModal = document.getElementById('addModal');
const addCraftBtn = document.getElementById('addCraftBtn');
const close = document.getElementsByClassName('close');
const popupTitle = document.getElementById('popup-title');
const popupImage = document.getElementById('popup-image');
const popupDescription = document.getElementById('popup-description');
const popupSupplies = document.getElementById('popup-supplies');
const addCraftForm = document.getElementById('addCraftForm');
const addSupplyBtn = document.getElementById('addSupply');

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

addCraftBtn.addEventListener('click', function() {
    addModal.style.display = 'block';
});

Array.from(close).forEach(function(elem) {
    elem.addEventListener('click', function() {
        this.parentNode.parentNode.style.display = 'none';
    });
});

addSupplyBtn.addEventListener('click', function() {
    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'supplies[]';
    input.required = true;
    addCraftForm.insertBefore(input, this);
});

addCraftForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(this);

    try {
        const response = await fetch('/api/crafts', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to add craft');
        }

        addModal.style.display = 'none';
        location.reload();
    } catch (error) {
        console.error('Error adding craft:', error);
    }
});

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