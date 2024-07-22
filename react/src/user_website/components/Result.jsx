const results = [
    {
        airline: 'Emirates',
        departure: 'JFK',
        arrival: 'BOM',
        departureTime: '13:00',
        arrivalTime: '14:20',
        price: '$1,572'
    },
    // Add more results as needed
];

const Results = () => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="mb-4">Results (25)</h2>
            {results.map((result, index) => (
                <div key={index} className="border-b py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <img src={`/path/to/${result.airline.toLowerCase()}.png`} alt={result.airline} className="w-12"/>
                        <div>
                            <h3 className="font-semibold">{result.airline}</h3>
                            <p>{result.departure} to {result.arrival}</p>
                            <p>{result.departureTime} - {result.arrivalTime}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-lg font-semibold">{result.price}</p>
                        <button className="bg-yellow-500 text-white p-2 rounded">Book Now</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Results;