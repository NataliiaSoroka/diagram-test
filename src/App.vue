<template>
  <div id="app">
    <transition-group name="fade">
      <div key="1" v-if="hasRegions">
        <chart-component :transitions="transitions"/>
        <selector-component @input="onChange" :regionsList="regions"/>
      </div>
      <div key="2" v-else>
        <div class="global-spinner-wrapper">
          <PulseLoader />
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import SelectorComponent from '@/components/SelectorComponent.vue'
import ChartComponent from '@/components/ChartComponent.vue'
import govData from '@/services/govData'
import { propEq, map, find, propOr, prop, sortBy, compose, path } from 'ramda'

const getRegionNameByCode = regionCode => compose(
  propOr('', 'regionName'),
  find(propEq('regionCode', regionCode))
)

const setRegionInSelect = regionCode => {
  setTimeout(() => {
    const regionOptionElement = document.querySelector(`option[value="${regionCode}"]`)
    regionOptionElement.selected = true
  }, 100)
}

export default {
  name: 'App',
  components: {
    ChartComponent,
    SelectorComponent,
    PulseLoader
  },
  data () {
    return {
      selectedRegion: '',
      regions: [],
      transitions: []
    }
  },
  computed: {
    hasRegions () {
      return prop('length', this.regions)
    }
  },
  methods: {
    async onChange (regionCode) {
      try {
        this.transitions = []
        this.selectedRegion = regionCode
        this.getTransitons(regionCode)
      } catch (err) {
        console.warn('error in onChange')
        console.error(err)
      }
    },
    async getRegions () {
      try {
        const response = await govData.fetchRegions()
        this.regions = [ ...response ]
        const defaultRegionCode = path([1, 'regionCode'], this.regions)
        if (defaultRegionCode) {
          await this.onChange(defaultRegionCode)
          setRegionInSelect(defaultRegionCode)
        }
      } catch (err) {
        console.warn('error in getRegions')
        console.error(err)
      }
    },
    async getTransitons (region) {
      try {
        let res = await govData.fetchTransitions(region)
        const sortedData = sortBy(prop('trans_date'), res)
        const ammountList = map(prop('amount'), sortedData)
        const transactionsDates = map(prop('trans_date'), sortedData)
        const uniqueDates = new Set(transactionsDates)
        const getRegionName = getRegionNameByCode(region)
        const regionName = getRegionName(this.regions)
        this.transitions = [
          [ 'x', ...uniqueDates ],
          [ regionName, ...ammountList ]
        ]
      } catch (err) {
        console.warn('error in getTransactions')
        console.error(err)
      }
    }
  },
  async mounted () {
    try {
      this.getRegions()
    } catch (err) {
      console.warn('error in Mounted hook')
      console.error(err)
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s ease-out;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.global-spinner-wrapper {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
