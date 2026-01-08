import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const data = [
  {day: "Wk1", hours: 18},
  {day: "Wk2", hours: 23},
  {day: "Wk3", hours: 15.5},
  {day: "Wk4", hours: 15},
  {day: "Wk5", hours: 16},
  {day: "Wk6", hours: 33},
  {day: "Wk7", hours: 9.5}
];
const colors = ["#e6af39", '#fa8080', '#90f883', '#a9a3fa', '#e280a0', '#92c2ee', '#d780f1']
function DashBarChartB() {
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
export default DashBarChartB