import './css/styles.css'
import { fetchImages } from './js/fetch-images'
import { renderGallery } from './js/render-gallery'
import Notiflix from 'notiflix'
import SimpleLightbox from 'simplelightbox'
import 'simplelightbox/dist/simple-lightbox.min.css'

const refs = {
searchForm: document.querySelector('#search-form'),
gallery: document.querySelector('.gallery'),
loadMoreBtn: document.querySelector('.btn-load-more')
};
// console.log(refs.searchForm);
// console.log(refs.gallery);
// console.log(refs.loadMoreBtn);

let query = ''
let page = 1
const perPage = 40
let simpleLightBox

refs.searchForm.addEventListener('submit', onSearchForm);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtn);

function onSearchForm(e) {
  e.preventDefault()
  
  page = 1
  query = e.currentTarget.searchQuery.value.trim()
  refs.gallery.innerHTML = ''
  refs.loadMoreBtn.classList.add('is-hidden')

  if (query === '') {
    alertNoEmptySearch()
    return
  }

  fetchImages(query, page, perPage)
    .then(({ data }) => {
      if (data.totalHits === 0) {
        alertNoImagesFound()
      } else {
        renderGallery(data.hits)
        simpleLightBox = new SimpleLightbox('.gallery__link').refresh()
        alertImagesFound(data)

        if (data.totalHits > perPage) {
          refs.loadMoreBtn.classList.remove('is-hidden')
        }
      }
    })
    .catch(error => console.log(error))
}

function onLoadMoreBtn() {
  page += 1
  simpleLightBox.destroy()

  // console.log(page)
  

  fetchImages(query, page, perPage)
    .then(({ data }) => {
      renderGallery(data.hits)
      simpleLightBox = new SimpleLightbox('.gallery__link').refresh()

      const totalPages = Math.ceil(data.totalHits / perPage)

// console.log(totalPages)

      if (page === totalPages) {
        refs.loadMoreBtn.classList.add('is-hidden')
        alertEndOfSearch()
      }
    })
    .catch(error => console.log(error))
}

function alertImagesFound(data) {
  Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`)
}

function alertNoEmptySearch() {
  Notiflix.Notify.failure('The search string cannot be empty. Please specify your search query.')
}

function alertNoImagesFound() {
  Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
}

function alertEndOfSearch() {
  Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.")
}
