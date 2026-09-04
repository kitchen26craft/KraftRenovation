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
        image.addEventListener("click", function() {
            openLightbox(index);
        });
    });


    lightboxPrev.addEventListener("click", function() {
        showImage(currentImageIndex - 1);
    });


    lightboxNext.addEventListener("click", function() {
        showImage(currentImageIndex + 1);
    });


    lightboxClose.addEventListener("click", function() {
        closeLightbox();
    });


    lightbox.addEventListener("click", function(event) {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });


    document.addEventListener("keydown", function(event) {
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
    // ========================================
    // MOBILE SWIPE
    // ========================================

    let touchStartX = 0;
    let touchEndX = 0;

    const MIN_SWIPE_DISTANCE = 50;


    // Finger touches screen

    lightbox.addEventListener(
        "touchstart",
        function(event) {
            touchStartX =
                event.changedTouches[0].screenX;
        }, { passive: true }
    );


    // Finger leaves screen

    lightbox.addEventListener(
        "touchend",
        function(event) {
            touchEndX =
                event.changedTouches[0].screenX;

            handleSwipe();
        }, { passive: true }
    );


    function handleSwipe() {

        const swipeDistance =
            touchEndX - touchStartX;


        // Swipe LEFT → next image

        if (swipeDistance < -MIN_SWIPE_DISTANCE) {
            showImage(currentImageIndex + 1);
        }


        // Swipe RIGHT → previous image

        if (swipeDistance > MIN_SWIPE_DISTANCE) {
            showImage(currentImageIndex - 1);
        }
    }
}