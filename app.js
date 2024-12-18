import { catsData } from "/catsData.js";

const emotionRadios = document.getElementById("emotion-radios");
const getImageBtn = document.getElementById("get-image-btn");
const gifsOnlyCheckbox = document.getElementById("gifs-only-option");
const memeModalInner = document.getElementById("meme-modal-inner");
const memeModalContainer = document.getElementById("meme-modal");
const memeModalCloseBtn = document.getElementById("meme-modal-close-btn");

//! ------------------  EVENT LISTENERS  ---------------------
//! now I want to check which radio id is being clicked on - we can do this with e.target.id and then we want to target its parentElement and ADD the classList of highlight which has the purple bg on it as well as the accent color of purple for the radio btn
//! and we can't just target the div with a class of radio as we must get just the parent of the id/radio btn we are clicking on and not ALL of the div's with a class of radio
emotionRadios.addEventListener("change", highlightEmotions);

getImageBtn.addEventListener("click", renderImage);

memeModalCloseBtn.addEventListener("click", closeImage);

//! ------------------  FUNCTIONS FOR EVENT LISTENERS  ---------------------
function highlightEmotions(e) {
  //console.log(e.target.id); // we get moody, sad etc.

  //? but now we must remove the classList of highlight on all radios so that they don't all stay highlighted so get all the radio btns - with querySelectorAll and loop thru them and remove classList of "highlight"

  removeHighlightFromRadios();

  const selectedEmotion = e.target.id;
  const selectedInput = document.getElementById(selectedEmotion);
  selectedInput.parentElement.classList.add("highlight");

  // document.getElementById(e.target.id).parentElement.classList.add("highlight");
  //this must go below the place where we remove the hightlight
}

function closeImage() {
  memeModalContainer.style.display = "none";
  //? then lets clear the checkboxes
  gifsOnlyCheckbox.checked = false;
  //remove the blue highlight from the radio btn
  let radioBtn = document.querySelector('input[type="radio"]:checked');
  radioBtn.checked = false;
  removeHighlightFromRadios();
}

//! ------------------  OTHER FUNCTIONS  ---------------------
// must get all the emotions (with no repeats) into the emotionRadios div - so filter
// must also get the radio inputs and use the emotion as the label
// they will be in a div with the class of radio
// BUT we must go deeper into the array to get the objects with the emotionTags
// so we will loop over the original array and get each cat
// then we will go into each cat and get its emotionTags
// we must set it up as a function with a parameter and pass the catsData as the argument
// and we want these emotion labels with radios to render when we load the page

function renderEmotionsArray(cats) {
  let emotionsArray = [];
  for (let cat of cats) {
    //we loop thru each cat object in the catsData array
    //so for the 1st cat in the catsData array we get it's emotions from its emotionTags array
    for (let emotion of cat.emotionTags) {
      //we loop thru each emotion of the emotionTags array
      //and for the 1st time we loop we check if the 1st emotion is NOT already in the emotionsArray which for the 1st time looping it will not as the array will be empty so we will push that emotion into the emotionsArray
      //then the second time we
      if (!emotionsArray.includes(emotion)) {
        emotionsArray.push(emotion);
      }
    }
    // console.log(emotionsArray);

    let emotionStr = "";

    emotionsArray.map((emotion) => {
      return (emotionStr += `<div class="radio">
      <label for="${emotion}">${emotion}</label>
      <input type="radio" id="${emotion}" value="${emotion}" name="emotion">
      </div>`);
    });
    emotionRadios.innerHTML = emotionStr;
  }
}
renderEmotionsArray(catsData);

function removeHighlightFromRadios() {
  const radioBtns = document.querySelectorAll(".radio");
  radioBtns.forEach((radio) => {
    radio.classList.remove("highlight");
  });
}

//! 3 parts to get the image rendered
//? find which emotion has been checked & set it to a variable & get its .value
//? BUT if we click the GetImage btn with NO emotions checked we get NULL so we must only run the code IF one HAS been checked
//? then we loop over catsData and use filter to just keep any cat object which has our checkedEmotion in its cat.emotionTags array
//? BUT if the Animated GIFs only checkbox if checked - we don't want ALL of the emotion tags we just want the ones where .isGif === true
function getMatchingCatsArray() {
  if (document.querySelector('input[type="radio"]:checked')) {
    const checkedEmotion = document.querySelector(
      'input[type="radio"]:checked'
    ).value;

    const gifChecked = gifsOnlyCheckbox.checked;
    //console.log(gifChecked); we get true if checked & false if not

    const filteredArray = catsData.filter((cat) => {
      if (gifChecked) {
        return cat.emotionTags.includes(checkedEmotion) && cat.isGif;
      } else {
        return cat.emotionTags.includes(checkedEmotion);
      }
    });
    return filteredArray;
  } //! AND NOW this function RETURN a filtered Array so then we can call this function in another function to get this filtered Array
}

//! but we don't want ALL the cat images which match (from the filter) to be displayed - we just want 1 to be displayed so
//! we call the getMatchingCatsArray function as it returns the filteredArray & if the array only has 1 item we display it otherwise if the filtered array has more than 1 item we chose a randonNumber for its index
function getSingleCatObject() {
  const filteredArray = getMatchingCatsArray();
  if (filteredArray.length === 1) {
    return filteredArray[0];
  } else {
    return filteredArray[Math.floor(Math.random() * filteredArray.length)];
  }
}

function renderImage() {
  const catImage = getSingleCatObject();
  memeModalInner.innerHTML = `<img class="cat-img" src="./images/${catImage.image}" alt="${catImage.alt}">`;
  memeModalContainer.style.display = "flex";
}
