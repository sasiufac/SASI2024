const sections = document.querySelectorAll(".animate-slide-down");
sections.forEach((section) => {
  const htmlSection = section as HTMLElement;
  htmlSection.style.opacity = "0";
  htmlSection.style.transform = "translateY(-20px)";
});

window.addEventListener("load", () => {
  let delay = 0;
  sections.forEach((section) => {
    setTimeout(() => {
      const htmlSection = section as HTMLElement;
      htmlSection.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      htmlSection.style.opacity = "1";
      htmlSection.style.transform = "translateY(0)";
    }, delay);
    delay += 200;
  });
});
