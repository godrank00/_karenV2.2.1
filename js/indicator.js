document.addEventListener("DOMContentLoaded", () => {
  const contentBlock = document.getElementById("content-block");
  const commentBlock = document.getElementById("comment-block");

  const contentIndicator = document.getElementById("content-indicator");
  const commentIndicator = document.getElementById("comment-indicator");

  const clearActiveClasses = () => {
    contentIndicator?.classList.remove("active");
    commentIndicator?.classList.remove("active");
  };

  window.addEventListener("scroll", () => {
    if (!contentBlock && !commentBlock) {
      clearActiveClasses();
      return;
    }

    const halfWindow = window.innerHeight / 2;
    let activeId = null;
    const checkPassedHalf = (el) => {
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return rect.top <= halfWindow && rect.bottom > 0;
    };
    if (checkPassedHalf(commentBlock)) {
      activeId = "comment";
    } else if (checkPassedHalf(contentBlock)) {
      activeId = "content";
    }
    clearActiveClasses();

    if (activeId === "content") {
      contentIndicator?.classList.add("active");
    } else if (activeId === "comment") {
      commentIndicator?.classList.add("active");
    }
  });
});