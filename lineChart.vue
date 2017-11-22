<template>
  <div class="main">
    <div class="main-label" ref='mainLabel' >
      <div class="label-box" v-for="(item, index) in chartData" :key="index">
        <span @click="deletLiner(index)" class="label-color" :style="{'background': item.storkColor}"></span>
        <span>{{item.label}}</span>
      </div>
    </div>
    <svg class="main-svg" ref="mainSvg">
      <g class="axis x-axis"></g>
      <g class="axis y-axis"></g>
      <g class="prenoms">
        <g class="lines"></g>
        <g class="circles"></g>
      </g>
    </svg>
    <div class="main-popup" v-if="popup.show && hiddenIndex.length < chartData.length" :style="{ 'left': !popup.position && '20%' || 'auto', 'right': popup.position  && '20%' || 'auto'}">
      <h2>{{popup.label}}</h2>   
      <div class="popup-value" v-for="(item, index) in popup.values" v-if=" typeof (hiddenIndex.find((d) => d == index)) !== 'number'" :key="index">
        <span class="popup-color" :style="{'background': item.color}"></span>
        <span>{{item.value}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import * as d3 from 'd3'

export default {
  props: {
    chartData: {
      type: Array
    },
    step: {
      type: Number
    }
  },
  data () {
    const xScale = d3.scaleLinear()
    const yScale = d3.scaleLinear()
    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale)
    return {
      xScale,
      yScale,
      xAxis,
      yAxis,
      CWidth: 0,
      CHeight: 0,
      padding: 30,
      xMax: 0,
      xMin: 0,
      yMax: 0,
      popup: {
        show: false,
        label: '',
        values: null,
        position: null
      },
      hiddenIndex: []
    }
  },
  mounted () {
    this.svg = d3.select(this.$refs.mainSvg)
    this.label = d3.select(this.$refs.mainLabel)
    this.onresize(this.onresize)
    const svg = this.$refs.mainSvg

    svg.addEventListener('mouseleave', (evt) => {
      this.popup.show = false
      this.svg
        .selectAll('.circles g > g')
        .attr('visibility', 'hidden')
    }, true)
    svg.addEventListener('mousemove', (evt) => {
      const x = evt.clientX - svg.getBoundingClientRect().left
      const step = this.step
      let currentStep = Math.round(this.xScale.invert(x) / step) * step
      if (currentStep <= this.xMax && currentStep >= this.xMin) {
        // popup状态
        this.popup.show = true
        this.popup.position = x < this.CWidth / 2 ? 'right' : null
        this.popup.values = []
        this.chartData && this.chartData.map(({ data, storkColor }) => {
          const yIndex = data.findIndex((d) => d.x == currentStep)

          if (yIndex !== -1 && data[yIndex]) {
            this.popup.values.push({
              value: data[yIndex].y,
              color: storkColor
            })
          }
        })
        this.popup.label = currentStep
        // 点状态
        this.svg.selectAll('.circles g > g')
          .attr('visibility', function () {
            const gX = this.getAttribute('x')
            return gX == currentStep ? '' : 'hidden'
          })
      }
    }, true)
  },
  methods: {
    updateAxis (item) {
      // 取出最大xy
      const xMax = Math.round(d3.max(item.data, (d) => d.x))
      this.xMax = xMax
      this.xMin = Math.round(d3.min(item.data, (d) => d.x))
      const yMax = Math.round(d3.max(item.data, (d) => d.y))
      this.yMax = yMax

      // 重新设置xy轴
      this.xScale.domain([0, xMax])
      this.yScale.domain([0, yMax])

      this.svg.select('.x-axis').call(this.xAxis)
      this.svg.select('.y-axis').call(this.yAxis)
    },
    transformForCircle (d) {
      const x = this.xScale(d.x)
      const y = this.yScale(d.y)
      return `translate(${x} ${y})`
    },
    updateLiner () {
      const datasets = this.chartData

      datasets.map((item) => {
        console.log(item)
        const storkCol = item.storkColor
        this.updateAxis(item)
        this.updateCircle(item)
        // 画线
        const lines = this.svg
          .select('.prenoms .lines')
          .append('path')
        lines.classed('liner', true)
          .style('stroke', storkCol)
          .attr('d', this.lineGenerator(item.data))

        // 添加动画
        const pathLength = lines.node().getTotalLength()
        lines.style('stroke-dasharray', pathLength).transition().duration(750)
          .styleTween('stroke-dashoffset', () => d3.interpolateNumber(pathLength, 0))
      })
    },
    updateCircle (item) {
      const circle = this.svg.select('.prenoms .circles').append('g')
      item.data.map((dataSet) => {
        const newCircle = circle.append('g')
          .attr('transform', this.transformForCircle(dataSet))
          .attr('visibility', 'hidden')
          .attr('x', dataSet.x)

        newCircle
          .append('circle')
          .attr('cx', 0)
          .attr('cy', 0)
          .attr('r', 5)
          .attr('fill', item.storkColor)
        newCircle
          .append('circle')
          .attr('cx', 0)
          .attr('cy', 0)
          .attr('r', 3)
          .attr('fill', 'white')
      })
    },
    deletLiner (index) {
      const lines = this.svg.select(`.lines path:nth-child(${index + 1})`)
      const circle = this.svg.select(`.circles>g:nth-child(${index + 1})`)
      const colorSpan = this.label.select(`.label-box:nth-child(${index + 1}) .label-color`)

      // 添加动画
      const pathLength = lines.node().getTotalLength()
      if (lines.attr('hidden')) {
        // label
        colorSpan.classed('hidden', null)
        // line
        lines.attr('hidden', null).style('stroke-dasharray', pathLength).transition().duration(750)
          .styleTween('stroke-dashoffset', () => d3.interpolateNumber(pathLength, 0))
        // points
        circle.attr('visibility', '')
        this.hiddenIndex = this.hiddenIndex.filter((d) => d !== index)
      } else {
        // label
        colorSpan.classed('hidden', true)
        // line
        lines.attr('hidden', true).style('stroke-dasharray', pathLength).transition().duration(750)
          .styleTween('stroke-dashoffset', () => d3.interpolateNumber(0, pathLength))
        // points
        circle.attr('visibility', 'hidden')
        this.hiddenIndex.push(index)
      }
    },
    onresize () {
      // 触发计算属性
      const CWidth = this.$refs.mainSvg.clientWidth
      this.CWidth = CWidth
      const CHeight = this.$refs.mainSvg.clientHeight
      this.CHeight = CHeight

      const t = d3.transition().duration(200)
      const padding = this.padding

      // 重新绘制
      this.xScale.range([padding, CWidth - padding])
      this.yScale.range([CHeight - padding, padding])

      this.yAxis.ticks(10).tickSize(0)
      this.xAxis.ticks(10).tickSize(0)


      this.svg
        .select('.x-axis')
        .attr('stroke', '#999')
        .attr('transform', `translate(0, ${this.yScale.range()[0]})`)
        .transition(t)
        .call(this.xAxis)
      this.svg
        .select('.y-axis')
        .attr('stroke', '#999')
        .attr('transform', `translate( ${this.xScale.range()[0]}, 0 )`)
        .transition(t)
        .call(this.yAxis)
      this.chartData && this.chartData.map((item, index) => {
        // 画线
        this.svg
          .select(`.lines path:nth-child(${index + 1})`)
          .style('stroke-dasharray', 0) // 页面伸缩 path长度改变
          .transition(t)
          .attr('d', this.lineGenerator(item.data))
        // 画点
        item.data.map((dataSet, circleIndex) => {
          this.svg
            .select(`.circles g:nth-child(${index + 1}) g:nth-child(${circleIndex + 1})`)
            .attr('transform', this.transformForCircle(dataSet))
        })
      })
    }
  },
  computed: {
    lineGenerator (data) {
      const padding = this.padding
      const xStep = (this.CWidth - padding * 2) / this.xMax
      const yStep = (this.CHeight - padding * 2) / this.yMax

      // 返回xy坐标点
      return d3.line()
        .x((d) => Math.round(xStep * d.x) + padding)
        .y((d) => this.CHeight - padding - Math.round(yStep * d.y))
    }
  },
  watch: {
    'chartData': 'updateLiner'
  }
}
</script>
<style>
.main {
  width: 100%;
  height: 300px;
  text-align: center;
  position: relative;
}
.main-svg {
  width: 80%;
  height: 100%;
}
.lines path {
  fill: transparent;
  stroke-width: 2;
}
.label-box {
  display: inline-block;
  margin-right: 10px;
}
.label-box span{
  vertical-align: middle;
}
.label-color {
  width: 40px;
  height: 10px;
  display: inline-block;
  margin-right: 5px;
  cursor: pointer;
  position: relative;
}
.label-color.hidden:after{
  content: '/';
  font-weight: 900;
  color: #999;
  position: absolute;
  font-size: 16px;
  left: 45%;
  line-height: 10px;
  height: 100%;
}
.main-popup {
  background: rgba(12,12,12,.5);
  color: #fff;
  width: 200px;
  padding: 10px;
  position: absolute;
  top: 20%;
  text-align: left;
}
.popup-value {
  background: #fff;
  color: #999;
  padding: 5px 10px;
}
.popup-value span {
  vertical-align: middle;
}
.popup-value .popup-color {
  display: inline-block;
  width: 50px;
  height: 20px;
  margin-right: 10px;
}
.axis path.domain {
  stroke: #999;
  stroke-width: 2px
}
</style>
