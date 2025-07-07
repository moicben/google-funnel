import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip, CartesianGrid } from 'recharts';

const SimpleFunnelChart = ({ data, title }) => {
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
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
          />
          <YAxis 
            tickFormatter={(value) => value.toLocaleString('fr-FR')}
          />
          <Tooltip 
            formatter={(value, name) => [value.toLocaleString('fr-FR'), 'Nombre']}
            labelFormatter={(label) => `Étape: ${label}`}
          />
          <Bar 
            dataKey="value" 
            radius={[4, 4, 0, 0]}
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

export default SimpleFunnelChart;
