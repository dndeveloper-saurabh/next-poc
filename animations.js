

const initialize = async () => {
  try {
    document.body.style.position = "fixed";
    document.body.style.top = `-${window.scrollY}px`;
    // document.querySelector(".loading__wrapper").style.display = "flex";
    animateLandingForDesktop();
    // window.addEventListener("load", function () {
    //   window.matchMedia("(max-width: 728px)").matches
    //   && animateLandingForDesktop();
    // });

    // if (
    //   (path === "/" ||
    //     path.includes("/referrals/") ||
    //     path === "/classroom" ||
    //     path === "/tips" ||
    //     path === "/practice") &&
    //   (null === uid || typeof uid === "undefined")
    // ) {

    //   document.body.style.position = "fixed";
    //   document.body.style.top = `-${window.scrollY}px`;
    //   window.addEventListener("load", function () {
    //     window.matchMedia("(max-width: 728px)").matches
    //       && animateLandingForDesktop();
    //   });
    // } else {
    //   loadScriptsForDashboard();
    // }
  } catch (a) {
    console.log('error - ', a);
  }
};

function loadScript(a) {
  return new Promise((b) => {
    const c = document.createElement("script");
    c.src = a
    c.onload = () => b(!0)
    c.onerror = () => b(!1)
    document.body.appendChild(c);
  });
}

async function loadCSS(url) {
  return new Promise((b) => {
    const c = document.createElement("link");

    c.type = "text/css"
    c.rel = "stylesheet"
    c.href = url
    c.media = "screen,print"
    c.type = "text/css"
    c.onload = () => {
      b(!0);
    }
    c.onerror = () => {
      b(!1);
    }
    document.body.appendChild(c);
  });
}

async function animateLandingForDesktop() {

  import('gsap')
    .then(d => {
      const gsap = d.gsap;


      const {ScrollTrigger} = require('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      console.log('scrolltrigger - ', ScrollTrigger);


      let progress = 0;
      // await initGSAPForDesktop();

      console.log('document.querySelectorAll("#circle1") - ', document.querySelectorAll("#circle1"));

      ScrollTrigger.config({
        autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
      })
      // gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
      ScrollTrigger.config({
        autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
      })
      ScrollTrigger.addEventListener(
        "refreshInit",
        () => (progress = ScrollTrigger.progress)
      )
      ScrollTrigger.addEventListener("refresh", (ST) => {
        console.log('ST - ', ST);
        // ScrollToPlugin.scroll(progress * ScrollTrigger.maxScroll(window))
      });

      let a = gsap.timeline({
        scrollTrigger: {
          trigger: ".landing__wrapper",
          pin: true,
          scrub: true,
          start: "top top",
          end: "bottom -1000%",
          duration: "1000%",
          fastScrollEnd: 3000,
        },
        smoothChildTiming: true,
      });

      let k = 0;

      gsap.delayedCall(0.1, () => {
        k = a.scrollTrigger.start + (a.scrollTrigger.end - a.scrollTrigger.start);
      });

      const onStart = () => {
        // console.log("onStart hidden");
        setTimeout(() => gsap.set("body", { overflow: "hidden" }), 0);
      };

      const onComplete = () => {
        // console.log("onComplete auto");
        setTimeout(() => gsap.set("body", { overflow: "auto" }), 0);
      };

      document.querySelectorAll("#circle1").forEach((btn) => {
        btn.addEventListener("click", () => {
          const pos = k * (a.labels.mac__wrapper / a.duration());
          gsap.to(window, {
            duration: 1,
            scrollTo:
              Math.round(pos) +
              (a.scrollTrigger.direction < 0 ? 150 * a.scrollTrigger.direction : 0),
            ease: "linear",
            onStart,
            onComplete,
          });
        });
      });

      document.querySelectorAll("#circle2").forEach((btn) => {
        btn.addEventListener("click", () => {
          const pos = k * (a.labels.learnscreen / a.duration());
          gsap.to(window, {
            duration: 1,
            scrollTo:
              Math.round(pos) +
              (a.scrollTrigger.direction < 0 ? 150 * a.scrollTrigger.direction : 0),
            ease: "linear",
            onStart,
            onComplete,
          });
        });
      });

      document.querySelectorAll("#circle3").forEach((btn) => {
        btn.addEventListener("click", () => {
          const pos = k * (a.labels.hidelearnscreen / a.duration());
          gsap.to(window, {
            duration: 1,
            scrollTo:
              Math.round(pos) +
              (a.scrollTrigger.direction < 0 ? 150 * a.scrollTrigger.direction : 0),
            ease: "linear",
            onStart,
            onComplete,
          });
        });
      });

      document.querySelectorAll("#circle4").forEach((btn) => {
        btn.addEventListener("click", () => {
          const pos = k * (a.labels.hidetimeline / a.duration());

          gsap.to(window, {
            duration: 1,
            scrollTo:
              Math.round(pos) +
              (a.scrollTrigger.direction < 0 ? 150 * a.scrollTrigger.direction : 0),
            ease: "linear",
            onStart,
            onComplete,
          });
        });
      });

      // document.querySelectorAll("#circle5").forEach((btn) => {
      //   btn.addEventListener("click", () => {
      //     const pos = k * (a.labels.hidelivescreen / a.duration());
      //
      //     gsap.to(window, {
      //       duration: 1,
      //       scrollTo:
      //         Math.round(pos) +
      //         (a.scrollTrigger.direction < 0 ? 150 * a.scrollTrigger.direction : 0),
      //       ease: "linear",
      //       onStart,
      //       onComplete,
      //     });
      //   });
      // });

      document.querySelectorAll("#circle6").forEach((btn) => {
        btn.addEventListener("click", () => {
          const pos = k * (a.labels.hidedoubtscreen / a.duration());

          gsap.to(window, {
            duration: 1,
            scrollTo:
              Math.round(pos) +
              (a.scrollTrigger.direction < 0 ? 150 * a.scrollTrigger.direction : 0),
            ease: "linear",
            onStart,
            onComplete,
          });
        });
      });

      a.set(".mac__wrapper", {top: "0%", scale: 2.2})
        .set("#dashboard__screen", {x: "-10%", y: "-165%", opacity: 0})
        .set(".steps__circle #circle1", {background: "white"})
        .set("#blaze__screen", {opacity: 0, x: "-10%", y: "0%"})
        .set(".videos__text", {opacity: 0, y: "50%", backgroundSize: "0%"})
        .set(".live__text", {opacity: 0, y: "50%", backgroundSize: "0%"})
        .set(".dashboard__text", {
          opacity: 0,
          y: "50%",
          x: "150%",
          backgroundSize: "0%",
        })
        .set(".app__splash", {opacity: 1})
        .set("#homescreen", {opacity: 0})
        .set("#livescreen", {opacity: 0})
        .set("#livescreen2", {opacity: 0})
        // .set("#doubtscreen", { opacity: 0 })
        .set("#searchscreen", {opacity: 0})
        .set(".play-button", {opacity: 0})
        .set("#home2", {opacity: 0})
        .set("#live2", {opacity: 0})
        .set("#live22", {opacity: 0})
        // .set("#doubt2", { opacity: 0 })
        .set("#search2", {opacity: 0})
        .set(".bleeding-bg", {opacity: 0})
        .set(".backdrop", {opacity: 0})
        .set("#homedesc", {y: "0%", opacity: 0, pointerEvents: "none"})
        // .set("#doubtdesc", { y: "0%", opacity: 0, pointerEvents: "none" })
        .set("#livedesc", {y: "0%", opacity: 0, pointerEvents: "none"})
        .set("#livedesc2", {y: "0%", opacity: 0, pointerEvents: "none"})
        .set("#searchdesc", {y: "0%", opacity: 0, pointerEvents: "none"})
        .set(".blaze__content h2", {opacity: 0, y: "100%"})
        .set(".blaze__content p", {opacity: 0, y: "100%"})
        .set(".mobile__hero", {opacity: 1})
        .set(".mobile__hero .wrapper", {y: "-50%", opacity: 1})
        .set(".phones__wrapper", {y: "120%", scale: 6.24})
        .set(".excited__action", {y: "100%"})
        .set(".desktop__landing__footer", {y: "0px", position: "fixed"})
        .set(".mac__", {y: 0, x: 0, scale: 0.9})
        .addLabel("mac__wrapper")
        .to(".mac__text", 0.5, {opacity: 0, display: "none"})
        .to(".steps__circle #circle1", 0.5, {background: "grey"})
        .to("#homescreen", 0, {opacity: 1}, "-=0.5")
        .to(".mobile__hero", 0.5, {opacity: 1}, "-=1")
        .to(".mac__", 0.5, {y: 0, x: 0, scale: 1})
        .to(".phones__wrapper", 0.5, {y: "0%", scale: 1}, "-=0.5")
        .to(".app__wrapper", 0.5, {left: "25%"})
        .to(".steps__circle #circle1", 0.5, {background: "grey"})
        .to(".steps__circle #circle2", 0.5, {background: "white"})
        .to(".app__splash", 0.5, {opacity: 0, snap: {x: 20}}, "-=1")
        .to("#homescreen", 0, { opacity: 1 }, "-=1")
        .to(".bleeding-bg", 0.5, { opacity: 1 }, "-=0.5")
        .to(".backdrop", 0.5, { opacity: 1 }, "-=0.5")
        .to("#homedesc", 0.5, { opacity: 1, pointerEvents: "all" }, "-=0.5")
        .to("#homedesc", 0.5, { opacity: 1 })
        .to("#home2", 1, { opacity: 1 }, "+=1")
        .to("#homedesc", 0.5, { opacity: 1 })
        .to(".play-button", 0.5, { opacity: 1 })
        .to(".play-button", 1, { opacity: 1 })
        .addLabel("learnscreen")
        .to("#homescreen", 0, { opacity: 1 })
        .to("#homedesc", 0.5, { opacity: 0, pointerEvents: "none" })
        .to(".bleeding-bg", 0.5, { background: "var(--videos-radial)" })
        .to("#livedesc", 0.5, { opacity: 1, pointerEvents: "all" }, "-=0.5")
        .to("#livescreen", 0.5, { opacity: 1 }, "-=1")
        .to("#livescreen", 0.5, { opacity: 1 })
        .to("#live2", 1, { opacity: 1 }, "+=1")
        .to(".steps__circle #circle2", 0.5, { background: "grey" }, "-=0.5")
        .to(".steps__circle #circle3", 0.5, { background: "white" }, "-=1")
        .to(".steps__circle #circle3", 1, { background: "white" })
        .addLabel("hidelearnscreen")
        .to("#livescreen", 0, { opacity: 1 })
        .to("#livedesc", 0.5, { opacity: 0, pointerEvents: "none" })
        .to(".bleeding-bg", 0.5, { background: "var(--news-radial)" })
        .to("#livedesc2", 0.5, { opacity: 1, pointerEvents: "all" }, "-=0.5")
        .to("#livescreen2", 0.5, { opacity: 1 }, "-=1")
        .to("#livescreen2", 0.5, { opacity: 1 })
        .to(".steps__circle #circle3", 0.5, { background: "grey" }, "-=0.5")
        .to(".steps__circle #circle4", 0.5, { background: "white" }, "-=1")
        .to("#live22", 1, { opacity: 1 }, "+=1")
        .to(".steps__circle #circle4", 1, { background: "white" })
        .addLabel("hidetimeline")
        .to("#livescreen2", 0, { opacity: 1 })
        .to("#livedesc2", 0.5, { opacity: 0, pointerEvents: "none" })
        // .to(".bleeding-bg", 0.5, { background: "var(--doubts-radial)" })
        // .to("#doubtdesc", 0.5, { opacity: 1, pointerEvents: "all" }, "-=0.5")
        // .to("#doubtscreen", 0.5, { opacity: 1 }, "-=1")
        // .to("#doubtscreen", 0.5, { opacity: 1 })
        .to(".steps__circle #circle4", 0.5, { background: "grey" })
        // .to(".steps__circle #circle5", 0.5, { background: "white" }, "-=0.5")
        // .to("#doubt2", 1, { opacity: 1 }, "+=1")
        // .to(".steps__circle #circle5", 1, { background: "white" })
        // .addLabel("hidelivescreen")
        // .to("#doubtscreen", 0, { opacity: 1 })
        // .to("#doubtdesc", 0.5, { opacity: 0, pointerEvents: "none" })
        .to(".bleeding-bg", 0.5, { background: "var(--blaze-radial)" })
        .to("#searchdesc", 0.5, { opacity: 1, pointerEvents: "all" }, "-=0.5")
        .to("#searchscreen", 0.5, { opacity: 1 }, "-=1")
        .to("#searchscreen", 0.5, { opacity: 1 })
        .to(".steps__circle #circle5", 0.5, { background: "grey" }, "-=0.5")
        .to(".steps__circle #circle6", 0.5, { background: "white" }, "-=1")
        .to("#search2", 1, { opacity: 1 }, "+=1")
        .to(".steps__circle #circle6", 2, { background: "white" })
        .addLabel("hidedoubtscreen")
        .to(".footer__wrapper", 0.5, { opacity: 0 })
        .to(".final__footer", 1, { display: "flex", opacity: 1 })
        .to(".desktop__landing__footer", 3, { y: "0%" })
        .addLabel("footer");

      // document.querySelector(".loading__wrapper").style.display = "none";
      const e = document.body.style.top;

      document.body.style.position = "";
      document.body.style.top = "";
      window.scrollTo(0, -1 * parseInt(e || "0"));
    })

}

export default initialize;
