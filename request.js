
const REQUEST_BASE = {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
};

function set_cookie(key, value) {
    const date = new Date();
    date.setTime(date.getTime() + 24 * 60 * 60 * 1000);
    document.cookie = `${key}=${value}; expires=${date.toUTCString()}`
}

function get_cookies() {
    const cookies = {};
    const all_cookies = document.cookie.split('; ');

    let count = 0;
    all_cookies.forEach(cookie => {
        count++;
        const [name, value] = cookie.split('=');
        cookies[name] = value;
    });

    return count > 0 ? cookies : null;
}

function request(url, head) {
    return fetch("buyhub/rest/" + url, head).then(async (response) => {
        const text = await response.text();
        // console.log(text);
        return JSON.parse(text);
    }).catch(error => {
        console.error(error);
    });
}

function sign_in() {
    const mail = document.getElementById("mail").value;
    const pass = document.getElementById("pass").value;
    const request_data = structuredClone(REQUEST_BASE);
    request_data.body = JSON.stringify({
        "email": mail,
        "password": pass,
    });

    request("login", request_data).then(data => {
        if (data.error !== undefined) {
            set_error_msg(data.error);
            return;
        }

        if (data.session_token === undefined || data.user_id === undefined)
            throw new Error("Session token or user id is undefined");

        set_cookie("SessionToken", data.session_token);
        set_cookie("UserId", data.user_id);

        remove_screen("login-form");
        hide_login_button_page();
    }).catch(error => {
        console.error(error);
        set_error_msg("Ocurrió un error inesperado, intenta de nuevo");
    });
}

function load_img(evt) {
    const file = evt.target.files[0];
    if (!file)
        return;

    const reader = new FileReader();
    reader.onload = function(e) {
        // reader.result contains at the beginning: "data:image/jpeg;base64,"
        const data = e.target.result.split(',')[1];
        // console.log(data);
        document.getElementById("product-image-data").textContent = data;
    };
    reader.readAsDataURL(file);
}

function register_product() {
    const name = document.getElementById("product-name").value;
    const description = document.getElementById("product-desc").value;
    const price = document.getElementById("product-price").value;
    const stock = document.getElementById("product-stock").value;
    const image = document.getElementById("product-image-data").textContent;

    const request_data = structuredClone(REQUEST_BASE);

    const cookies = get_cookies();
    request_data.headers["User-Id"] = cookies.UserId;
    request_data.headers["Session-Token"] = cookies.SessionToken;

    request_data.body = JSON.stringify({
        "name": name,
        "description": description,
        "price": price,
        "availableStock": stock,
        "photo": image,
    });

    request("products/create", request_data).then(data => {
        if (data.error !== undefined) {
            set_error_msg(data.error);
            return;
        }

        remove_screen("create-article-screen");
    }).catch(error => {
        console.error(error);
        set_error_msg("Ocurrió un error inesperado, intenta de nuevo");
    });
}

function add_to_bag(evt) {
    const article_id = evt.target.getAttribute("articleId");
    const amount = document.getElementById("selected-amount").value;

    const request_data = structuredClone(REQUEST_BASE);

    const cookies = get_cookies();
    request_data.headers["User-Id"] = cookies.UserId;
    request_data.headers["Session-Token"] = cookies.SessionToken;

    console.log(article_id);
    request_data.body = JSON.stringify({
        "id": article_id,
        "amount": amount
    });

    request("products/addToBag", request_data).then(data => {
        if (data.error !== undefined) {
            set_error_msg(data.error);
            return;
        }

        set_error_msg("Articulo(s) agregado", "Éxito");
    }).catch(error => {
        console.error(error);
        set_error_msg("Ocurrió un error inesperado, intenta de nuevo");
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const cookies = get_cookies();
    if (cookies === null || cookies.UserId === undefined || cookies.SessionToken === undefined)
        return;

    console.log("Validating user data...");
    const request_data = structuredClone(REQUEST_BASE);
    request_data.headers["User-Id"] = cookies.UserId;
    request_data.headers["Session-Token"] = cookies.SessionToken;

    request("validate", request_data).then(data => {
        if (data.error !== undefined) {
            console.error(data.error);
            return;
        }

        hide_login_button_page();
    }).catch(error => {
        console.error(error);
    });
});
