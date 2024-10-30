export class Flight {
    id: number;
    date: string;
    origin: Airport;
    destination: Airport;
    departureTime: string;
    arrivalTime: string;
    arrivalDate: string;
    seat: string;
    ticketClass: string;
    duration: number;
    distance: number;
    airplane: string;
    tailNumber: string;
    airline: string;
    flightNumber: string;
    notes: string;
}

export class Airport {
    icao: string;
    iata: string;
    type: string;
    name: string;
    municipality: string;
    region: string;
    country: string;
    continent: string;
    latitude: number;
    longitude: number;
}

export class Statistics {
    totalFlights: number;
    totalDuration: number;
    totalDistance: number;
    totalUniqueAirports: number;
    daysRange: number;
    mostVisitedAirports: object;
    seatFrequency: object;
    ticketClassFrequency: object;
}

export class Coord {
    latitude: number;
    longitude: number;
    frequency: number;
}

export class Trajectory {
    first: Coord;
    second: Coord;
    frequency: number;
}
