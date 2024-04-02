document.addEventListener("DOMContentLoaded", function() {
    const craftsContainer = document.getElementById('crafts-container');
    const modal = document.getElementById('myModal');
    const modal2 = document.getElementById('myModaladd'); 
    const close = document.querySelector('.close');
    const close2 = document.querySelector('.close2');
    const plus = document.getElementById('addlink');
    const popupTitle = document.getElementById('popup-title');
    const popupImage = document.getElementById('popup-image');
    const popupDescription = document.getElementById('popup-description');
    const popupSupplies = document.getElementById('popup-supplies');

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

    fetch('json/crafts.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(craft => {
                const craftElement = createCraftElement(craft);
                craftsContainer.appendChild(craftElement);
            });
        })
        .catch(error => console.error('Error fetching crafts:', error));

    const togglePlus = () => {
        document.getElementById('name').value = '';
        document.getElementById('description').value = '';
        const inputSection = document.getElementById("modaladd-content");
        const existingImages = inputSection.querySelectorAll('.inputimg');
        existingImages.forEach(img => img.remove());
        modal2.style.display = "block";
    };

    plus.onclick = togglePlus;

    close2.onclick = function () {
        modal2.style.display = 'none';
    };

    window.onclick = function (event) {
        if (event.target == modal2) {
            modal2.style.display = 'none';
        }
    };

    close.onclick = function () {
        modal.style.display = 'none';
    };

    const imageInput = document.getElementById("imagebutton");
    imageInput.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            const inputImg = document.createElement("img");
            inputImg.classList.add("inputimg");
            inputImg.src = URL.createObjectURL(file);
            const inputSection = document.getElementById("modaladd-content");
            const existingImages = inputSection.querySelectorAll('.inputimg');
            existingImages.forEach(img => img.remove());
            inputSection.appendChild(inputImg);
            imageInput.files = event.target.files;
        }
    });

    const addSupplyButton = document.getElementById("supplybutton");
    addSupplyButton.onclick = function () {
        const supplyContainer = document.getElementById("supply-container");
        const newSupplyInput = document.createElement("input");
        newSupplyInput.type = "text";
        newSupplyInput.placeholder = "Enter supply";
        newSupplyInput.classList.add("supply-input");
        supplyContainer.appendChild(newSupplyInput);
    };

    const saveButton = document.getElementById("savebutton");
    saveButton.onclick = function () {
        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        const supplies = [];
        document.querySelectorAll('.supply-input').forEach(input => {
            supplies.push(input.value);
        });
    
        const imageInput = document.getElementById('imagebutton');
        if (imageInput.files.length === 0) {
            console.error('No image selected');
            return;
        }
        const imageFile = imageInput.files[0];
        const imageUrl = URL.createObjectURL(imageFile);
    
        const formData = {
            name: name,
            description: description,
            supplies: supplies,
            image: imageUrl
        };
    
        fetch('/api/crafts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Craft successfully added:', data);
            modal2.style.display = 'none';
            
            // Create a new craft element with the data received from the server
            const newCraftElement = createCraftElement(data[data.length - 1]);
    
            // Append the new craft element to the craftsContainer
            craftsContainer.appendChild(newCraftElement);
        })
        .catch(error => {
            console.error('Error saving craft:', error);
        });
    };

    const cancelButton = document.getElementById("cancelbutton");
    cancelButton.onclick = function () {
        modal2.style.display = 'none';
    };
});