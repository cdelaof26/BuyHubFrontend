
const aboutArticles = ["my-whoami", "my-aspirations", "my-skills"];
const technologies = ["front-end", "back-end", "os", "cloud", "desktop", "scripting", "other", "tools"];
const projects = ["libBasicUI", "IPNScheduler", "PyWST", "PointMotionLib", "finbalancpp", "clima_mx", "IP-Calc", "DefendTheClockLib", "arpspoofing_tool", "pgitHash", "escomsole", "http_server", "ESCOMPong"];

let last_section = "header";
let lang_menu_visible = false;

function toggle_class(add, element, ...classes) {
    if (typeof element === "string")
        element = document.getElementById(element);

    if (element === null)
        return;

    classes.forEach(c => {
        if (add)
            element.classList.add(c);
        else
            element.classList.remove(c);
    });
}

function toggle_language_menu(show) {
    lang_menu_visible = show;
    let menu = document.getElementById("lang-menu");
    let langButton = document.getElementById("lang-button");
    toggle_class(!show, "chevron-up", "hidden");
    toggle_class(show, "chevron-down", "hidden");
    toggle_class(!show, langButton, "rounded-lg");
    toggle_class(show, langButton, "rounded-t-lg");
    toggle_class(!show, menu, "opacity-[0]", "-translate-y-full");
    toggle_class(show, menu, "lg:translate-y-10", "translate-y-8");
}

function toggle_language_menu_visibility() {
    toggle_language_menu(!lang_menu_visible);
}

function is_scrolled_into_view(element_id) {
    const element = document.getElementById(element_id);
    if (element === null)
        return false;

    const doc_view_top = window.scrollY;
    const doc_view_bottom = doc_view_top + window.innerHeight;

    const element_top = element.getBoundingClientRect().top + doc_view_top;
    const element_bottom = element_top + element.offsetHeight;

    return element_bottom <= doc_view_bottom && element_top >= doc_view_top;
}

function set_section_selected(section) {
    const id = "nav-" + section;
    last_section = section;

    ["header", "about", "portfolio"].forEach((_id) => {
        _id = "nav-" + _id;
        const e = document.getElementById(_id);
        toggle_class(id === _id, e, "border-indigo-600", "dark:border-indigo-500");
        toggle_class(id !== _id, e, "border-transparent");
    });
}

function toggle_project_set(type) {
    const id = type + "-projects";

    const esp = ["todos", "front", "escritorio", "scripting", "otros"];
    ["all", "front-end", "desktop", "scripting", "others"].forEach((_id, i) => {
        const initial_id = (is_spanish ? esp[i] : _id).replace("-end", "");

        _id = _id + "-projects";
        const title_element = document.getElementById(_id);
        const parent = title_element.parentElement;

        toggle_class(id !== _id, title_element, "lg:hidden");
        toggle_class(id !== _id, parent, "bg-body-0", "dark:bg-body-1", "lg:w-16");
        toggle_class(id === _id, parent, "lg:w-48", "text-white", "bg-gradient-to-bl", "from-indigo-500", "to-indigo-700", "dark:from-indigo-700", "dark:to-indigo-900");

        if (id === _id)
            projects.forEach(p => {
                const element = document.getElementById(p + "-project-article");
                if (i === 0)
                    toggle_class(false, element, "hidden");
                else
                    toggle_class(
                        initial_id === "all" || !document.getElementById(p + "-category").textContent.toLowerCase().includes(initial_id),
                        element, "hidden"
                    );
            });
    });
}

function header_scroll_into_view(evt) {
    let id;
    if (evt.target.id === null || !evt.target.id.includes("-header-btn"))
        id = evt.target.parentElement.id.replace("-header-btn", "");
    else
        id = evt.target.id.replace("-header-btn", "");

    const element = document.getElementById(id);
    if (element === null)
        return;
    element.scrollIntoView();
}

document.addEventListener("scroll", () => {
    if (is_scrolled_into_view("career")) {
        set_section_selected("header");

        aboutArticles.forEach(_id => {
            toggle_class(true, _id + "-article", "-translate-x-full", "opacity-[0]");
        });

        technologies.forEach((_id) => {
            toggle_class(true, _id + "-article", "translate-y-full", "opacity-[0]");
        });

        projects.forEach((_id) => {
            toggle_class(true, _id + "-project-article", "translate-y-full", "opacity-[0]");
        });
    }

    if (is_scrolled_into_view("my-whoami-article") || is_scrolled_into_view("my-skills-article")) {
        set_section_selected("about");
        aboutArticles.forEach(_id => {
            toggle_class(false, _id + "-article", "-translate-x-full", "opacity-[0]");
        });
    }

    if (is_scrolled_into_view("front-end-article") || is_scrolled_into_view("os-article")
        || is_scrolled_into_view("desktop-article") || is_scrolled_into_view("other-article")) {
        set_section_selected("about");

        technologies.forEach((_id) => {
            toggle_class(false, _id + "-article", "translate-y-full", "opacity-[0]");
        });
    }

    if (is_scrolled_into_view("project-filter") || is_scrolled_into_view("IPNScheduler-project-article")
        || is_scrolled_into_view("PointMotionLib-project-article") || is_scrolled_into_view("clima_mx-project-article")
        || is_scrolled_into_view("DefendTheClockLib-project-article") || is_scrolled_into_view("pgitHash-project-article")
        || is_scrolled_into_view("http_server-project-article")) {

        set_section_selected("portfolio");
        projects.forEach((_id) => {
            toggle_class(false, _id + "-project-article", "translate-y-full", "opacity-[0]");
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", (evt) => {
        if (!document.getElementById("lang-div").contains(evt.target))
            toggle_language_menu(false);
    });
});
