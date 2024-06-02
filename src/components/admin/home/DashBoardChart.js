// src/components/Dashboard.js
import React, { useEffect } from 'react';
import Highcharts from 'highcharts';

// const data = [
//   { category: 'Apple', value: 10 },
//   { category: 'Banana', value: 15 },
//   { category: 'Cherry', value: 25 },
//   { category: 'Date', value: 30 },
//   { category: 'Elderberry', value: 20 },
//   { category: 'Fig', value: 5 },
//   { category: 'Grape', value: 40 },
// ];

const DashBoardChart = ({data}) => {


  useEffect(() => {
    const barOptions = {
      chart: {
        type: 'bar',
        renderTo: 'bar-chart',
      },
      credits: {
        enabled: false
      },
      title: {
        text: '',
      },
      xAxis: {
        categories: data.reportByCondition.map((item) => item.name),
      },
      series: [
        {
          name: 'Số lượng',
          data: data.reportByCondition.map((item) => item.count),
        },
      ],
    };

    let pieTotal = data.reportByCondition.reduce((tot, cur) => tot + cur.count, 0)

    const pieOptions = {
      chart: {
        type: 'pie',
        renderTo: 'pie-chart',
      },
      credits: {
        enabled: false
      },
      title: {
        text: '',
      },
      series: [
        {
          name: '%',
          data: data.reportByCondition.map((item) => ({ name: item.name, y: (Math.round((item.count*100/pieTotal) * 100) / 100) })),
        },
      ],
    };

    const scatterOptions = {
      chart: {
        type: 'scatter',
        renderTo: 'scatter-chart',
      },
      
      tooltip:{
            formatter:function(){
                return `${this.x}: ${this.y} sản phẩm`
            }
        },
      credits: {
        enabled: false
      },
      title: {
        text: '',
      },
      xAxis: {
        categories: data.reportByCondition.map((item) => item.name),
      },
      series: [
        {
          name: 'Số lượng',
          data: data.reportByCondition.map((item) => item.count),
        },
      ],
    };

    const lineOptions = {
        chart: {
            type: 'line',
            renderTo: 'line-chart',
          },
        title: {
            text: '',
        },
        credits: {
            enabled: false
        },
        xAxis: {
            type: "datetime"
        },
        tooltip:{
            formatter:function(){
                return `Ngày ${new Date(this.x).toLocaleDateString()} <br/> Doanh thu: ${this.y.toLocaleString()}`
            }
        },
        yAxis: {
            title: {
                text: 'Doanh thu'
            }
        },
        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                },
            }
        },
        series: [{
            data: data.totals.map((el) => {
                return [(new Date(el.createdDate)).getTime(), el.total]
            })
        }],
    }

    Highcharts.chart(barOptions);
    Highcharts.chart(pieOptions);
    Highcharts.chart(scatterOptions);
    Highcharts.chart(lineOptions);
    
  }, [data]);

  return (
    <div className='flex flex-col w-full gap-2 p-2'>
      <div className='flex flex-row w-full gap-2'>
        <div id="bar-chart"  className='w-1/3 h-[300px]' ></div>
        <div id="pie-chart" className='w-1/3  h-[300px]' ></div>
        <div id="line-chart" className='w-1/3 h-[300px]'></div>
      </div>
      <div id="scatter-chart" className='w-full  h-[300px]' ></div>
    </div>
  );
};

export default DashBoardChart;
