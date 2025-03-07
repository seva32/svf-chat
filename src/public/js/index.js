$(".js-trigger").on("click", function () {
  $(this).toggleClass("menu__trigger--active");
  common();
});

$(".menu__col ul li").on("click", function (_params) {
  let newText = $(this).context.innerHTML;
  $("#country-selection").text(function (i, oldText) {
    return newText ? newText : oldText;
  });
  $(".js-trigger").toggleClass("menu__trigger--active");
  common();
});

function common(_params) {
  $(".hero__section").toggleClass("header--opacity");
  $(".hero__nav_left").toggleClass("menu__trigger--left-item");
  $(".js-menu").slideToggle("fast");
  if (!$(".js-trigger").hasClass("menu__trigger--active")) {
    $(".js-trigger").css("opacity", "0");
    setTimeout(() => {
      $(".js-trigger").css("opacity", "1");
    }, 300);
  }
}

$(".hero__header-item-rigth span").hover(
  function (_params) {
    $(".hero__header-item-rigth i").css("color", "#ff0000");
  },
  function (_params) {
    $(".hero__header-item-rigth i").css("color", "#c41c1c");
  }
);

$(".hero__header-item-rigth i").hover(
  function (_params) {
    $(".hero__header-item-rigth i").css("color", "#ff0000");
  },
  function (_params) {
    $(".hero__header-item-rigth i").css("color", "#c41c1c");
  }
);

// modal

function openModal() {
  /* Get trigger element */
  var modalTrigger = document.getElementsByClassName("jsModalTrigger");

  /* Set onclick event handler for all trigger elements */
  for (var i = 0; i < modalTrigger.length; i++) {
    modalTrigger[i].onclick = function () {
      var target = this.dataset.modalId;
      var modalWindow = document.getElementById(target);
      console.log(modalWindow);

      modalWindow.classList
        ? modalWindow.classList.add("open")
        : (modalWindow.className += " " + "open");
    };
  }
}

function closeModal() {
  /* Get close button */
  var closeButton = document.getElementsByClassName("jsModalClose");
  var closeOverlay = document.getElementsByClassName("jsOverlay");

  /* Set onclick event handler for close buttons */
  for (let i = 0; i < closeButton.length; i++) {
    closeButton[i].onclick = function () {
      var modalWindow = this.parentNode.parentNode;

      modalWindow.classList
        ? modalWindow.classList.remove("open")
        : (modalWindow.className = modalWindow.className.replace(
            new RegExp(
              "(^|\\b)" + "open".split(" ").join("|") + "(\\b|$)",
              "gi"
            ),
            " "
          ));
    };
  }

  /* Set onclick event handler for modal overlay */
  for (let i = 0; i < closeOverlay.length; i++) {
    closeOverlay[i].onclick = function () {
      var modalWindow = this.parentNode;

      modalWindow.classList
        ? modalWindow.classList.remove("open")
        : (modalWindow.className = modalWindow.className.replace(
            new RegExp(
              "(^|\\b)" + "open".split(" ").join("|") + "(\\b|$)",
              "gi"
            ),
            " "
          ));
    };
  }
}

function ready(fn) {
  if (document.readyState != "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

ready(openModal);
ready(closeModal);
