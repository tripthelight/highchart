const BAR_CHART_DATA = [100, 200, -5, 5, 0, 200];
const radiusValue = 8;

function chartDashArray(pathEl) {
  const PATH_WRAP = document.querySelector(
    ".highcharts-container g.highcharts-series-group g.highcharts-series"
  );
  if (!PATH_WRAP) return;
  const PATH_LIST = PATH_WRAP.querySelectorAll("path");
  if (!PATH_LIST || PATH_LIST.length === 0) return;
  const idx = pathEl.index
  const totalLengths = PATH_LIST[idx].getTotalLength();
  const w = PATH_LIST[idx].getBoundingClientRect().width
  const h = PATH_LIST[idx].getBoundingClientRect().height - radiusValue
  const wh = w + h
  const radius = radiusValue * (Math.PI / 2)
  // PATH_LIST[idx].style.strokeDasharray = `${w - (radiusValue * 2) + radius + h} ${w}`;
  // PATH_LIST[idx].style.strokeDashoffset = 0;
  PATH_LIST[idx].style.strokeDasharray = `2 2`;
  PATH_LIST[idx].style.strokeDashoffset = 0;
}

const LINE_CHART = Highcharts.chart("LINE_CHART", {
  chart: {
    type: "column",
    animation: true,
    events: {
      // 막대 클릭 이벤트
      load: function () {
        var chartElem = this.options.chart;
        var points = this.series[0].points;
        points.forEach(function (point) {
          point.graphic.on("click", function () {
            // console.log(chartElem);
            chartElem.animation = false;
            // 클릭된 막대의 스타일 변경
            // point.update({
            //   borderWidth: 0, // 테두리 너비를 늘림
            //   borderColor: 'transparent',
            //   color: '#FF0000',
            // });

            // 클릭하지 않은 다른 막대의 스타일 변경
            points.forEach(function (otherPoint, idx) {
              if (otherPoint !== point) {
                otherPoint.update({
                  color: "transparent",
                  dashStyle: "dash",
                  borderWidth: otherPoint.y === 0 ? 0 : 1, // 다른 막대의 테두리를 숨김
                  borderColor: 'rgba(0, 0, 0, 0.5)',
                });
                chartDashArray(otherPoint);
              } else {
                point.update({
                  borderWidth: 0, // 테두리 너비를 늘림
                  borderColor: 'transparent',
                  color: '#FF0000',
                });
              }
            });
          });
        });
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
  xAxis: {
    categories: ["DATA_1", "DATA_2", "DATA_3", "DATA_4", "DATA_5", "DATA_6"],
    crosshair: false,
    title: {
      text: null,
    },
  },
  yAxis: {
    min: Math.min(...BAR_CHART_DATA) - 10,
    max: Math.max(...BAR_CHART_DATA) + 10,
    title: {
      text: null,
    },
  },
  legend: {
    enabled: false,
    // reversed: true,
  },
  tooltip: {
    valueSuffix: "",
    shadow: false,
    style: {
      boxShadow: "none",
    },
    formatter: function () {
      return `<div class="tooltip">${this.key} : ${this.y}</div>`;
    },
    positioner: function (labelWidth, labelHeight, point) {
      let tooltipX = point.plotX + this.chart.plotLeft - labelWidth / 2;
      let tooltipY = point.plotY - 35;
      return {
        x: tooltipX,
        y: tooltipY,
      };
    },
  },
  colors: ["#FF0000", "#FFF000", "#FF00FF", "#00FFFF", "#24CBE5", "#64E572"],
  plotOptions: {
    stacking: false,
    column: {
      colorByPoint: true,
      pointPadding: 0,
      borderWidth: 0,
    },
    series: {
      // borderRadius: `${document.getElementById('range').value}%`,
      // borderRadius: 10,
      // borderRadius: `${radiusValue}px`,
      borderRadius: `${radiusValue}px`,
      borderWidth: 0,
      borderColor: "transparent",
      dataLabels: {
        enabled: false,
      },
      stacking: false,
      borderColor: "transparent",
      borderWidth: 0,
      dashStyle: "dash",
      // events: {
      //   click: function (event) {
      //     console.log("click");
      //   },
      // },
    },
  },
  series: [
    {
      name: "",
      data: BAR_CHART_DATA,
      // borderRadius: `${radiusValue}px`,
    },
  ],
});

// S : common functions
const pathArray = (pathString) => 
  pathString
    .match(/[a-zA-Z](\s*-?\d+(\.\d+)?\s*,?\s*)+/g)
    .reduce((accumulator, command) => {
      const parts = command.trim().split(/\s|,/);
      const letter = parts.shift();
      const params = parts.map(parseFloat);
      const obj = {};
      obj[letter] = params.length === 1 ? params[0] : params;
      accumulator.push(obj);
      return accumulator;
    }, []);

function convertArrayToString(arr, state) {
  let result = "";
  arr.forEach((item) => {
    const key = Object.keys(item)[0];
    const values = item[key];
    result += key + " ";
    values.forEach((value, index) => {
      result += value;
      if (index % 2 === 0) {
        result += " ";
      } else {
        result += " ";
        if (index < values.length - 1) {
          result += " ";
        }
      }
    });
    if (key === "C") {
      result += " ";
    }
  });

  if (state) {
    result += "Z";
    return result.replace(/ {2}/g, ' ');
    // return result.replace(/\s+/g, ' ');
  }
  return result.replace(/ {2}/g, ' ');
  // return result.replace(/\s+/g, ' ');
}

function dashStrChange (elem, state) {
  const pathArr = pathArray(elem.getAttribute('d'));
  const pathArrClone = JSON.parse(JSON.stringify(pathArr));
  if (state) {
    if (elem.getBoundingClientRect().height < radiusValue) {
      pathArrClone[0].M = pathArr[7].L
    } else {
      pathArrClone[0].M = pathArr[5].L
    }
    pathArrClone[1].L = pathArr[7].L
    pathArrClone[2].C = pathArr[8].C
    pathArrClone[3].L = pathArr[1].L
    pathArrClone[4].C = pathArr[2].C
    pathArrClone[5].L = pathArr[3].L
  } else {
    pathArrClone[0].M = pathArr[1].L
    pathArrClone[1].L = pathArr[3].L
    pathArrClone[2].C = pathArr[4].C
    pathArrClone[3].L = pathArr[5].L
    pathArrClone[4].C = pathArr[6].C
    pathArrClone[5].L = pathArr[0].M
    if (elem.getBoundingClientRect().height < radiusValue) {
      pathArrClone[5].L = pathArrClone[4].C.slice(-2);
    } else {
      pathArrClone[5].L = pathArr[0].M
    }
  }
  pathArrClone.splice(-3);
  return pathArrClone;
}
// E : common functions

/*
function changeConvertAC () {
  const PATH_WRAP = document.querySelector(
    ".highcharts-container g.highcharts-series-group g.highcharts-series"
  );
  if (!PATH_WRAP) return;
  const PATH_LIST = PATH_WRAP.querySelectorAll("path");
  if (!PATH_LIST || PATH_LIST.length === 0) return;

  for (let i = 0; i < PATH_LIST.length; i++) {
    const pArr = pathArray(PATH_LIST[i].getAttribute('d'))
    const newArr = pArr.map((item, index) => {
      if (index === 2 || index === 4 || index === 6 || index === 8) {
        return {
          'C': item.A
        }
      }
      return item
    })
    for (const [key, value] of Object.entries(newArr)) {
      if (Object.keys(value)[0] === 'C') {
        value.C = [];
        if (Number(key) === 2) {
          value.C[0] = newArr[1].L[0]
        }
      }
    }
  }
}
changeConvertAC();
*/

// path dash의 A를 C로 바꿈 - 이건 할필요 없음
function changeDashAC () {
  const PATH_WRAP = document.querySelector(".highcharts-container g.highcharts-series-group g.highcharts-series");
  if (!PATH_WRAP) return;
  const PATH_LIST = PATH_WRAP.querySelectorAll("path");
  if (!PATH_LIST || PATH_LIST.length === 0) return;

  for (let i = 0; i < PATH_LIST.length; i++) {
    let arr = [];
    const dArr = pathArray(PATH_LIST[i].getAttribute('d'));
    const newDarr = dArr.map((item, index) => {
      if (BAR_CHART_DATA[i] !== 0) {
        if (item.A) {
          arr = [];
          if (BAR_CHART_DATA[i] > 0) {
            if (PATH_LIST[i].getBoundingClientRect().height < radiusValue) {
              if (index === 2) {
                arr.push(dArr[index - 1].L[0]);
                arr.push(dArr[index - 1].L[1]);
                arr.push(item.A[5]);
                arr.push(dArr[index - 1].L[1]);
                arr.push(item.A[5]);
                arr.push(item.A[6]);
                return {
                  'C': arr
                }
              } else if (index === 4) {
                arr.push(dArr[index - 1].L[0]);
                arr.push(dArr[index - 1].L[1]);
                arr.push(dArr[index - 1].L[0]);
                arr.push(dArr[index - 1].L[1]);
                arr.push(dArr[index - 1].L[0]);
                arr.push(dArr[index - 1].L[1]);
                return {
                  'C': arr
                }
              } else if (index === 6) {
                arr.push(dArr[index - 1].L[0]);
                arr.push(dArr[index - 1].L[1]);
                arr.push(dArr[index - 1].L[0]);
                arr.push(dArr[index - 1].L[1]);
                arr.push(dArr[index - 1].L[0]);
                arr.push(dArr[index - 1].L[1]);
                return {
                  'C': arr
                }
              } else if (index === 8) {
                arr.push(dArr[index - 1].L[0]);
                arr.push(dArr[index - 1].L[1]);
                arr.push(dArr[index - 1].L[0]);
                arr.push(dArr[0].M[1]);
                arr.push(dArr[0].M[0]);
                arr.push(dArr[0].M[1]);
                return {
                  'C': arr
                }
              }
            } else {
              if (index === 2) {
                arr.push(dArr[index - 1].L[0]);
                arr.push(dArr[index - 1].L[1]);
                arr.push(dArr[index - 1].L[0] + radiusValue);
                arr.push(dArr[index - 1].L[1]);
                arr.push(dArr[index - 1].L[0] + radiusValue);
                arr.push(dArr[index - 1].L[1] + radiusValue);
                return {
                  'C': arr
                }
              } else if (index === 4) {
                arr.push(dArr[index - 1].L[0]);
                arr.push(dArr[index - 1].L[1]);
                arr.push(dArr[index - 1].L[0] - PATH_LIST[i].getBoundingClientRect().width);
                arr.push(dArr[index - 1].L[1]);
                arr.push(dArr[index - 1].L[0] - PATH_LIST[i].getBoundingClientRect().width);
                arr.push(dArr[index - 1].L[1]);
                return {
                  'C': arr
                }
              } else if (index === 6) {
                arr.push(dArr[index - 1].L[0]);
                arr.push(dArr[index - 1].L[1]);
                arr.push(dArr[index - 1].L[0]);
                arr.push(dArr[index - 1].L[1]);
                arr.push(dArr[index - 1].L[0]);
                arr.push(dArr[index - 1].L[1]);
                return {
                  'C': arr
                }
              } else if (index === 8) {
                arr.push(dArr[index - 1].L[0]);
                arr.push(dArr[index - 1].L[1] - radiusValue);
                arr.push(dArr[index - 1].L[0] + radiusValue);
                arr.push(dArr[index - 1].L[1] - radiusValue);
                arr.push(dArr[index - 1].L[0] + radiusValue);
                arr.push(dArr[index - 1].L[1] - radiusValue);
                return {
                  'C': arr
                }
              }
            }
          } else {
            if (PATH_LIST[i].getBoundingClientRect().height < radiusValue) {
              /*
                M 196.9282032302755 217 
                L 196.9282032302755 217 
                A 0 0 0 0 1 196.9282032302755 217 
                L 196.9282032302755 217 
                A 8 8 0 0 1 190 221 
                L 163 221 
                A 8 8 0 0 1 156.0717967697245 217 
                L 156.0717967697245 217 
                A 0 0 0 0 1 196.9282032302755 217 
                Z
              */
              /*
                M 196.9282032302755 217 
                L 196.9282032302755 217 
                C 196.9282032302755 217 196.9282032302755 217 196.9282032302755 217 
                L 196.9282032302755 217 
                C 196.9282032302755 217 196.9282032302755 221 190 221 
                L 163 221 
                C 163 221 156.0717967697245 221  156.0717967697245 217 
                L 156.0717967697245 217 
                C 156.0717967697245 217 156.0717967697245 217 156.0717967697245 217 
                Z
              */
                if (index === 2) {
                  arr.push(dArr[index - 1].L[0]);
                  arr.push(dArr[index - 1].L[1]);
                  arr.push(dArr[index - 1].L[0]);
                  arr.push(dArr[index - 1].L[1]);
                  arr.push(dArr[index - 1].L[0]);
                  arr.push(dArr[index - 1].L[1]);
                  return {
                    'C': arr
                  }
                } else if (index === 4) {
                  arr.push(dArr[index - 1].L[0]);
                  arr.push(dArr[index - 1].L[1]);
                  arr.push(dArr[index - 1].L[0]);
                  arr.push(item.A[6]);
                  arr.push(item.A[5]);
                  arr.push(item.A[6]);
                  return {
                    'C': arr
                  }
                } else if (index === 6) {
                  arr.push(dArr[index - 1].L[0]);
                  arr.push(dArr[index - 1].L[1]);
                  arr.push(item.A[5]);
                  arr.push(dArr[index - 1].L[1]);
                  arr.push(item.A[5]);
                  arr.push(item.A[6]);
                  return {
                    'C': arr
                  }
                } else if (index === 8) {
                  arr.push(dArr[index - 1].L[0]);
                  arr.push(dArr[index - 1].L[1]);
                  arr.push(dArr[index - 1].L[0]);
                  arr.push(dArr[index - 1].L[1]);
                  arr.push(dArr[index - 1].L[0]);
                  arr.push(dArr[index - 1].L[1]);
                  return {
                    'C': arr
                  }
                }
            } else {
              if (index === 2) {
                arr.push(dArr[index - 1].L[0]);
                arr.push(dArr[index - 1].L[1]);
                arr.push(dArr[index - 1].L[0]);
                arr.push(dArr[index - 1].L[1]);
                arr.push(dArr[index - 1].L[0]);
                arr.push(dArr[index - 1].L[1]);
                return {
                  'C': arr
                }
              } else if (index === 4) {
                arr.push(dArr[index - 1].L[0]);
                arr.push(dArr[index - 1].L[1]);
                arr.push(dArr[index - 1].L[0]);
                arr.push(dArr[index - 1].L[1] + radiusValue);
                arr.push(dArr[index - 1].L[0] - radiusValue);
                arr.push(dArr[index - 1].L[1] + radiusValue);
                return {
                  'C': arr
                }
              } else if (index === 6) {
                arr.push(dArr[index - 1].L[0]);
                arr.push(dArr[index - 1].L[1]);
                arr.push(dArr[index - 1].L[0] - radiusValue);
                arr.push(dArr[index - 1].L[1]);
                arr.push(dArr[index - 1].L[0] - radiusValue);
                arr.push(dArr[index - 1].L[1] - radiusValue);
                return {
                  'C': arr
                }
              } else if (index === 8) {
                arr.push(dArr[index - 1].L[0]);
                arr.push(dArr[index - 1].L[1]);
                arr.push(dArr[index - 1].L[0]);
                arr.push(dArr[index - 1].L[1]);
                arr.push(dArr[index - 1].L[0]);
                arr.push(dArr[index - 1].L[1]);
                return {
                  'C': arr
                }
              }
            }
          }
        }
      }
      return item;
    });
    PATH_LIST[i].setAttribute('d', convertArrayToString(newDarr, true));
  }
}
changeDashAC();

// 마이너스 bar를 거꾸로 바꿈 =========================================
const radiusChange = () => {
  const PATH_WRAP = document.querySelector(".highcharts-container g.highcharts-series-group g.highcharts-series");
  if (!PATH_WRAP) return;
  const PATH_LIST = PATH_WRAP.querySelectorAll("path");
  if (!PATH_LIST || PATH_LIST.length === 0) return;

  /*
  const changePath = PATH_LIST[5];
  const pathString = `
    M 380 59 L 407 59 C 407 59 415 59 415 67 L 415 289 C 415 289 415 289 415 289 L 372 289 C 372 289 372 289 372 289 L 372 67 C 372 67 372 59 380 59 Z
  `
  const pathArr = pathArray(pathString);
  const newPathArr = JSON.parse(JSON.stringify(pathArr));
  for (const [key, value] of Object.entries(pathArr)) {
    if (changePath.getBoundingClientRect().height < radiusValue) {
      switch (Number(key)) {
        case 0:
          value.M[0] = newPathArr[7].L[0];
          break;
        case 1:
          value.L[0] = newPathArr[3].L[0];
          break;
        case 2:
          value.C[0] = newPathArr[3].L[0];
          value.C[1] = newPathArr[0].M[1];
          value.C[2] = newPathArr[3].L[0];
          value.C[3] = newPathArr[0].M[1];
          value.C[4] = newPathArr[3].L[0];
          value.C[5] = newPathArr[0].M[1];
          break;
        case 3:
          value.L[0] = newPathArr[3].L[0];
          value.L[1] = newPathArr[0].M[1];
          break;
        case 4:
          value.C[0] = newPathArr[3].L[0];
          value.C[1] = newPathArr[0].M[1];
          value.C[2] = newPathArr[3].L[0];
          value.C[3] = newPathArr[0].M[1];
          value.C[4] = newPathArr[3].L[0];
          value.C[5] = newPathArr[0].M[1];
          break;
        case 5:
          value.L[0] = newPathArr[3].L[0];
          value.L[1] = newPathArr[0].M[1];
          break;
        case 6:
          value.C[0] = newPathArr[3].L[0];
          value.C[1] = newPathArr[0].M[1];
          value.C[2] = newPathArr[3].L[0];
          value.C[3] = newPathArr[3].L[1];
          value.C[4] = newPathArr[1].L[0];
          value.C[5] = newPathArr[3].L[1];
          break;
        case 7:
          value.L[0] = newPathArr[0].M[0];
          value.L[1] = newPathArr[3].L[1];
          break;
        case 8:
          value.C[0] = newPathArr[0].M[0];
          value.C[1] = newPathArr[3].L[1];
          value.C[2] = newPathArr[7].L[0];
          value.C[3] = newPathArr[3].L[1];
          value.C[4] = newPathArr[7].L[0];
          value.C[5] = newPathArr[0].M[1];
          break;
        default:
          break;
      }
    } else {
      switch (Number(key)) {
        case 0:
          value.M[0] = value.M[0] - radiusValue;
          break;
        case 1:
          value.L[0] = value.L[0] + radiusValue;
          break;
        case 2:
          value.C[0] = value.C[0] + radiusValue;
          value.C[5] = value.C[5] - radiusValue;
          break;
        case 3:
          value.L[1] = value.L[1] - radiusValue;
          break;
        case 4:
          value.C[1] = value.C[1] - radiusValue;
          value.C[2] = value.C[0];
          value.C[4] = value.C[0] - radiusValue;
          break;
        case 5:
          value.L[0] = value.L[0] + radiusValue;
          break;
        case 6:
          value.C[0] = value.C[0] + radiusValue;
          value.C[5] = value.C[5] - radiusValue;
          break;
        case 7:
          value.L[1] = value.L[1] - radiusValue;
          break;
        case 8:
          value.C[2] = value.C[2];
          value.C[4] = value.C[4] - radiusValue;
          break;
        default:
          break;
      }
    }
  }
  changePath.setAttribute("d", convertArrayToString(pathArr, true));
  */

  for (let i = 0; i < PATH_LIST.length; i++) {
    if (BAR_CHART_DATA[i] < 0) {
      const changePath = PATH_LIST[i];
      const pathString = changePath.getAttribute("d");
      const pathArr = pathArray(pathString);
      const newPathArr = JSON.parse(JSON.stringify(pathArr));
      for (const [key, value] of Object.entries(pathArr)) {
        if (changePath.getBoundingClientRect().height < radiusValue) {
        switch (Number(key)) {
          case 0:
            value.M[0] = newPathArr[7].L[0];
            break;
          case 1:
            value.L[0] = newPathArr[3].L[0];
            break;
          case 2:
            value.C[0] = newPathArr[3].L[0];
            value.C[1] = newPathArr[0].M[1];
            value.C[2] = newPathArr[3].L[0];
            value.C[3] = newPathArr[0].M[1];
            value.C[4] = newPathArr[3].L[0];
            value.C[5] = newPathArr[0].M[1];
            break;
          case 3:
            value.L[0] = newPathArr[3].L[0];
            value.L[1] = newPathArr[0].M[1];
            break;
          case 4:
            value.C[0] = newPathArr[3].L[0];
            value.C[1] = newPathArr[0].M[1];
            value.C[2] = newPathArr[3].L[0];
            value.C[3] = newPathArr[0].M[1];
            value.C[4] = newPathArr[3].L[0];
            value.C[5] = newPathArr[0].M[1];
            break;
          case 5:
            value.L[0] = newPathArr[3].L[0];
            value.L[1] = newPathArr[0].M[1];
            break;
          case 6:
            value.C[0] = newPathArr[3].L[0];
            value.C[1] = newPathArr[0].M[1];
            value.C[2] = newPathArr[3].L[0];
            value.C[3] = newPathArr[3].L[1];
            value.C[4] = newPathArr[1].L[0];
            value.C[5] = newPathArr[3].L[1];
            break;
          case 7:
            value.L[0] = newPathArr[0].M[0];
            value.L[1] = newPathArr[3].L[1];
            break;
          case 8:
            value.C[0] = newPathArr[0].M[0];
            value.C[1] = newPathArr[3].L[1];
            value.C[2] = newPathArr[7].L[0];
            value.C[3] = newPathArr[3].L[1];
            value.C[4] = newPathArr[7].L[0];
            value.C[5] = newPathArr[0].M[1];
            break;
          default:
            break;
        }
      } else {
        switch (Number(key)) {
          case 0:
            value.M[0] = value.M[0] - radiusValue;
            break;
          case 1:
            value.L[0] = value.L[0] + radiusValue;
            break;
          case 2:
            value.C[0] = value.C[0] + radiusValue;
            value.C[5] = value.C[5] - radiusValue;
            break;
          case 3:
            value.L[1] = value.L[1] - radiusValue;
            break;
          case 4:
            value.C[1] = value.C[1] - radiusValue;
            value.C[2] = value.C[0];
            value.C[4] = value.C[0] - radiusValue;
            break;
          case 5:
            value.L[0] = value.L[0] + radiusValue;
            break;
          case 6:
            value.C[0] = value.C[0] + radiusValue;
            value.C[5] = value.C[5] - radiusValue;
            break;
          case 7:
            value.L[1] = value.L[1] - radiusValue;
            break;
          case 8:
            value.C[2] = value.C[2];
            value.C[4] = value.C[4] - radiusValue;
            break;
          default:
            break;
        }
      }
      }
      changePath.setAttribute("d", convertArrayToString(pathArr, true));
    }
  }
};
// 에니메이션이 끝난 후 실행
// setTimeout(() => {
//   console.log('시작 1');
//   radiusChange();
// }, 4000);


// path의 시작 M을 바꿈 ===============================================
const dashStrCheck = () => {
  const PATH_WRAP = document.querySelector(".highcharts-container g.highcharts-series-group g.highcharts-series");
  if (!PATH_WRAP) return;
  const PATH_LIST = PATH_WRAP.querySelectorAll("path");
  if (!PATH_LIST || PATH_LIST.length === 0) return;

  for (let i = 0; i < PATH_LIST.length; i++) {
    if (BAR_CHART_DATA[i]) {
      if (BAR_CHART_DATA[i] > 0) {
        PATH_LIST[i].setAttribute('d', convertArrayToString(dashStrChange(PATH_LIST[i], true), false));
      } else if (BAR_CHART_DATA[i] < 0) {
        PATH_LIST[i].setAttribute('d', convertArrayToString(dashStrChange(PATH_LIST[i], false), false));
      }
    }
  }
}
// 에니메이션이 끝난 후 실행
setTimeout(() => {
  console.log('시작 2');
  dashStrCheck();
}, 3000);

/*
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
*/
