import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const data = [
  {day: "Mon", hours: 2},
  {day: "Tue", hours: 2.5},
  {day: "Wed", hours: 1.75},
  {day: "Thu", hours: 1.7},
  {day: "Fri", hours: 1.8},
  {day: "Sat", hours: 3.5},
  {day: "Sun", hours: 1.25}
];
const colors = ["#e6af39", '#fa8080', '#90f883', '#a9a3fa', '#e280a0', '#92c2ee', '#d780f1']
function DashBarChartA() {
  return(
    <>
      <ResponsiveContainer width="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="day" />
          <YAxis width={25}/>
          <Tooltip />
          <Bar dataKey="hours">
            {data.map((e, i) => (
              <Cell key={`cell-${i}`} fill={colors[i % colors.length]}/>
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </>
  )
}
export default DashBarChartA