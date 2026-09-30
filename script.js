/* =========================================================
   ABELARDO PANGAN BABAC - PORTFOLIO
   Main JavaScript
========================================================= */


/* =========================================================
   PAGE LOADER
========================================================= */

window.addEventListener("load", () => {

    const loader = document.getElementById("pageLoader");

    setTimeout(() => {
        loader.classList.add("hidden");
    }, 500);

});


/* =========================================================
   DOM ELEMENTS
========================================================= */

const header = document.getElementById("header");
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");

const scrollTopButton =
    document.getElementById("scrollTop");

const contactForm =
    document.getElementById("contactForm");

const formNotification =
    document.getElementById("formNotification");

const toast =
    document.getElementById("toast");

const currentYear =
    document.getElementById("currentYear");


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

function toggleMobileMenu() {

    const isOpen =
        navMenu.classList.toggle("open");

    menuToggle.classList.toggle(
        "active",
        isOpen
    );

    menuToggle.setAttribute(
        "aria-expanded",
        isOpen
    );

    document.body.classList.toggle(
        "menu-open",
        isOpen
    );
}


menuToggle.addEventListener(
    "click",
    toggleMobileMenu
);


/* Close mobile menu after clicking a link */

navLinks.forEach((link) => {

    link.addEventListener("click", () => {

        navMenu.classList.remove("open");

        menuToggle.classList.remove("active");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        document.body.classList.remove(
            "menu-open"
        );

    });

});


/* Close mobile menu when pressing Escape */

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        navMenu.classList.remove("open");

        menuToggle.classList.remove("active");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        document.body.classList.remove(
            "menu-open"
        );
    }

});


/* =========================================================
   HEADER SCROLL EFFECT
========================================================= */

function updateHeader() {

    if (window.scrollY > 30) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }

}


window.addEventListener(
    "scroll",
    updateHeader,
    { passive: true }
);

updateHeader();


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

const sections = document.querySelectorAll(
    "main section[id]"
);


function updateActiveNavigation() {

    const scrollPosition =
        window.scrollY + 150;

    let currentSection = "home";

    sections.forEach((section) => {

        const sectionTop =
            section.offsetTop;

        const sectionHeight =
            section.offsetHeight;

        if (
            scrollPosition >= sectionTop &&
            scrollPosition < sectionTop + sectionHeight
        ) {
            currentSection =
                section.getAttribute("id");
        }

    });


    navLinks.forEach((link) => {

        const target =
            link.getAttribute("href");

        link.classList.toggle(
            "active",
            target === `#${currentSection}`
        );

    });

}


window.addEventListener(
    "scroll",
    updateActiveNavigation,
    { passive: true }
);

updateActiveNavigation();


/* =========================================================
   TYPING EFFECT
========================================================= */

const typingElement =
    document.getElementById("typingText");

const typingWords = [
    "Aspiring Web Developer",
    "IT Student",
    "Problem Solver",
    "Future Software Developer"
];

let wordIndex = 0;
let characterIndex = 0;

let isDeleting = false;

function typeText() {

    const currentWord =
        typingWords[wordIndex];

    if (!isDeleting) {

        characterIndex++;

        typingElement.textContent =
            currentWord.substring(
                0,
                characterIndex
            );

        if (
            characterIndex ===
            currentWord.length
        ) {

            isDeleting = true;

            setTimeout(
                typeText,
                1800
            );

            return;
        }

    } else {

        characterIndex--;

        typingElement.textContent =
            currentWord.substring(
                0,
                characterIndex
            );

        if (characterIndex === 0) {

            isDeleting = false;

            wordIndex =
                (wordIndex + 1) %
                typingWords.length;

        }

    }


    const speed =
        isDeleting
            ? 45
            : 75;

    setTimeout(
        typeText,
        speed
    );
}


if (typingElement) {
    setTimeout(typeText, 1000);
}


/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealElements =
    document.querySelectorAll(".reveal");


const revealObserver =
    new IntersectionObserver(
        (entries, observer) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "visible"
                    );

                    observer.unobserve(
                        entry.target
                    );

                }

            });

        },
        {
            threshold: 0.12
        }
    );


revealElements.forEach((element) => {

    revealObserver.observe(element);

});


/* =========================================================
   SCROLL TO TOP
========================================================= */

function updateScrollTopButton() {

    if (window.scrollY > 500) {

        scrollTopButton.classList.add(
            "show"
        );

    } else {

        scrollTopButton.classList.remove(
            "show"
        );

    }

}


window.addEventListener(
    "scroll",
    updateScrollTopButton,
    { passive: true }
);


scrollTopButton.addEventListener(
    "click",
    () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


/* =========================================================
   PROJECT PLACEHOLDER LINKS
========================================================= */

const placeholderLinks =
    document.querySelectorAll(
        ".placeholder-link"
    );


placeholderLinks.forEach((link) => {

    link.addEventListener("click", (event) => {

        event.preventDefault();

        const message =
            link.dataset.placeholder ||
            "This project link has not been added yet.";

        showToast(message);

    });

});


/* =========================================================
   CONTACT FORM
========================================================= */

contactForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();

        /*
         * There is intentionally no backend here.
         * This prevents the portfolio from pretending
         * that an email was actually sent.
         */

        formNotification.textContent =
            "Your message is ready, but this form is not connected to a backend yet. Connect it to a server-side email service before using it for real messages.";

        formNotification.classList.add(
            "show"
        );

        showToast(
            "Backend connection is required to send messages."
        );

    }
);


/* =========================================================
   TOAST NOTIFICATION
========================================================= */

let toastTimer;


function showToast(message) {

    clearTimeout(toastTimer);

    toast.textContent = message;

    toast.classList.add("show");

    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 3500);

}


/* =========================================================
   CURRENT YEAR
========================================================= */

if (currentYear) {

    currentYear.textContent =
        new Date().getFullYear();

}


/* =========================================================
   PREVENT EMPTY HASH LINKS FROM JUMPING
========================================================= */

document
    .querySelectorAll('a[href="#"]')
    .forEach((link) => {

        link.addEventListener(
            "click",
            (event) => {

                /*
                 * Placeholder links are handled
                 * separately above.
                 */

                if (
                    link.classList.contains(
                        "placeholder-link"
                    )
                ) {
                    return;
                }

                event.preventDefault();

            }
        );

    });


/* =========================================================
   CLOSE MOBILE MENU WHEN RESIZING
========================================================= */

window.addEventListener(
    "resize",
    () => {

        if (window.innerWidth > 760) {

            navMenu.classList.remove(
                "open"
            );

            menuToggle.classList.remove(
                "active"
            );

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            document.body.classList.remove(
                "menu-open"
            );

        }

    }
);


/* =========================================================
   PROJECT CARD KEYBOARD ACCESSIBILITY
========================================================= */

document
    .querySelectorAll(".project-card")
    .forEach((card) => {

        card.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Enter"
                ) {

                    const link =
                        card.querySelector(
                            ".project-link"
                        );

                    if (link) {
                        link.click();
                    }

                }

            }
        );

    });