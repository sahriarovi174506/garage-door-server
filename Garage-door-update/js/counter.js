(() => {
  function isInViewport(t) {
    const e = t.getBoundingClientRect();
    return (
      e.top >= 0 &&
      e.left >= 0 &&
      e.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      e.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  function startCounter(t, e, n) {
    const o = parseFloat(t.getAttribute("data-min")) || 0;
    parseFloat(t.getAttribute("data-max"));
    let r = o;
    const c = document.createElement("span");
    (c.className = "count"), t.appendChild(c);
    const a = document.createElement("span");
    function d(t) {
      return t.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    (a.className = "symbol"),
      (a.textContent = n || ""),
      t.appendChild(a),
      (function t() {
        r <= e
          ? ((c.textContent = d(Math.round(r))),
            (r += (e - o) / 100),
            requestAnimationFrame(t))
          : (c.textContent = d(e));
      })();
  }

  let countersStarted = {};

  function checkAndStartCounters() {
    document.querySelectorAll(".counter").forEach((t, e) => {
      const n = `counter${e + 1}`;
      if (isInViewport(t) && !countersStarted[n]) {
        t.style.opacity = 1;
        const e = t.getAttribute("data-symbol") || "";
        startCounter(t, parseFloat(t.getAttribute("data-max")) || 100, e),
          (countersStarted[n] = !0);
      }
    });
  }

  document.addEventListener("DOMContentLoaded", checkAndStartCounters);
  document.addEventListener("scroll", checkAndStartCounters);
})();
