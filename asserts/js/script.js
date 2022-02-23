class ChMiniSlider extends HTMLElement {
    constructor() {
      super();
      this.queue = [];
      this.shadow = this.attachShadow({ mode: "open" });
  
      this.scrollings = [];
      this.currentSlide = 1;
      this.ANIMATION_THRESHOLD = 500;
    }
  
    connectedCallback() {
      this.render();
      this.setupEvents();
    }
  
    static get observedAttributes() {
      return [];
    }
  
    attributeChangedCallback(prop, oldValue, newValue) {
      const updateMap = {};
      if (updateMap[prop]) {
        if (this.root) {
          updateMap[prop].bind(this)(newValue, oldValue);
        } else {
          this.queue.push({
            fn: updateMap[prop].bind(this),
            params: [newValue, oldValue]
          });
        }
      }
    }
  
    processQueue() {
      while (this.queue.length) {
        const delayed = this.queue.pop();
        delayed.fn(...delayed.params);
      }
    }
  
    setupEvents() {
      window.addEventListener("wheel", (e) => {
        if (Math.abs(e.deltaX) >= Math.abs(e.deltaY)) {
          return;
        }
        const deltaY = e.deltaY;
        this.updateHistory(new Date().getTime(), deltaY);
        if (new Date().getTime() - this.lastMove <= this.ANIMATION_THRESHOLD) {
          return;
        }
        if (this.isAccelerating()) {
          if (deltaY > 0) {
            this.nextSlide();
          } else {
            this.prevSlide();
          }
        } else {
          // if (this.onRelease) {
          //   this.onRelease();
          // }
        }
      });
    }
  
    emitSlideChange(direction) {
      const ev = new CustomEvent("onslidechange", {
        detail: {
          slide: this.currentSlide,
          direction
        }
      });
      this.dispatchEvent(ev);
    }
  
    updateScroll() {
      this.moveY(this.wrapper, this.getAccumulatedHeight(this.currentSlide) * -1);
    }
  
    moveY(el, movement) {
      el.style.transform = `translate3d(0, ${movement}px, 0`;
    }
  
    getAccumulatedHeight(currentSlide) {
      // Based on slide height + margin
      return (currentSlide - 1) * 250;
    }
  
    markActive() {
      const active = this.getElementsByClassName("active")[0];
      if (active) {
        active.classList.remove("active");
      }
      const currentSlide = this.children[this.currentSlide - 1];
      currentSlide.classList.add("active");
    }
  
    nextSlide() {
      if (this.currentSlide < this.numberOfSlides) {
        this.lastMove = new Date().getTime();
        this.currentSlide += 1;
        this.updateScroll();
        this.markActive();
        this.emitSlideChange("next");
      }
    }
  
    prevSlide() {
      if (this.currentSlide > 1) {
        this.lastMove = new Date().getTime();
        this.currentSlide -= 1;
        this.updateScroll();
        this.markActive();
        this.emitSlideChange("prev");
      }
    }
  
    updateHistory(time, deltaY) {
      const timeDiff = time - this.lastScroll;
      this.lastScroll = time;
  
      if (timeDiff > 200) {
        this.scrollings = [];
      } else {
        if (this.scrollings.length >= 70) {
          this.scrollings.shift();
        }
  
        this.scrollings.push(Math.abs(deltaY));
      }
    }
  
    isAccelerating() {
      const averageEnd = this.getAverage(this.scrollings, 10);
      const averageMiddle = this.getAverage(this.scrollings, 70);
      return averageEnd >= averageMiddle;
    }
  
    getAverage(elements, quantity) {
      const q = Math.min(elements.length, quantity);
      const sum = elements
        .slice(elements.length - q)
        .reduce((acc, i) => acc + i, 0);
      return sum / q;
    }
  
    render() {
      this.numberOfSlides = this.children.length;
      Array.from(this.children).forEach((slide, index) => {
        slide.classList.add("ch-mini-slider-slide");
        if (index === 0) {
          slide.classList.add("active");
        }
      });
      const slot = document.createElement("slot");
      const wrapper = document.createElement("div");
      wrapper.classList.add("ch-mini-slider-wrapper");
      wrapper.append(slot);
      this.wrapper = wrapper;
      const slider = document.createElement("div");
      slider.classList.add("ch-mini-slider");
      slider.append(wrapper);
      this.root = slider;
      this.shadow.appendChild(this.root);
      this.shadow.appendChild(this.getStyle());
      this.processQueue();
    }
  
    getStyle() {
      const globalStyle = document.createElement("style");
      globalStyle.textContent = `
        .ch-mini-slider-slide {
          height: 100%;
          height: 200px;
          margin-bottom: 50px;
          width: 300px;
          transform: scale(1);
          transition: all 1000ms ease;
          box-shadow: 50px 40px 20px -10px rgb(0 0 0 / 30%);
        }
        .ch-mini-slider-slide.active {
          transform: scale(1.2);
          box-shadow: 75px 60px 20px -20px rgb(0 0 0 / 30%);
        }
      `;
      document.head.appendChild(globalStyle);
      const style = document.createElement("style");
      style.textContent = `
        .ch-mini-slider {
          height: 100vh;
          position: relative;
          transform: perspective(300px) rotate3d(1, -3, 0,  10deg);
          display: inline-block;
        }
  
        .ch-mini-slider-wrapper {
          transition: transform 1000ms ease;
          display: inline-flex;
          flex-direction: column;
        }
      `;
      return style;
    }
  }
  
  try {
    customElements.define("ch-mini-slider", ChMiniSlider);
  } catch (err) {
    const h3 = document.createElement("h3");
    h3.innerHTML =
      "This site uses webcomponents which only work in modern browsers.";
    document.body.appendChild(h3);
  }
  
  const miniSlider = document.getElementsByTagName("ch-mini-slider")[0];
  
  miniSlider.addEventListener("onslidechange", (ev) => {
    const backgroundColors = [
      "#93420a",
      "#2b5c34",
      "#769fb1",
      "#c2bcae",
      "#9e8872",
      "#000000",
      "#ae816f",
      "#712320"
    ];
    wipeClass("active", "message-slide");
    wipeClass("to-next", "message-slide");
    wipeClass("to-prev", "message-slide");
    const message = document.getElementsByClassName(
      "message-slide-" + ev.detail.slide
    )[0];
    message.classList.add("active");
    message.classList.add("to-" + ev.detail.direction);
    const content = document.getElementsByClassName("content")[0];
    content.style.backgroundColor = backgroundColors[ev.detail.slide - 1];
  });
  
  function wipeClass(classToWipe, helpingClasses) {
    const el = document.getElementsByClassName(
      `${helpingClasses} ${classToWipe}`
    )[0];
    if (el) {
      el.classList.remove(classToWipe);
    }
  }
  