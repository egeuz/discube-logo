const lineModes = ["stretch", "rigid", "long"];
const animationModes = ["mouse", "noise", "oscillation"];

//randomly change modes on each click
document.addEventListener("click", () => {
  let lineArray = lineModes.filter(mode => mode !== logo.lineMode);
  let lineMode = lineArray[rng(0, lineArray.length - 1)];
  logo[`${lineMode}Mode`]();

  let animArray = animationModes.filter(mode => mode !== logo.animationMode);
  let animMode = animArray[rng(0, animArray.length - 1)];
  logo[`${animMode}Mode`]();
});

/**** HELPER METHODS ****/
const rng = (min, max) => Math.floor(Math.random() * (max-min+1) + min);