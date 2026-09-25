/**
 * Centre Suhevic — comportamiento propio (se carga después de main.js)
 * Tabs Sobre Nuria / Equipo
 * Slider Equipo + drawer de perfil
 * Slider Experiencias
 */

(function ($) {
    "use strict";

    /* Tabs Sobre Nuria / Equipo
    -------------------------------------------------------------------------*/
    var aboutTabs = () => {
        $(".suhevic-tab").on("click", function () {
            var $tab = $(this);
            var target = $tab.data("tab");
            var $wrap = $tab.closest(".col-right");

            $wrap.find(".suhevic-tab").removeClass("active").attr("aria-selected", "false");
            $tab.addClass("active").attr("aria-selected", "true");

            $wrap.find(".suhevic-tab-pane").removeClass("active").attr("hidden", true);
            $("#" + target).removeAttr("hidden");
            // Forzar reflow para que la transición de entrada se aplique
            void document.getElementById(target).offsetWidth;
            $("#" + target).addClass("active");

            if (target === "tab-equipo" && teamSwiper) teamSwiper.update();
            if (window.ScrollTrigger) ScrollTrigger.refresh();
        });
    };

    /* Slider Equipo
    -------------------------------------------------------------------------*/
    var teamSwiper = null;
    var teamSlider = () => {
        if (!$(".swiper-team").length) return;
        teamSwiper = new Swiper(".swiper-team", {
            slidesPerView: 1.25,
            spaceBetween: 16,
            speed: 600,
            grabCursor: true,
            observer: true,
            observeParents: true,
            navigation: { nextEl: ".team-next", prevEl: ".team-prev" },
            pagination: { el: ".team-pagination", clickable: true },
            breakpoints: {
                576: { slidesPerView: 2.2, spaceBetween: 20 },
                992: { slidesPerView: 1.6, spaceBetween: 20 },
                1200: { slidesPerView: 2.1, spaceBetween: 24 },
            },
        });
    };

    /* Drawer perfil del equipo
    -------------------------------------------------------------------------*/
    var teamDrawer = () => {
        var drawer = document.getElementById("teamDrawer");
        if (!drawer) return;
        drawer.addEventListener("show.bs.offcanvas", function (e) {
            var card = e.relatedTarget;
            if (!card) return;
            ["name", "role", "bio", "tags", "initials"].forEach(function (field) {
                var el = drawer.querySelector('[data-field="' + field + '"]');
                if (el) el.textContent = card.dataset[field] || "";
            });
            var img = drawer.querySelector('[data-field="img"]');
            if (img) {
                img.hidden = !card.dataset.img;
                img.src = card.dataset.img || "";
                img.alt = card.dataset.name || "";
            }
            var initials = drawer.querySelector('[data-field="initials"]');
            if (initials) initials.hidden = !!card.dataset.img;
        });
    };

    /* Slider Experiencias
    -------------------------------------------------------------------------*/
    var reviewsSlider = () => {
        if (!$(".swiper-reviews").length) return;
        new Swiper(".swiper-reviews", {
            slidesPerView: 1.1,
            spaceBetween: 16,
            speed: 700,
            grabCursor: true,
            loop: true,
            autoplay: { delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true },
            navigation: { nextEl: ".reviews-next", prevEl: ".reviews-prev" },
            pagination: { el: ".reviews-pagination", clickable: true },
            breakpoints: {
                768: { slidesPerView: 2, spaceBetween: 24 },
                1200: { slidesPerView: 3, spaceBetween: 32 },
            },
        });
    };

    // Dom Ready
    $(function () {
        aboutTabs();
        teamSlider();
        teamDrawer();
        reviewsSlider();
    });
})(jQuery);
