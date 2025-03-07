/* eslint-disable no-undef */
(async () => {
  const { io } = await import(
    "https://cdn.socket.io/4.8.1/socket.io.esm.min.js"
  );
  const socket = io();

  const $messageForm = document.querySelector("#message-form");
  const $messageFormInput = $messageForm.querySelector("input");
  const $messageFormButton = $messageForm.querySelector("button");
  const $sendLocation = document.querySelector("#send-location");
  const $messagesDiv = document.querySelector("#messages");

  // Templates
  const messageTemplate = document.querySelector("#msg-template").innerHTML;
  const locationMsgTemplate = document.querySelector(
    "#location-msg-template"
  ).innerHTML;
  const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

  // Options
  const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

  const autoscroll = () => {
    const $newMessage = $messagesDiv.lastElementChild;

    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

    const visibleHeight = $messagesDiv.offsetHeight;

    const containerHeight = $messagesDiv.scrollHeight;

    const scrollOffset = $messagesDiv.scrollTop + visibleHeight;

    if (containerHeight - newMessageHeight <= scrollOffset) {
      $messagesDiv.scrollTop = $messagesDiv.scrollHeight;
    }
  };

  socket.on("message", (message) => {
    const html = Mustache.render(messageTemplate, {
      username: message.username,
      message: message.text,
      createdAt: moment(message.createdAt).format("h:mm a"),
    });
    $messagesDiv.insertAdjacentHTML("beforeend", html);
    autoscroll();
  });

  socket.on("locationMsg", (message) => {
    const html = Mustache.render(locationMsgTemplate, {
      username: message.username,
      url: message.url,
      createdAt: moment(message.createdAt).format("h:mm a"),
    });
    $messagesDiv.insertAdjacentHTML("beforeend", html);
    autoscroll();
  });

  socket.on("roomData", ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
      room,
      users,
    });
    document.querySelector("#sidebar").innerHTML = html;
  });

  $messageForm.addEventListener("submit", (e) => {
    e.preventDefault();

    $messageFormButton.setAttribute("disabled", "disabled");

    const message = e.target.elements.inputmessage.value;

    socket.emit("sendMessageFromClient", message, (error) => {
      $messageFormButton.removeAttribute("disabled");
      $messageFormInput.value = "";
      $messageFormInput.focus();
      if (error) {
        return console.log(error);
      }
      console.log("Msg delivered!");
    });
  });

  $sendLocation.addEventListener("click", () => {
    if (!navigator.geolocation) {
      return alert("Geolocation is not supported for your browser");
    }

    $sendLocation.setAttribute("disabled", "disabled");

    navigator.geolocation.getCurrentPosition((position) => {
      socket.emit(
        "sendLocation",
        {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        () => {
          $sendLocation.removeAttribute("disabled");
          console.log("Location shared");
        }
      );
    });
  });

  socket.emit("join", { username, room }, (error) => {
    if (error) {
      alert(error);
      location.href = "/";
    }
  });
})();
