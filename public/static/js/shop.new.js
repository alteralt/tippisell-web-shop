var isiShop = {
    variables: {
        currency: "wmr",
        currency_str: "руб.",
        createPayment: false,
        storage: localStorage,
    },
    onWindowClose: function () {
        if (this.variables.createPayment === true) {
            return "Вы уверены, что хотите прервать процесс покупки?"
        }
    },
    onPopupClose: function () {
        if (this.variables.createPayment === true) {
            return confirm("Вы уверены, что хотите прервать процесс покупки?")
        } else {
            return true
        }
    },
}

/**
 * Оплата с помощью вебмани не прерывает процесс покупки
 */
$(document).on("click", "#btnwmk", function () {
    isiShop.variables.createPayment = false
})

window.onbeforeunload = function (e) {
    return isiShop.onWindowClose()
}

$(document).on(
    "click",
    ".choose_popup .fa-times, .success_popup .fa-times",
    function (e) {
        if (isiShop.onPopupClose()) {
            $("#overlay, .choose_popup, .success_popup").fadeOut("slow")
            $("body").removeClass("popup-open")
            isiShop.variables.createPayment = false
        }
    },
)

$(document).keyup(function (e) {
    if (e.keyCode == 27 && isiShop.onPopupClose()) {
        $("#overlay, .choose_popup, .success_popup").fadeOut("slow")
        $("body").removeClass("popup-open")
        isiShop.variables.createPayment = false
    }
})

/**
 * Открываем попап с данными из "Закрыли окно?"
 */
$("#btn-window").on("click", function (e) {
    $("#order").hide()
    $(".choose_popup .popup-modal").append(
        isiShop.variables.storage.getItem("lastorder"),
    )
    $("#btn-window").hide()
})

$(document).on("click", "input.clipboard", function () {
    this.select()
})

$(document).on("click", ".order_popup h4 .close", function () {
    $(".order_popup").remove()
    $("#buy-btn").attr("disabled", false)
})
