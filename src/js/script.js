const CHART = Highcharts.chart("container", {
  chart: {
    type: "column",
  },
  xAxis: {
    categories: ["USA", "China", "Brazil", "EU", "India", "Russia"],
    crosshair: false,
    accessibility: {
      description: "Countries",
    },
    title: {
      text: null,
    },
  },
  yAxis: {
    min: 0,
    max: 100,
    title: {
      text: null,
    },
  },
  legend: {
    enabled: false,
    reversed: true,
  },
  tooltip: {
    valueSuffix: "",
    formatter: function () {
      return this.key + " : " + this.y;
    },
    positioner: function (labelWidth, labelHeight, point) {
      let tooltipX = point.plotX + this.chart.plotLeft - labelWidth / 2;
      let tooltipY = point.plotY;
      return {
        x: tooltipX,
        y: tooltipY,
      };
    },
  },
  colors: ["#FF0000", "#FFF000", "#FF00FF", "#00FFFF", "#24CBE5", "#64E572"],
  plotOptions: {
    column: {
      colorByPoint: true,
      pointPadding: 0,
      borderWidth: 0,
    },
  },
  series: [
    {
      name: "",
      data: [10, 20, 100, 40, 50, 30],
    },
  ],
});

// setTimeout(() => {
//   CHART.series[0].setData([100, 50, 40, 30, 20, 10]);
// }, 5000);
