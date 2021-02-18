import refs from "./refs";
import API from "./servises/apiService";
import button from "./components/button";
import spinner from "./components/spinner";
import "../dist/basicLightbox.min.css";
import * as basicLightbox from "basiclightbox";
import cardMarkup from "../templates/card.hbs"



// функция для отрисовки розметки галереи, скрывает кнопку, к-рая догружает фото //

function renderCard(cardName) {
  const marcup = cardMarkup(cardName);
  refs.gallery.insertAdjacentHTML("beforeend", marcup);
  button.show();
  refs.gallery.addEventListener("click", loadLightBox);
}


refs.searchForm.addEventListener("submit", findCards);
refs.button.addEventListener("click", loadMoreCards);


export default function loadLightBox(event) {
  event.preventDefault();
  const img = event.target;
  const imgBigUrl = img.attributes.data.nodeValue;
  const instance = basicLightbox.create(
    `<img src= ${imgBigUrl} width="800" height="600">`,
  );
  instance.show();
}

// функция поиска картинок //

function findCards(event) {
  event.preventDefault();

  button.hide();
  spinner.show();

  const input = refs.searchForm;
  API.query = input.elements.query.value;
  clearInput();
  searchLastPage();
}

// функция для загрузки большего к-ва картинок

function loadMoreCards() {
  button.hide();
  spinner.show();
  API.incrementPage();
  searchLastPage();
}

// функция для очистки форми //

function clearInput() {
  refs.gallery.innerHTML = "";
  API.resetPage();
}

// функция для проверки на последней страничке

function searchLastPage() {
  API.fetchCards()
    .then((data) => {
      renderCard(data);
      spinner.hide();
      if (API.isLastPage) {
        button.hide();
      }
      if (API.page > 1) {
        window.scrollBy({
          top: window.innerHeight - 40,
          behavior: "smooth",
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
}