import { BarChart } from "@mui/x-charts";

interface ChartDataItem {
  value: number;
  label: string;
}

const Chart: React.FunctionComponent = (): JSX.Element => {

  const chartData: ChartDataItem[] = [
    {
      value: 10,
      label: 'A',
    },
    {
      value: 15,
      label: 'B',
    },
    {
      value: 20,
      label: 'C',
    },
  ];

  const labels: string[] = chartData.map(item => item.label);
  const values: number[] = chartData.map(item => item.value);

  return (
    <div>
      <div>
        <h2 className="text-2xl font-bold mb-4 text-center">Mint Stats</h2>
        <BarChart
          xAxis={[{ scaleType: 'band', data: labels }]}
          series={[{ data: values }]}
          width={500}
          height={300}
        />
      </div>
    </div>
  )
}

export default Chart;