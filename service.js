// ========================================
// SERVICE GALLERY LIGHTBOX
// ========================================

const serviceGalleryImages =
    Array.from(
        document.querySelectorAll(".service-page-gallery img")
    );

const serviceLightbox =
    document.getElementById("service-lightbox");

const serviceLightboxImage =
    document.getElementById("service-lightbox-image");

const serviceLightboxClose =
    document.getElementById("service-lightbox-close");

const serviceLightboxPrev =
    document.getElementById("service-lightbox-prev");

const serviceLightboxNext =
    document.getElementById("service-lightbox-next");

const serviceLightboxCounter =
    document.getElementById("service-lightbox-counter");


let currentServiceImageIndex = 0;


// ========================================
// SHOW IMAGE
// ========================================

function showServiceImage(index) {

    if (index < 0) {
        index = serviceGalleryImages.length - 1;
    }

    if (index >= serviceGalleryImages.length) {
        index = 0;
    }

    currentServiceImageIndex = index;

    const currentImage =
        serviceGalleryImages[currentServiceImageIndex];

    serviceLightboxImage.src =
        currentImage.src;

    serviceLightboxImage.alt =
        currentImage.alt;

    serviceLightboxCounter.textContent =
        `${currentServiceImageIndex + 1} / ${serviceGalleryImages.length}`;
}


// ========================================
// OPEN LIGHTBOX
// ========================================

function openServiceLightbox(index) {

    showServiceImage(index);

    serviceLightbox.classList.add("show");

    document.body.style.overflow = "hidden";
}


// ========================================
// CLOSE LIGHTBOX
// ========================================

function closeServiceLightbox() {

    serviceLightbox.classList.remove("show");

    document.body.style.overflow = "";
}


// ========================================
// CLICK GALLERY IMAGE
// ========================================

serviceGalleryImages.forEach((image, index) => {

    image.addEventListener("click", () => {

        openServiceLightbox(index);

    });

});


// ========================================
// PREVIOUS IMAGE
// ========================================

serviceLightboxPrev.addEventListener("click", () => {

    showServiceImage(
        currentServiceImageIndex - 1
    );

});


// ========================================
// NEXT IMAGE
// ========================================

serviceLightboxNext.addEventListener("click", () => {

    showServiceImage(
        currentServiceImageIndex + 1
    );

});


// ========================================
// CLOSE BUTTON
// ========================================

serviceLightboxClose.addEventListener("click", () => {

    closeServiceLightbox();

});


// ========================================
// CLICK DARK BACKGROUND TO CLOSE
// ========================================

serviceLightbox.addEventListener("click", (event) => {

    if (event.target === serviceLightbox) {

        closeServiceLightbox();

    }

});


// ========================================
// KEYBOARD CONTROLS
// ========================================

document.addEventListener("keydown", (event) => {

    if (!serviceLightbox.classList.contains("show")) {
        return;
    }

    if (event.key === "Escape") {

        closeServiceLightbox();

    }

    if (event.key === "ArrowLeft") {

        showServiceImage(
            currentServiceImageIndex - 1
        );

    }

    if (event.key === "ArrowRight") {

        showServiceImage(
            currentServiceImageIndex + 1
        );

    }

});