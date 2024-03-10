const LINE_CHART = Highcharts.chart("LINE_CHART", {
  chart: {
    type: "column",
  },
  title: {
    text: "",
    style: {
      display: "none",
    },
  },
  subtitle: {
    text: "",
    style: {
      display: "none",
    },
  },
  credits: {
    enabled: false,
  },
  xAxis: {
    categories: ["DATA_1", "DATA_2", "DATA_3", "DATA_4", "DATA_5", "DATA_6"],
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
      return `<div class="tooltip">${this.key} : ${this.y}</div>`;
    },
    shadow: false,
    positioner: function (labelWidth, labelHeight, point) {
      let tooltipX = point.plotX + this.chart.plotLeft - labelWidth / 2;
      let tooltipY = point.plotY - 35;
      return {
        x: tooltipX,
        y: tooltipY,
      };
    },
    style: {
      boxShadow: "none",
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
//   LINE_CHART.series[0].setData([100, 50, 40, 30, 20, 10]);
// }, 5000);
var tooltipEnabled = true;

const PIE_CHART = Highcharts.chart("PIE_CHART", {
  chart: {
    type: "pie",
    events: {
      load: function () {
        this.myTooltip = new Highcharts.Tooltip(this, this.options.tooltip);
      },
    },
  },
  title: {
    text: "",
    style: {
      display: "none",
    },
  },
  subtitle: {
    text: "",
    style: {
      display: "none",
    },
  },
  credits: {
    enabled: false,
  },
  tooltip: {
    enabled: false,
    // animation: false,
    valueSuffix: "",
    shadow: false,
    formatter: function () {
      return `<div class="tooltip">${this.key} : ${this.y}</div>`;
    },
    positioner: function (labelWidth, labelHeight, point) {
      let tooltipX = point.plotX;
      let tooltipY = point.plotY;
      return {
        x: tooltipX,
        y: tooltipY,
      };
    },
  },
  colors: ["#FF0000", "#FFF000", "#FF00FF", "#00FFFF", "#24CBE5", "#64E572"],
  plotOptions: {
    pie: {
      dataLabels: {
        enabled: false,
      },
      shadow: false,
      borderWidth: 0,
      allowPointSelect: false,
      cursor: "pointer",
      borderRadius: 0,
      states: {
        inactive: {
          opacity: 1,
        },
      },
    },
    series: {
      stacking: "normal",
      // enableMouseTracking: false,
      borderWidth: 0,
      states: {
        hover: {
          // brightness: 0,
          enabled: false,
          halo: {
            size: 0,
          },
          // halo: {
          //   size: 0,
          // },
          // brightness: 0,
          // borderColor: "black",
          // borderWidth: 0, // enable border on hover
        },
      },
      stickyTracking: false,
      events: {
        click: function (evt) {
          console.log("here click", this.chart.tooltip);
          // console.log("here click", this.chart.container);
          // const DIV_EL = document.createElement("div");
          // DIV_EL.classList.add("pie-chart_tooltip");
          // DIV_EL.innerText = "AAAA";
          // DIV_EL.style.left = `${}px`
          // this.chart.container.appendChild(DIV_EL);
        },
        mouseOut: function () {
          // if (this.chart.lbl) {
          //   this.chart.lbl.hide();
          // }
        },
      },
      point: {
        events: {
          click: function (_event) {
            this.series.chart.update({
              tooltip: {
                enabled: tooltipEnabled,
              },
            });
            // tooltipEnabled = tooltipEnabled ? false : true;
          },
        },
      },
    },
  },
  series: [
    {
      name: "",
      colorByPoint: true,
      data: [
        {
          name: "DATA_1",
          y: 10,
        },
        {
          name: "DATA_2",
          // sliced: true,
          // selected: true,
          y: 20,
        },
        {
          name: "DATA_3",
          y: 30,
        },
        {
          name: "DATA_4",
          y: 40,
        },
        {
          name: "DATA_5",
          y: 50,
        },
      ],
    },
  ],
});
