import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ConversionChart = ({ stats }) => {
  if (!stats) return null;
  
  const { conversionRates } = stats;
  
  const conversionData = [
    { name: 'Visite → Connexion', rate: conversionRates.visitToLogin },
    { name: 'Connexion → Vérification', rate: conversionRates.loginToVerification },
    { name: 'Vérification → Réservation', rate: conversionRates.verificationToBooking },
    { name: 'Visite → Réservation', rate: conversionRates.visitToBooking }
  ];
  
  const pieData = [
    { name: 'Convertis', value: conversionRates.visitToBooking, color: '#10B981' },
    { name: 'Non convertis', value: 100 - conversionRates.visitToBooking, color: '#E5E7EB' }
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
              stroke="#3B82F6" 
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="conversion-chart">
        <h3>Taux de conversion global</h3>
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
            {conversionRates.visitToBooking.toFixed(1)}%
          </p>
          <p className="conversion-label">de conversion globale</p>
        </div>
      </div>
    </div>
  );
};

export default ConversionChart;
