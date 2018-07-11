import axios from 'axios'

export default () => {
  return axios.create({
    baseURL: 'https://cors-anywhere.herokuapp.com/http://api.spending.gov.ua/api/v2/'
  })
}
