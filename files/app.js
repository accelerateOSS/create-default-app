const headingDiv = document.querySelector(".heading-div");
const colorChangeButton = document.querySelector(".color-change-button");

colorChangeButton.addEventListener("click", () => {
  const headingColor = headingDiv.style.color;
  if (headingColor !== "red") {
    headingDiv.style.color = "red";
  } else {
    headingDiv.style.color = "black";
  }
});
