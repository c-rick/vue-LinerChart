import Vue from 'vue'
import LineChart from './lineChart.vue'



new Vue({
  el: '#app',
  data: {
    chartData: [],
    dataSet: false
  },
  methods: {
    addData (key) {
      if (!this.dataSet) {
        this.chartData = [{
          label: 'test1',
          storkColor: '#449eef',
          data: [{
            x: 0,
            y: 70
          }, {
            x: 100,
            y: 20
          }, {
            x: 200,
            y: 10
          }, {
            x: 300,
            y: 20
          }, {
            x: 400,
            y: 10
          }, {
            x: 500,
            y: 50
          }, {
            x: 600,
            y: 80
          }, {
            x: 700,
            y: 10
          }, {
            x: 800,
            y: 90
          }, {
            x: 900,
            y: 10
          }]
        }, {
          label: 'test2',
          storkColor: '#999',
          data: [{
            x: 0,
            y: 10
          }, {
            x: 100,
            y: 40
          }, {
            x: 200,
            y: 20
          }, {
            x: 300,
            y: 60
          }, {
            x: 400,
            y: 70
          }, {
            x: 500,
            y: 20
          }, {
            x: 600,
            y: 40
          }, {
            x: 700,
            y: 30
          }, {
            x: 800,
            y: 50
          }, {
            x: 900,
            y: 90
          }, {
            x: 1000,
            y: 20
          }]
        }]
        this.dataSet = true
      }
    }
  },
  template: `<div style="width:100vw;">
    <LineChart :step="100" :chartData="chartData"  />
    <div style="margin: 30px 0;">
      <button @click="addData()">add Data</button>
    </div>
  </div>`,
  components: {
    LineChart
  }
})
