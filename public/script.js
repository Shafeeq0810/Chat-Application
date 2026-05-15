const username = prompt("Enter your name");
const socket = io();

const form = document.getElementById("form");

const input = document.getElementById("input");

const messages = document.getElementById("messages");

form.addEventListener("submit", (e) => {

    e.preventDefault();

    if (input.value) {

        socket.emit("chat message", {
    user: username,
    text: input.value
});

        input.value = "";
    }
});

socket.on("chat message", (msg) => {

    const item = document.createElement("li");

    item.textContent =
    msg.user + ": " + msg.text;

    messages.appendChild(item);
});