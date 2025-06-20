
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

function set_search_bar_state(show) {
    const search_field = document.getElementById("middle-component-bottom");

    toggle_class(!show, search_field, "invisible", "opacity-0");
    toggle_class(show, search_field, "w-1/2");
}

function toggle_search_bar() {
    set_search_bar_state(document.getElementById("middle-component-bottom").classList.contains("invisible"));
}

function set_component_config({ show_search, middle_component_text, show_trash_can, middle_component_action }) {
    const middle = document.getElementById("middle-component-bottom");

    toggle_class(!show_search, "search-button", "invisible");
    toggle_class(!show_trash_can, "trash-can", "invisible");

    if (show_search) {
        middle.children[0].type = "text";
        middle.children[0].value = "";
        set_search_bar_state(false);
        return;
    }

    if (middle_component_text !== null) {
        set_search_bar_state(true);
        middle.children[0].type = "button";
        middle.children[0].value = middle_component_text;
        middle.children[0].onclick = middle_component_action;
    }
}

let saved_config;

function get_current_config() {
    const middle = document.getElementById("middle-component-bottom");
    const show_search = !document.getElementById("search-button").classList.contains("invisible");

    return {
        show_search: middle.children[0].type === "text",
        middle_component_text: show_search ? null : middle.children[0].value,
        show_trash_can: !document.getElementById("trash-can").classList.contains("invisible")
    };
}

function show_menu() {
    const element = document.getElementById("main-menu");
    toggle_class(false, element, "-translate-x-full");
}

function remove_screen(element_id) {
    const element = document.getElementById(element_id);
    toggle_class(false, "app-body", "hidden");
    if (element_id === "main-menu") {
        toggle_class(true, element, "-translate-x-full");
        return;
    }

    element.parentElement.removeChild(element);
    set_component_config(saved_config);
}

function close_menu(evt) {
    let sender = null;
    let evt_parent = evt.target.parentElement;
    while (sender === null) {
        sender = evt_parent.getAttribute("sender");
        evt_parent = evt_parent.parentElement;
    }

    remove_screen(sender);
}

function hide_login_button_page() {
    toggle_class(true, "login-button-page", "hidden");
}

function show_page(component, component_id, bottom_component_options) {
    set_search_bar_state(false);
    const container = document.getElementById("emergent-content");
    if (container.children.length === 1)
        container.removeChild(container.children[0]);

    component.id = component_id;
    container.appendChild(component);
    toggle_class(true, "app-body", "hidden");

    saved_config = get_current_config();
    set_component_config(bottom_component_options);
}

function show_login() {
    show_page(login(), "login-form", {
        show_search: false, middle_component_text: "Iniciar sesión", show_trash_can: false,
        middle_component_action: sign_in
    });
}

function load_bag() {
    show_page(bag(), "bag-screen", {
        show_search: false, middle_component_text: "Finalizar compra", show_trash_can: true
    });
}

function load_article({imageUrl, priceTag, name, description, articleId}) {
    show_page(product_page(imageUrl, priceTag, name, description, articleId), "article-screen", {
        show_search: false, middle_component_text: null, show_trash_can: false
    });
}

function update_amount(evt) {
    const button = document.getElementById("product-amount");
    button.textContent = `Agregar ${evt.target.value} al carrito`;
}

function load_product_page(evt) {
    let element = evt.target;
    while (element.tagName.toLowerCase() !== "article")
        element = element.parentElement;

    const price = element.children[2].textContent;
    load_article({
        imageUrl: element.children[0].src,
        priceTag: price.substring(1, price.length),
        name: element.children[1].children[0].textContent,
        description: element.children[4].textContent,
        articleId: element.children[3].textContent
    });
}

function update_desc_len(evt) {
    document.getElementById("desc-length").textContent = `${evt.target.value.length}/512`;
}

function show_create_product() {
    show_page(create_product(), "create-article-screen", {
        show_search: false, middle_component_text: "Agregar producto", show_trash_can: false,
        middle_component_action: register_product
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const n = nav("store_button");
    document.getElementById("main-nav").replaceWith(n);
    const h = home();
    h.id = "app-body";
    document.getElementById("app-body").replaceWith(h);

    const div = document.getElementById("products");
    request("products", REQUEST_BASE).then(data => {
        if (data.error !== undefined) {
            set_error_msg(data.error);
            return;
        }

        data.forEach(product_data => {
            product_data = JSON.parse(product_data);
            div.appendChild(featured_article(
                "data:image/jpeg;base64," + product_data.photo, product_data.name,
                "", product_data.price, product_data.productId, product_data.description
            ));
        })
    }).catch(error => {
        console.error(error);
        set_error_msg("Ocurrió un error inesperado al listar los productos");
    });
});

let error_times = 1;

function set_error_msg(msg, title) {
    if (msg === undefined)
        return;

    if (title === undefined)
        title = "Error";

    const container = document.getElementById("error-msg");
    if (msg.length === 0) {
        error_times = 1;
        toggle_class(true, container, "translate-y-full");
        return;
    }

    toggle_class(false, container, "translate-y-full");
    document.getElementById("error-count").textContent = `${title} (${error_times})`;
    error_times++;

    document.getElementById("error-text").textContent = msg;
}
