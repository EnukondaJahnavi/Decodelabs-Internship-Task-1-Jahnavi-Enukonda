const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

let query = "";
let filter = "all";

const toast = $("#toast");


// ===============================
// TOAST NOTIFICATION
// ===============================

function notify(message) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(notify.t);

    notify.t = setTimeout(() => {
        toast.classList.remove("show");
    }, 2200);
}


// ===============================
// FILTER JOBS
// ===============================

function applyFilters() {
    let count = 0;

    $$(".job").forEach((card) => {

        const keywords = card.dataset.keywords.toLowerCase();

        const matchesQuery =
            !query ||
            keywords.includes(query.toLowerCase());

        const type = card.dataset.type;

        const remote =
            card.dataset.remote === "yes";

        const matchesFilter =
            filter === "all" ||
            (filter === "remote" && remote) ||
            type === filter;

        const visible =
            matchesQuery && matchesFilter;

        card.hidden = !visible;

        if (visible) {
            count++;
        }
    });

    $("#empty").hidden = count !== 0;
}


// ===============================
// JOB FILTER BUTTONS
// ===============================

$$(".filters button").forEach((button) => {

    button.onclick = () => {

        $$(".filters button").forEach((item) => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        filter = button.dataset.filter;

        applyFilters();
    };

});


// ===============================
// SEARCH FORM
// ===============================

$("#searchForm").onsubmit = (event) => {

    event.preventDefault();

    query = $("#keyword").value.trim();

    applyFilters();

    notify(
        query
            ? `Showing results for "${query}"`
            : "Showing all opportunities"
    );

    $("#opportunities").scrollIntoView({
        behavior: "smooth"
    });
};


// ===============================
// POPULAR SEARCHES
// ===============================

$$(".popular button").forEach((button) => {

    button.onclick = () => {

        $("#keyword").value =
            button.dataset.query;

        query = button.dataset.query;

        filter = "all";

        $$(".filters button").forEach((item) => {
            item.classList.remove("active");
        });

        $(".filters button").classList.add("active");

        applyFilters();

        $("#opportunities").scrollIntoView({
            behavior: "smooth"
        });
    };

});


// ===============================
// CLEAR / VIEW ALL
// ===============================

$("#clear").onclick = () => {

    $("#keyword").value = "";
    $("#location").value = "";

    query = "";
    filter = "all";

    $$(".filters button").forEach((item) => {
        item.classList.remove("active");
    });

    $(".filters button").classList.add("active");

    applyFilters();

    notify("All opportunities restored");
};


// ===============================
// SAVE JOBS
// ===============================

$$(".save").forEach((button) => {

    button.onclick = () => {

        const saved =
            button.getAttribute("aria-pressed") === "true";

        button.setAttribute(
            "aria-pressed",
            String(!saved)
        );

        button.classList.toggle(
            "saved",
            !saved
        );

        button.textContent =
            saved ? "♡" : "♥";

        notify(
            saved
                ? "Removed from saved jobs"
                : "Saved to your opportunities"
        );
    };

});


// ===============================
// APPLICATION DIALOG
// ===============================

const dialog = $("#dialog");
const form = $("#form");


// Open application dialog

$$(".apply").forEach((button) => {

    button.onclick = () => {

        $("#jobtitle").textContent =
            button.dataset.job;

        dialog.showModal();

        $("#name").focus();
    };

});


// Submit application

form.onsubmit = (event) => {

    if (event.submitter?.value !== "default") {
        return;
    }

    event.preventDefault();

    const job =
        $("#jobtitle").textContent;

    dialog.close();

    form.reset();

    notify(
        `Application saved for ${job}`
    );
};


// ===============================
// CAREER RESOURCES
// ===============================

$$(".resource").forEach((button) => {

    button.onclick = () => {

        notify(
            "Career guide opened for demo"
        );
    };

});


// ===============================
// MOBILE MENU
// ===============================

$("#menu").onclick = () => {

    const open =
        $("#menu").getAttribute(
            "aria-expanded"
        ) === "true";

    $("#menu").setAttribute(
        "aria-expanded",
        String(!open)
    );

    $("#mobileNav").hidden = open;
};


// Close mobile menu after clicking link

$$("#mobileNav a").forEach((link) => {

    link.onclick = () => {

        $("#menu").setAttribute(
            "aria-expanded",
            "false"
        );

        $("#mobileNav").hidden = true;
    };

});


// ===============================
// DARK MODE
// ===============================

$("#theme").onclick = () => {

    document.body.classList.toggle("dark");

    const darkMode =
        document.body.classList.contains("dark");

    localStorage.setItem(
        "careerhub-theme",
        darkMode ? "dark" : "light"
    );

    notify(
        darkMode
            ? "Dark mode enabled"
            : "Light mode enabled"
    );
};


// Restore saved theme

if (
    localStorage.getItem("careerhub-theme") ===
    "dark"
) {
    document.body.classList.add("dark");
}


// ===============================
// PROFILE BUTTON
// ===============================

$("#profile").onclick = () => {

    notify(
        "Profile dashboard coming next"
    );
};


// ===============================
// INITIALIZE
// ===============================

applyFilters();