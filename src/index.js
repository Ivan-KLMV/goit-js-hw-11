import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com';
// axios.defaults.headers.common['Authorization'] =
//   '34585976-51a68d3a5f9444fd8119e93c8';

console.log(axios.defaults);
axios
  .get(
    '/api/?key=34585976-51a68d3a5f9444fd8119e93c8&q=cats&image_type=photo&orientation=horizontal&safesearch=true'
  )
  .then(res => console.log(res));
