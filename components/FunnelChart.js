import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';

const FunnelChart = ({ data, title }) => {
  console.log('FunnelChart data:', data); // Debug
  
  if (!data || data.length === 0) {
    return (
      <div className="funnel-chart">
        <h3>{title}</h3>
        <p>Aucune donnée disponible pour l'entonnoir</p>
      </div>
    );
  }

  return (
    <div className="funnel-chart">
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          layout="horizontal"
          margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
          barCategoryGap={10}
        >
          <XAxis 
            type="number" 
            domain={[0, 'dataMax']}
            tickFormatter={(value) => value.toLocaleString('fr-FR')}
          />
          <YAxis 
            dataKey="name" 
            type="category" 
            width={90}
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            formatter={(value, name) => [value.toLocaleString('fr-FR'), name]}
          />
          <Bar 
            dataKey="value" 
            radius={[0, 4, 4, 0]}
            minPointSize={5}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="funnel-legend">
        {data.map((item, index) => (
          <div key={index} className="funnel-legend-item">
            <div 
              className="funnel-legend-color" 
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="funnel-legend-text">
              {item.name}: <strong>{item.value != null ? item.value.toLocaleString('fr-FR') : '0'}</strong>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FunnelChart;
