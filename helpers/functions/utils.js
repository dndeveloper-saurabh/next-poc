function getDateInYYYYMMDDFormat() {
  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();

  let newdate = year + "-" + month + "-" + day;
  return newdate;
}

const loadingWrapper = () => {
  document.querySelector(".loading__wrapper").style.display = "flex";
  document.body.style.position = "fixed";
  document.body.style.top = `-${window.scrollY}px`;

  setTimeout(() => {
    document.querySelector(".loading__wrapper").style.display = "none";

    const scrollY = document.body.style.top;
    document.body.style.position = "";
    document.body.style.top = "";
    window.scrollTo(0, parseInt(scrollY || "0") * -1);
  }, 3000);
};

const getPendulumIndicesOfArray = (arr, baseIndex, includeBaseIndex) => {
  let pendulumIndices = includeBaseIndex ? [baseIndex] : [];
  let breakOut = null;
  for(let i = -1; i <= arr.length; i = -(Math.abs(i) + 1) * (i / Math.abs(i))) {
    let toAdd = i;
    if(!breakOut && (baseIndex + i >= arr.length || baseIndex + i < 0)) {
      breakOut = -1 * ((i)/(Math.abs(i)));
    }
    if(breakOut) toAdd = breakOut;
    baseIndex += toAdd;
    pendulumIndices.push(baseIndex)
    if(includeBaseIndex ? pendulumIndices.length === arr.length : pendulumIndices.length === arr.length - 1) break;
  }
  return pendulumIndices;
}

const randomFromArray = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)]
}

export { getDateInYYYYMMDDFormat, getPendulumIndicesOfArray, loadingWrapper };
