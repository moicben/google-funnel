import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ConversionChart = ({ stats }) => {
  if (!stats) return null;
  
  const { conversionRates } = stats;
  
  const conversionData = [
    { name: 'Contact → Connexion', rate: conversionRates.contactToLogin },
    { name: 'Contact → Vérification', rate: conversionRates.contactToVerification },
    { name: 'Contact → Réservation', rate: conversionRates.contactToBooking },
    { name: 'Visite → Contact', rate: conversionRates.visitToContact }
  ];
  
  const pieData = [
    { name: 'Convertis', value: conversionRates.contactToBooking, color: '#10B981' },
    { name: 'Non convertis', value: 100 - conversionRates.contactToBooking, color: '#E5E7EB' }
  ];
  
  return (
    <div className="conversion-charts">
      <div className="conversion-chart">
        <h3>Taux de conversion par étape</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={conversionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
            />
            <YAxis />
            <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, 'Taux']} />
            <Line 
              type="monotone" 
              dataKey="rate" 
              stroke="#8B5CF6" 
              strokeWidth={3}
              dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="conversion-chart">
        <h3>Taux de conversion global (Contacts → Réservations)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value.toFixed(1)}%`]} />
          </PieChart>
        </ResponsiveContainer>
        <div className="conversion-summary">
          <p className="conversion-rate">
            {conversionRates.contactToBooking.toFixed(1)}%
          </p>
          <p className="conversion-label">de conversion globale</p>
        </div>
      </div>
    </div>
  );
};

export default ConversionChart;
