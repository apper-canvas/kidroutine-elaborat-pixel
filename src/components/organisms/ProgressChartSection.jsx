import React from 'react';
import Chart from 'react-apexcharts';
import Card from '@/components/molecules/Card';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const ProgressChartSection = ({ progressData }) => {
  const chartOptions = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: { show: false },
      background: 'transparent'
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    colors: ['#7C3AED'],
    grid: {
      borderColor: '#f1f5f9',
      strokeDashArray: 5
    },
    xaxis: {
      categories: progressData.daily?.map(day => 
        new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })
      ) || [],
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      min: 0,
      max: 100,
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '12px'
        },
        formatter: (value) => `${value}%`
      }
    },
    markers: {
      size: 6,
      colors: ['#7C3AED'],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 8
      }
    },
    tooltip: {
      y: {
        formatter: (value) => `${value}% completion`
      }
    }
  };

  const chartSeries = [{
    name: 'Completion Rate',
    data: progressData.daily?.map(day => day.rate) || []
  }];

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <Text as="h2" className="text-lg font-semibold text-gray-900">Weekly Progress</Text>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          <Text as="span">Completion Rate</Text>
        </div>
      </div>
      
      {progressData.daily &amp;&amp; progressData.daily.length > 0 ? (
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="line"
          height={350}
        />
      ) : (
        <div className="flex items-center justify-center h-80 text-gray-500">
          <div className="text-center">
            <ApperIcon name="BarChart" className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <Text as="p">No data available for the selected timeframe</Text>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ProgressChartSection;