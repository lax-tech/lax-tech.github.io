const modalContainer = document.querySelector('.modal-container');
const modal = document.querySelector('.modal');
const toggleModalButton = document.querySelectorAll('.toggle-modal');
const header = document.querySelector('header');
const backToTopButton = document.querySelector('.back-to-top');


function scrollFunction() {
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        backToTopButton.style.display = "block";
    } else {
        backToTopButton.style.display = "none";
    }
}


function doScrollTo(selector) {
    const ELEMENT = getElement(selector);
    const ELEMENT_POSITION = ELEMENT.offsetTop;
    const FROM_POSITION = document.documentElement.scrollTop || document.body.scrollTop;

    const scrollToTop = () => {
        const ACTUAL_POSITION = document.documentElement.scrollTop || document.body.scrollTop;
        if (ACTUAL_POSITION < ELEMENT_POSITION && FROM_POSITION < ELEMENT_POSITION) {
            window.requestAnimationFrame(scrollToTop);
            window.scrollTo(0, ACTUAL_POSITION + (ELEMENT_POSITION - ACTUAL_POSITION) / 8 + 1);
        } else if (ACTUAL_POSITION > ELEMENT_POSITION && FROM_POSITION > ELEMENT_POSITION) {
            window.requestAnimationFrame(scrollToTop);
            window.scrollTo(0, ACTUAL_POSITION - (ACTUAL_POSITION - ELEMENT_POSITION) / 8);
        }
    };
    scrollToTop();

}

function getElement(selector) {
    return document.querySelector(selector);
}

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.modal');
    var modal_instances = M.Modal.init(elems);

    var elems = document.querySelectorAll('.carousel');
    var instances = M.Carousel.init(elems, {
        indicators: true,
    });
    var instance = M.Carousel.init(getElement('#carousel-1'), {
        indicators: true,
        fullWidth: true
    });

    setInterval(() => {
        instance.next();
    }, 4000);

    // When the user scrolls down 20px from the top of the document, show the button
    window.onscroll = function() { scrollFunction() };

    backToTopButton.addEventListener('click', () => {
        doScrollTo('body');
    });

    getElement('#tarif-btn').onclick = (event) => {
        event.preventDefault();
        doScrollTo('#tarif');
    }
    getElement('#services-btn').onclick = (event) => {
        event.preventDefault();
        doScrollTo('#services');
    }

});