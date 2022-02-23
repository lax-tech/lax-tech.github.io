const backToTopButton = document.querySelector('.back-to-top');
const bottomBar = document.querySelector('.bottom-bar');

function scrollFunction() {
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    bottomBar.style.display = "block";
  } else {
    bottomBar.style.display = "none";
  }
}

function doScrollTo(selector) {
  const ELEMENT = getElement(selector);
  const ELEMENT_POSITION = ELEMENT.offsetTop;
  const FROM_POSITION = document.documentElement.scrollTop || document.body.scrollTop;
  let lastPosition = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollToTop = () => {
    const ACTUAL_POSITION = document.documentElement.scrollTop || document.body.scrollTop;
    if (ACTUAL_POSITION < ELEMENT_POSITION && FROM_POSITION < ELEMENT_POSITION && lastPosition <= ACTUAL_POSITION) {
      window.requestAnimationFrame(scrollToTop);
      window.scrollTo(0, ACTUAL_POSITION + (ELEMENT_POSITION - ACTUAL_POSITION) / 8 + 1);
    } else if (ACTUAL_POSITION > ELEMENT_POSITION && FROM_POSITION > ELEMENT_POSITION && lastPosition >= ACTUAL_POSITION) {
      window.requestAnimationFrame(scrollToTop);
      window.scrollTo(0, ACTUAL_POSITION - (ACTUAL_POSITION - ELEMENT_POSITION) / 8);
    }
    lastPosition = ACTUAL_POSITION;
  };
  scrollToTop();
}

function getElement(selector) {
  return document.querySelector(selector);
}

function getAllElements(selector) {
  return document.querySelectorAll(selector);
}
document.addEventListener('DOMContentLoaded', function() {
  const sidenavInstances = M.Sidenav.init(getAllElements('.sidenav'), {});
  const modalInstances = M.Modal.init(getAllElements('.modal'), {});
  const dropdwonInstances = M.Dropdown.init(getAllElements('.dropdown-trigger'), {});
  const collapsibleInstances = M.Collapsible.init(getAllElements('.collapsible'), {});
  const selectInstances = M.FormSelect.init(getAllElements('select'), {});
  const datepickerInstances = M.Datepicker.init(getAllElements('.datepicker'), {});
  window.onscroll = function() { scrollFunction() };
  backToTopButton.addEventListener('click', () => {
    doScrollTo('body');
  });
});
/* #26a69a 1976D2 */