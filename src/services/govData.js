import api from '@/services/api'

export default {
  async fetchRegions () {
    try {
      const { data } = await api().get('regions')
      return data
    } catch (err) {
      console.error(err)
      throw err
    }
  },
  async fetchTransitions (region) {
    try {
      const { data } = await api().get(`api/transactions/top100?region=${region}`)
      return data
    } catch (err) {
      console.error(err)
      throw err
    }
  }
}
