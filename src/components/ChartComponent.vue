<template>
  <section class="chart-section-wrapper">
    <transition name="fade">
      <div
        v-if="showSpinner"
        class="chart-spinner-wrapper"
      >
        <PulseLoader />
      </div>
    </transition>
    <div>
      <h1>Top 100 transactions by region on timeline</h1>
      <div id="chart"></div>
    </div>
  </section>
</template>

<script>
import c3 from 'c3'
import 'd3/dist/d3.min.js'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import { prop } from 'ramda'

export default {
  name: 'ChartComponent',
  components: {
    PulseLoader
  },
  props: {
    transitions: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      chart: null,
      showSpinner: true
    }
  },
  watch: {
    transitions: {
      handler (newVal, oldVal) {
        this.showSpinner = true
        if (prop('length', oldVal)) {
          oldVal.forEach((el, index) => {
            this.chart.unload({ ids: oldVal[index][0] })
          })
        }
        if (prop('length', newVal)) {
          setTimeout(() => {
            this.chart.load({ columns: newVal })
            this.showSpinner = false
          }, 350)
        }
      },
      immeditate: true
    }
  },
  mounted () {
    this.chart = c3.generate({
      bindto: '#chart',
      data: {
        x: 'x',
        columns: [],
        type: 'bar'
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: {
            format: '%Y-%m-%d'
          }
        }
      }
    })
  }
}
</script>

<style>
@import 'c3/c3.css';
</style>

<style scoped>
  .chart-section-wrapper {
    position: relative;
  }

  .chart-spinner-wrapper {
    background-color: #fff;
    z-index: 10;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
