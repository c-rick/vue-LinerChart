import Vue from 'vue'
import LineChart from './lineChart.vue'


const vals = {
  test1: {
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
  },
  test2: {
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
  }
}

new Vue({
  el: '#app',
  data: {
    chartData: []
  },
  methods: {
    addData (key) {
      console.log(key)
      console.log(vals.hasOwnProperty(key))
      console.log(vals, vals[`${key}`])
      this.chartData.push(vals[`${key}`])
      console.log(this.chartData)
    }
  },
  template: `<div style="width:100vw;">
    <LineChart :step="100" :chartData="chartData"  />
    <div style="margin: 30px 0;">
      <button @click="addData('test1')">add test1</button>
      <button @click="addData('test2')">add test2</button>
    </div>
  </div>`,
  components: {
    LineChart
  }
})
