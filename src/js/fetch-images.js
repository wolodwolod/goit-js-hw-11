import axios from 'axios'
export { fetchImages }

axios.defaults.baseURL = 'https://pixabay.com/api/'
const KEY = '25433386-4f25aa275c005ef248c74251b'

async function fetchImages(query, page, perPage) {
  const response = await axios.get(
    `?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`,
  )
  return response
}
