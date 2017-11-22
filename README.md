this is a example for d3 and vue lineChart
## d3(v4.12.0)

## vue(v2.5.8)

##prop

step: x轴的间隔单位
chartData: 数据
like this:
```
  const chartData = [{
    label: 'test2',
    storkColor: '#999',
    data: [{x:num,y:num}...]
  },...]

  <LineChart :step="100" :chartData="chartData"  />
```
 ![image](https://github.com/2016caicai/vue-LinerChart/raw/master/example.jpg)
