document.addEventListener("DOMContentLoaded", function () {

    // ==============================
    // Image gallery functionality
    // ==============================
    const galleryImages = document.querySelectorAll(".gallery img");
    const modal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modalImage");
    const closeModal = document.getElementById("closeModal");

    galleryImages.forEach(function (image) {
        image.addEventListener("click", function () {
            if (modal && modalImage) {
                modalImage.src = image.src;
                modalImage.alt = image.alt;
                modal.classList.add("open");
            }
        });
    });

    if (closeModal && modal) {
        closeModal.addEventListener("click", function () {
            modal.classList.remove("open");
        });
    }

    if (modal) {
        modal.addEventListener("click", function (event) {
            if (event.target === modal) {
                modal.classList.remove("open");
            }
        });
    }

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && modal) {
            modal.classList.remove("open");
        }
    });


    // ==============================
    // Product search
    // ==============================
    const productSearch = document.getElementById("productSearch");
    const productList = document.getElementById("productList");
    const noProducts = document.getElementById("noProducts");

    if (productSearch && productList) {
        productSearch.addEventListener("input", function () {
            const searchValue = productSearch.value.toLowerCase();
            let visibleProducts = 0;

            productList.querySelectorAll(".product-card").forEach(function (card) {
                const matches = card.textContent
                    .toLowerCase()
                    .includes(searchValue);

                card.hidden = !matches;

                if (matches) {
                    visibleProducts++;
                }
            });

            if (noProducts) {
                noProducts.hidden = visibleProducts > 0;
            }
        });
    }


    // ==============================
    // News search
    // ==============================
    const newsSearch = document.getElementById("newsSearch");
    const newsList = document.getElementById("newsList");
    const noNews = document.getElementById("noNews");

    if (newsSearch && newsList) {
        newsSearch.addEventListener("input", function () {
            const searchValue = newsSearch.value.toLowerCase();
            let visibleNews = 0;

            newsList.querySelectorAll(".news-card").forEach(function (card) {
                const matches = card.textContent
                    .toLowerCase()
                    .includes(searchValue);

                card.hidden = !matches;

                if (matches) {
                    visibleNews++;
                }
            });

            if (noNews) {
                noNews.hidden = visibleNews > 0;
            }
        });
    }


    // ==============================
    // Contact form AJAX submission
    // ==============================
    const contactForms = document.querySelectorAll(".contact-form");

    contactForms.forEach(function (form) {
        form.addEventListener("submit", async function (event) {
            event.preventDefault();

            const message = form.querySelector(".form-message");
            const submitButton = form.querySelector(
                'button[type="submit"]'
            );

            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            if (!message || !submitButton) {
                console.error("Contact form message or submit button is missing.");
                return;
            }

            const originalButtonText = submitButton.textContent;

            submitButton.disabled = true;
            submitButton.textContent = "Sending...";
            message.textContent = "Sending your message...";
            message.style.color = "";

            try {
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());

                data._subject = "New Forever Cool Contact Message";

                const response = await fetch(
                    "https://formsubmit.co/ajax/rikhotsosimphiwe@icloud.com",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                        body: JSON.stringify(data)
                    }
                );

                const result = await response.json();

                console.log("FormSubmit response:", result);

                if (
                    !response.ok ||
                    result.success === false ||
                    result.success === "false"
                ) {
                    throw new Error(
                        result.message || "The message could not be sent."
                    );
                }

                message.textContent =
                    "Thank you! Your message has been sent successfully.";
                message.style.color = "green";

                form.reset();

            } catch (error) {
                console.error("Contact form error:", error);

                message.textContent =
                    "Unable to send your message. Please try again. " +
                    error.message;

                message.style.color = "red";

            } finally {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });
    });


    // ==============================
    // Product enquiry calculator
    // ==============================
    const enquiryForm = document.getElementById("enquiryForm");

    if (enquiryForm) {
        const product = document.getElementById("product");
        const quantity = document.getElementById("quantity");
        const enquiryType = document.getElementById("enquiryType");
        const result = document.getElementById("enquiryResult");

        // Current Forever Cool product prices
        const prices = {
            "Vests": 299,
            "T-Shirts": 499,
            "Hoodies": 599
        };

        enquiryForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!enquiryForm.checkValidity()) {
                enquiryForm.reportValidity();
                return;
            }

            if (!product || !quantity || !enquiryType || !result) {
                console.error("A product enquiry form element is missing.");
                return;
            }

            const selectedProduct = product.value;
            const selectedQuantity = Number(quantity.value);
            const price = prices[selectedProduct];

            if (
                !price ||
                !Number.isInteger(selectedQuantity) ||
                selectedQuantity < 1 ||
                selectedQuantity > 20
            ) {
                result.textContent =
                    "Please select a valid product and quantity between 1 and 20.";
                result.style.color = "red";
                return;
            }

            const total = price * selectedQuantity;

            result.textContent =
                "Your enquiry is ready! " +
                selectedProduct + " costs R" + price.toFixed(2) +
                " each. Your estimated total for " +
                selectedQuantity + " item(s) is R" +
                total.toFixed(2) +
                ". Availability must be confirmed by Forever Cool. " +
                "Enquiry type: " + enquiryType.value + ".";

            result.style.marginTop = "15px";
            result.style.color = "green";
        });
    }

});