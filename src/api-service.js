import axios from 'axios';
import { currentPage, itemsPerPage } from '.';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '30528921-8e859357d7a6bf61cd9b66029';

const defaultParams = {
   image_type: 'photo',
   orientation: 'horizontal',
   safesearch: true,
};

export default async function fetchAPI(query) {
   try {
      const { data } = await axios.get(BASE_URL, {
         params: {
            key: API_KEY,
            q: query.trim(),
            page: currentPage,
            per_page: itemsPerPage,
            ...defaultParams,
         },
      });
      return data;
   } catch (error) {
      console.log(`${error} - but it doesn't really do anything`);
   }
}
