function locomotiveAnimation() {
  gsap.registerPlugin(ScrollTrigger);

  const locoScroll = new LocomotiveScroll({
    el: document.querySelector(".main"),
    smooth: true,
    multiplier: 1, // Try adjusting this if animation feels off
    lerp: 0.1, // Smoothness
    smartphone: { smooth: true },
    tablet: { smooth: true },
  });

  // Store locoScroll globally so we can access it
  window.locoScroll = locoScroll;

  locoScroll.on("scroll", ScrollTrigger.update);

  ScrollTrigger.scrollerProxy(".main", {
    scrollTop(value) {
      if (arguments.length) {
        locoScroll.scrollTo(value, 0, 0);
      } else {
        return locoScroll.scroll.instance.scroll.y;
      }
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    pinType: document.querySelector(".main").style.transform
      ? "transform"
      : "fixed",
  });

  ScrollTrigger.addEventListener("refresh", () => {
    locoScroll.update();
  });

  ScrollTrigger.refresh(); // Initial refresh
}

window.addEventListener("load", locomotiveAnimation);

function simplePage1Animation() {
  // Get all elements
  const page1 = document.querySelector('.page1');
  const h1s = document.querySelectorAll('.page1 h1');
  const paragraph = document.querySelector('.page1 p');
  const somethingDiv = document.querySelector('.page1-something');
  const movingDiv = document.querySelector('.moving-div');
  
  // Hide everything initially
  gsap.set(page1, { opacity: 0 });
  gsap.set(h1s, { y: 50, opacity: 0 });
  gsap.set(paragraph, { y: 30, opacity: 0 });
  gsap.set(somethingDiv, { scale: 0.5, opacity: 0 });
  gsap.set(movingDiv, { y: 50, opacity: 0 });

  // Create a zoom effect on the whole page
  gsap.fromTo(page1, 
    {
      scale: 0.5,
      opacity: 0,
      borderRadius: "50px"
    },
    {
      scale: 1,
      opacity: 1,
      borderRadius: "0px",
      duration: 1,
      ease: "power3.out",
      onComplete: function() {
        // Start content animations after zoom
        animateContent();
      }
    }
  );

  function animateContent() {
    // Create timeline for content
    const tl = gsap.timeline();
    
    // Animate first h1 with stagger effect on letters (if you want character by character)
    tl.to(h1s[0], {
      y: 0,
      stagger: 0.05,
      opacity: 1,
      duration: 0.8
    })
    
    // Animate the SVG inside
    .to(h1s[0].querySelector('svg'), {
      scale: 1.2,
      rotation: 360,
      duration: 0.6,
      ease: "power2.out"
    }, "<0.3")
    
    // Animate second h1
      .fromTo(h1s[1], {
      y: 60,
      opacity: 0,
      scale: 0.8,
      skewX: 20
    }, {
      y: 0,
      opacity: 1,
      scale: 1,
      skewX: 0,
      duration: 0.9,
      ease: "elastic.out(1, 0.7)"
    }, "<0.1")

   
    
    // Animate paragraph
    .to(paragraph, {
      y: 0,
      opacity: 1,
      duration: 0.6
    }, "<0.1")
    
    // Animate page1-something container
    .to(somethingDiv, {
      scale: 1,
      opacity: 1,
      duration: 0.5,
      ease: "back.out(1.5)"
    }, "<0.1")
    
    // Animate each h4 inside with stagger
    .to(somethingDiv.querySelectorAll('h4'), {
      scale: 1,
      opacity: 1,
      duration: 0.4,
      stagger: 0.15,
      ease: "power2.out"
    }, "<0.2")
    
    // Finally, animate moving-div
    .to(movingDiv, {
      y: 0,
      opacity: 1,
      duration: 0.7
    }, "<0.2");
  }
}

// Start animation when page loads
window.addEventListener('load', simplePage1Animation);

// Initialize ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

function setupScrollAnimations() {
  
  const parts = document.querySelectorAll(
    ".btm6-part2, .btm6-part3, .btm6-part4, .btm6-part5",
  );

  const contentSection = document.querySelector(".page6-bottom");

  // Create a master timeline for the entire section
  const masterTl = gsap.timeline({
    scrollTrigger: {
      trigger: contentSection, // Trigger on the content section above
      scroller: ".main",
      start: "top 80%", // Start when content section is 80% from top
      end: "bottom 60%", // End when content section is 20% from bottom
      scrub: 1, // Smooth scrubbing effect
      markers: false, // Set to true for debugging
      toggleActions: "play none none reverse", // Play forward on enter, reverse on leave
    },
  });

  // Animate h4 elements with staggered delay
  parts.forEach((part, partIndex) => {
    const h4Elements = part.querySelectorAll("h4");

    h4Elements.forEach((h4, index) => {
      // Calculate shift amount - progressively more for later elements
      const shiftAmount = index * 20;

      // Add to master timeline with staggered start
      masterTl.to(
        h4,
        {
          x: shiftAmount,
          duration: 0.5,
          ease: "power2.out",
        },
        partIndex * 0.2 + index * 0.05,
      ); // Stagger between parts and within parts
    });
  });
}

function navAnimation() {
  const nav = document.querySelector("nav");
  const navPart2 = document.querySelector(".nav-part2");

  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: "power3.out" },
  });

  // OPEN animation
  tl.to(".nav-bottom", {
    height: "21vh",
    duration: 0.4,
  })
    .to(
      ".nav-part2 h5",
      {
        opacity: 1,
        display: "block",
        duration: 0,
      },
      "<",
    )
    .fromTo(
      ".nav-part2 h5 span",
      { y: 25 },
      {
        y: 0,
        stagger: 0.05,
        duration: 0.3,
      },
      "<+=0.1",
    );

  // Trigger the menu only when the pointer actually enters the visible nav area.
  // This prevents invisible/overflowing h5 items from triggering the animation.
  nav.addEventListener("mouseenter", (e) => {
    const navRect = nav.getBoundingClientRect();
    // If the pointer Y is below the nav's bottom (i.e. over overflowed items), ignore.
    if (e.clientY > navRect.bottom + 2) return;

    // add class so h5 become interactive while open
    navPart2.classList.add("open");
    tl.play();
  });

  
  nav.addEventListener("mousemove", (e) => {
    const navRect = nav.getBoundingClientRect();
    // If already open, nothing to do
    if (navPart2.classList.contains("open")) return;
    if (e.clientY <= navRect.bottom + 2) {
      navPart2.classList.add("open");
      tl.play();
    }
  });

  // Close when leaving the nav's visible area
  nav.addEventListener("mouseleave", () => {
    tl.reverse();
  });

  // remove .open when reverse completes so hidden h5 stop receiving pointer events
  tl.eventCallback("reverseComplete", () => {
    navPart2.classList.remove("open");
  });
}


function page2Animation() {
  const relem = document.querySelectorAll(".right-elem");

  relem.forEach((elem) => {
    const img = elem.children[1];

    // smooth position setters
    const xTo = gsap.quickTo(img, "left", { duration: 0.4, ease: "power3" });
    const yTo = gsap.quickTo(img, "top", { duration: 0.4, ease: "power3" });

    elem.addEventListener("mouseenter", () => {
      gsap.to(img, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    });

    elem.addEventListener("mouseleave", () => {
      gsap.to(img, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      });
    });

    elem.addEventListener("mousemove", (e) => {
      const rect = elem.getBoundingClientRect();

      xTo(e.clientX - rect.left - img.offsetWidth / 2);
      yTo(e.clientY - rect.top - img.offsetHeight / 2);
    });
  });
}

function page3VideoAnimation() {
  const video = document.querySelector(".page3 video");
  const page3Centre = document.querySelector(".page3-centre");

  page3Centre.addEventListener("click", () => {
    video.play();
    gsap.to(video, {
      opacity: 1,
      transform: "scaleX(1) scaleY(1)",
      borderRadius: "0",
    });
  });

  video.addEventListener("click", () => {
    video.pause();
    gsap.to(video, {
      transform: "scaleX(0.7) scaleY(0)",
      opacity: 0,
      borderRadius: "30px",
    });
  });
}

function page4Animation() {
  const sections = document.querySelectorAll(".sec-right");

  sections.forEach((elem) => {
    const video = elem.querySelector("video");
    const cursor = elem.querySelector(".view");

    // GSAP smooth setters
    const xTo = gsap.quickTo(cursor, "left", {
      duration: 0.4,
      ease: "power3.out",
    });

    const yTo = gsap.quickTo(cursor, "top", {
      duration: 0.4,
      ease: "power3.out",
    });

    elem.addEventListener("mouseenter", () => {
      video.style.opacity = 1;
      video.play();

      gsap.to(cursor, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: "power3.out",
      });
    });

    elem.addEventListener("mousemove", (e) => {
      const rect = elem.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      xTo(x);
      yTo(y);
    });

    elem.addEventListener("mouseleave", () => {
      video.style.opacity = 0;
      video.pause();
      video.currentTime = 0;

      gsap.to(cursor, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power3.out",
      });
    });
  });
}

function accordionToggle(sectionSelector) {
  const section = document.querySelector(sectionSelector);
  const header = section.querySelector(".arrow-icon");
  const arrow = header.querySelector("i");

  const content = Array.from(section.children).slice(1);
  let isOpen = true;

  // Store original heights for content elements
  const originalHeights = [];
  content.forEach((el) => {
    originalHeights.push(el.offsetHeight);
  });

  header.addEventListener("click", () => {
    if (isOpen) {
      // CLOSE
      gsap.to(content, {
        height: 0,
        opacity: 0,
        duration: 0.5,
        ease: "power3.inOut",
        stagger: 0.05,
        onComplete: () => {
          // Refresh ScrollTrigger after closing animation completes
          ScrollTrigger.refresh();
        },
      });

      gsap.to(arrow, {
        rotate: -180,
        duration: 0.4,
        ease: "power3.inOut",
      });

      gsap.to(section, {
        borderTopColor: "#333",
        duration: 0.3,
      });

      isOpen = false;
    } else {
      // OPEN - Use specific pixel values instead of "auto"
      content.forEach((el, index) => {
        gsap.fromTo(
          el,
          { height: 0, opacity: 0 },
          {
            height: originalHeights[index],
            opacity: 1,
            duration: 0.6,
            ease: "power3.inOut",
            delay: index * 0.05,
            onComplete: () => {
              // Once all animations are done, refresh ScrollTrigger
              if (index === content.length - 1) {
                ScrollTrigger.refresh();
              }
            },
          },
        );
      });

      gsap.to(arrow, {
        rotate: 0,
        duration: 0.4,
        ease: "power3.inOut",
      });

      gsap.to(section, {
        borderTopColor: "#fff",
        duration: 0.3,
      });

      isOpen = true;
    }
  });

  // Initialize with correct heights
  if (isOpen) {
    content.forEach((el, index) => {
      gsap.set(el, { height: originalHeights[index] });
    });
  }
}


function pinPage5Button() {
  const wrap = document.querySelector(".sticky-btn-wrap");
  const section = document.querySelector(".page5");

  if (!wrap || !section) return;

  ScrollTrigger.create({
    trigger: section,
    scroller: ".main",
    start: "top top+=80",
    end: "bottom top+=200",
    pin: wrap,              // 👈 pin wrapper
  
    markers: true,
  });
}





locomotiveAnimation();
setupScrollAnimations();
accordionToggle(".uiux");
accordionToggle(".product");
page4Animation();
page3VideoAnimation();
page2Animation();
navAnimation();
pinPage5Button();

// Setup sticky button after locomotive and ScrollTrigger have been initialized



