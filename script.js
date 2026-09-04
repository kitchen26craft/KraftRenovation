const form = document.querySelector(".quote-form");
const photoInput = document.getElementById("kitchen-photos");
const submitButton = document.querySelector(".submit-button");
const photoStatus = document.getElementById("photo-status");
const successMessage = document.getElementById("form-success");

const photo1 = document.getElementById("photo-1");
const photo2 = document.getElementById("photo-2");
const photo3 = document.getElementById("photo-3");

const nameInput = form.querySelector('[name="name"]');
const phoneInput = form.querySelector('[name="phone"]');
const emailInput = form.querySelector('[name="email"]');
const serviceInput = form.querySelector('[name="service"]');

const interestedProject =
    document.getElementById("interested-project");

const honeypot = document.querySelector(".honeypot");

const cloudName = "ss8g0sm6";
const uploadPreset = "website_uploads";

const MAX_PHOTOS = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024;


// SHOW SELECTED PHOTOS

photoInput.addEventListener("change", function() {
    const files = Array.from(photoInput.files);

    if (files.length === 0) {
        photoStatus.innerHTML = "No photos selected";
        return;
    }

    if (files.length > MAX_PHOTOS) {
        alert("You can upload up to 3 photos.");

        photoInput.value = "";
        photoStatus.innerHTML = "No photos selected";

        return;
    }

    for (const file of files) {
        if (file.size > MAX_FILE_SIZE) {
            alert(`${file.name} is larger than 5 MB.`);

            photoInput.value = "";
            photoStatus.innerHTML = "No photos selected";

            return;
        }
    }

    let photoList =
        `<strong>${files.length} photo${files.length > 1 ? "s" : ""} selected</strong><br>`;

    files.forEach((file, index) => {
        const sizeInMB =
            (file.size / (1024 * 1024)).toFixed(2);

        photoList +=
            `${index + 1}. ${file.name} (${sizeInMB} MB)<br>`;
    });

    photoStatus.innerHTML = photoList;
});


// VALIDATE FORM

function validateForm() {
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const email = emailInput.value.trim();
    const service = serviceInput.value;

    if (name.length < 2) {
        alert("Please enter your name.");
        nameInput.focus();
        return false;
    }

    const phoneDigits =
        phone.replace(/\D/g, "");

    if (phoneDigits.length < 10) {
        alert("Please enter a valid phone number.");
        phoneInput.focus();
        return false;
    }

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        emailInput.focus();
        return false;
    }

    if (!service) {
        alert("Please select a service.");
        serviceInput.focus();
        return false;
    }

    return true;
}


// UPLOAD ONE PHOTO TO CLOUDINARY

async function uploadPhoto(file) {
    const cloudinaryData = new FormData();

    cloudinaryData.append("file", file);
    cloudinaryData.append("upload_preset", uploadPreset);

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            body: cloudinaryData
        }
    );

    let result;

    try {
        result = await response.json();
    } catch (error) {
        result = {};
    }

    if (!response.ok) {
        const cloudinaryMessage =
            (result &&
                result.error &&
                result.error.message) ||
            "Unknown Cloudinary upload error";

        throw new Error(
            `${file.name}: ${cloudinaryMessage}`
        );
    }

    return result.secure_url;
}


// WAIT FOR SCREEN UPDATE

function waitForScreenUpdate() {
    return new Promise((resolve) => {
        requestAnimationFrame(() => {
            requestAnimationFrame(resolve);
        });
    });
}


// FORM SUBMIT

form.addEventListener("submit", async function(event) {
    event.preventDefault();

    // PROJECT REFERRAL

    const urlParams =
        new URLSearchParams(window.location.search);

    const projectFromUrl =
        urlParams.get("project");

    const projectNames = {
        "project-1": "Project 1",
        "project-2": "Project 2",
        "project-3": "Project 3"
    };

    if (interestedProject) {

        if (projectFromUrl) {
            interestedProject.value =
                projectNames[projectFromUrl] || projectFromUrl;
        } else {
            interestedProject.value = "";
        }
    }
    successMessage.classList.remove("show");


    // HONEYPOT

    if (
        honeypot &&
        honeypot.value.trim() !== ""
    ) {
        return;
    }


    // FORM VALIDATION

    if (!validateForm()) {
        return;
    }


    const files =
        Array.from(photoInput.files);


    // PHOTO COUNT

    if (files.length > MAX_PHOTOS) {
        alert("You can upload up to 3 photos.");
        return;
    }


    // PHOTO SIZE

    for (const file of files) {
        if (file.size > MAX_FILE_SIZE) {
            alert(
                `${file.name} is larger than 5 MB.`
            );

            return;
        }
    }


    submitButton.disabled = true;


    try {
        let uploadedUrls = [];


        // CLOUDINARY

        if (files.length > 0) {
            submitButton.textContent =
                `Uploading ${files.length} Photo${files.length > 1 ? "s" : ""}...`;

            uploadedUrls =
                await Promise.all(
                    files.map((file) =>
                        uploadPhoto(file)
                    )
                );
        }


        // HIDDEN PHOTO URLS

        photo1.value =
            uploadedUrls[0] || "";

        photo2.value =
            uploadedUrls[1] || "";

        photo3.value =
            uploadedUrls[2] || "";


        // FORMSPREE

        submitButton.textContent =
            "Submitting...";

        const formData =
            new FormData(form);

        const web3Response = await fetch(
            "https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            }
        );

        const web3Result = await web3Response.json();

        if (!web3Response.ok || !web3Result.success) {
            throw new Error(
                web3Result.message ||
                "Form submission failed."
            );
        }

        // SUCCESS

        form.reset();

        photo1.value = "";
        photo2.value = "";
        photo3.value = "";

        photoStatus.innerHTML =
            "No photos selected";

        submitButton.disabled = false;
        submitButton.textContent =
            "Submit Request";

        successMessage.classList.add("show");

        setTimeout(function() {
            successMessage.classList.remove("show");
        }, 7000);


    } catch (error) {
        console.error(error);

        submitButton.disabled = false;
        submitButton.textContent =
            "Submit Request";

        alert(
            error.message ||
            "Something went wrong. Please try again."
        );
    }
});
// ========================================
// PROJECT HOVER SLIDESHOW
// ========================================

const projectSlideshows =
    document.querySelectorAll(".project-slideshow");

projectSlideshows.forEach((project) => {

    const image = project.querySelector("img");

    const images = project.dataset.images
        .split(",")
        .map(src => src.trim())
        .filter(Boolean);

    if (!image || images.length < 2) {
        return;
    }

    const coverImage = images[0];

    let currentIndex = 0;
    let slideshowInterval = null;


    project.addEventListener("mouseenter", () => {

        // Prevent multiple intervals
        if (slideshowInterval) {
            return;
        }

        currentIndex = 1;

        // Show second photo immediately
        image.src = images[currentIndex];

        slideshowInterval = setInterval(() => {

            currentIndex++;

            if (currentIndex >= images.length) {
                currentIndex = 0;
            }

            image.src = images[currentIndex];

        }, 1200);

    });


    project.addEventListener("mouseleave", () => {

        clearInterval(slideshowInterval);

        slideshowInterval = null;
        currentIndex = 0;

        // Return to cover
        image.src = coverImage;

    });

});
// ========================================
// PROJECT LIGHTBOX
// ========================================

const lightbox = document.getElementById("lightbox");

if (lightbox) {

    const lightboxImage =
        document.getElementById("lightbox-image");

    const lightboxClose =
        document.getElementById("lightbox-close");

    const lightboxPrev =
        document.getElementById("lightbox-prev");

    const lightboxNext =
        document.getElementById("lightbox-next");

    const lightboxCounter =
        document.getElementById("lightbox-counter");


    const projectImages = Array.from(
        document.querySelectorAll(
            ".project-main-image img, .project-gallery img"
        )
    );

    let currentImageIndex = 0;


    function showImage(index) {

        if (index < 0) {
            index = projectImages.length - 1;
        }

        if (index >= projectImages.length) {
            index = 0;
        }

        currentImageIndex = index;

        lightboxImage.src =
            projectImages[currentImageIndex].src;

        lightboxImage.alt =
            projectImages[currentImageIndex].alt;

        lightboxCounter.textContent =
            `${currentImageIndex + 1} / ${projectImages.length}`;
    }


    function openLightbox(index) {

        showImage(index);

        lightbox.classList.add("show");

        document.body.style.overflow = "hidden";
    }


    function closeLightbox() {

        lightbox.classList.remove("show");

        document.body.style.overflow = "";
    }


    projectImages.forEach((image, index) => {

        image.addEventListener("click", () => {
            openLightbox(index);
        });

    });


    lightboxPrev.addEventListener("click", () => {
        showImage(currentImageIndex - 1);
    });


    lightboxNext.addEventListener("click", () => {
        showImage(currentImageIndex + 1);
    });


    lightboxClose.addEventListener("click", () => {
        closeLightbox();
    });


    // Click dark background to close

    lightbox.addEventListener("click", (event) => {

        if (event.target === lightbox) {
            closeLightbox();
        }

    });


    // Keyboard controls

    document.addEventListener("keydown", (event) => {

        if (!lightbox.classList.contains("show")) {
            return;
        }

        if (event.key === "Escape") {
            closeLightbox();
        }

        if (event.key === "ArrowLeft") {
            showImage(currentImageIndex - 1);
        }

        if (event.key === "ArrowRight") {
            showImage(currentImageIndex + 1);
        }

    });

}
// ========================================
// SERVICE MODAL
// ========================================

const serviceCards =
    document.querySelectorAll(".service-clickable");

const serviceModal =
    document.getElementById("service-modal");

const serviceModalClose =
    document.getElementById("service-modal-close");

const serviceModalTitle =
    document.getElementById("service-modal-title");

const serviceModalDescription =
    document.getElementById("service-modal-description");

const serviceModalGallery =
    document.getElementById("service-modal-gallery");

const serviceModalQuote =
    document.getElementById("service-modal-quote");


const serviceData = {

    installation: {
        title: "Kitchen Installation",

        description: "Professional kitchen installation with careful attention to layout, alignment and finishing details. We install cabinetry and kitchen components to create a clean, functional and professionally finished space.",

        images: [
            "images/services/installation/1.jpg",
            "images/services/installation/2.jpg",
            "images/services/installation/3.jpg"
        ],

        formValue: "Kitchen Installation"
    },


    renovation: {
        title: "Kitchen Renovation",

        description: "Complete kitchen renovation services designed to transform outdated spaces into functional and modern kitchens. Projects can include cabinetry, countertops, fixtures and finishing work.",

        images: [
            "images/services/renovation/1.jpg",
            "images/services/renovation/2.jpg",
            "images/services/renovation/3.jpg"
        ],

        formValue: "Kitchen Renovation"
    },


    repair: {
        title: "Cabinet Repair",

        description: "Cabinet repair and adjustment services for damaged, misaligned or worn kitchen cabinetry, helping restore proper function and improve the overall appearance of your kitchen.",

        images: [
            "images/services/repair/1.jpg",
            "images/services/repair/2.jpg",
            "images/services/repair/3.jpg"
        ],

        formValue: "Cabinet Repair"
    }

};


function openServiceModal(serviceName) {

    const service = serviceData[serviceName];

    if (!service || !serviceModal) {
        return;
    }

    serviceModalTitle.textContent =
        service.title;

    serviceModalDescription.textContent =
        service.description;

    serviceModalGallery.innerHTML = "";


    service.images.forEach((imagePath) => {

        const image =
            document.createElement("img");

        image.src = imagePath;

        image.alt =
            `${service.title} project`;

        serviceModalGallery.appendChild(image);

    });


    serviceModalQuote.dataset.service =
        service.formValue;

    serviceModal.classList.add("show");

    document.body.style.overflow = "hidden";
}


function closeServiceModal() {

    if (!serviceModal) {
        return;
    }

    serviceModal.classList.remove("show");

    document.body.style.overflow = "";
}


serviceCards.forEach((card) => {

    card.addEventListener("click", () => {

        openServiceModal(
            card.dataset.service
        );

    });

});


if (serviceModalClose) {

    serviceModalClose.addEventListener(
        "click",
        closeServiceModal
    );

}


if (serviceModal) {

    serviceModal.addEventListener(
        "click",
        (event) => {

            if (event.target === serviceModal) {
                closeServiceModal();
            }

        }
    );

}


document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            serviceModal &&
            serviceModal.classList.contains("show")
        ) {
            closeServiceModal();
        }

    }
);


// ========================================
// GET QUOTE FROM SERVICE MODAL
// ========================================

if (serviceModalQuote) {

    serviceModalQuote.addEventListener(
        "click",
        () => {

            const serviceSelect =
                document.querySelector(
                    'select[name="service"]'
                );

            if (
                serviceSelect &&
                serviceModalQuote.dataset.service
            ) {
                serviceSelect.value =
                    serviceModalQuote.dataset.service;
            }

            closeServiceModal();

        }
    );

}