import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

import { Heading, Label, Input, Select, Dialog, Whisper } from '../components/Elements';
import SingleFlight from '../components/SingleFlight';
import { Flight } from '../models'
import API from '../api'
import { SettingsManager } from '../settingsManager';

interface FlightsFilters {
    limit?: number;
    offset?: number;
    order?: "DESC"|"ASC";
    sort?: "date"|"seat"|"ticket_class"|"duration"|"distance";
    start?: string;
    end?: string;
}
export default function AllFlights() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [filters, setFilters] = useState<FlightsFilters>({})

    const flightID = searchParams.get("id");

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        var filters = {}

        formData.forEach((value, key) => {
            if(value) {
                filters = {...filters, [key]: value};
            }
        })

        setFilters(filters);
        //event.target.reset();
    }

    if(flightID) {
        return (
            <SingleFlight flightID={flightID} />
        );
    }
    else {
        return (
            <>
                <Heading text="All Flights" />
                <Dialog title="Filters"
                        onSubmit={handleSubmit}
                        formBody={(
                        <>
                            <Label text="Limit" />
                            <Input type="number" name="limit" />
                            <br />
                            <Label text="Offset" />
                            <Input type="number" name="offset" />
                            <br />
                            <Label text="Order" />
                            <Select name="order"
                                    options={[
                                { text: "Choose", value: "" },
                                { text: "Descending", value: "DESC" },
                                { text: "Ascending", value: "ASC" }
                            ]}/>
                            <br />
                            <Label text="Sort By" />
                            <Select name="sort"
                                    options={[
                                { text: "Choose", value: "" },
                                { text: "Date", value: "date" },
                                { text: "Seat", value: "seat" },
                                { text: "Ticket Class", value: "ticket_class" },
                                { text: "Duration", value: "duration" },
                                { text: "Distance", value: "distance" }
                            ]}/>
                            <br />
                            <Label text="Start Date" />
                            <Input type="date" name="start" />
                            <br />
                            <Label text="End Date" />
                            <Input type="date" name="end" />
                        </>
                        )}/>

                <FlightsTable filters={filters} />
            </>
        );
    }
}

function TableCell({ text }) {
    return (
        <td className="px-2 py-1 border border-gray-300">
            {text}
        </td>
    );
}

function TableHeading({ text }) {
    return (
        <th className="px-2 border border-gray-300 bg-primary-300 font-semibold">
            {text}
        </th>
    );
}

function FlightsTable({ filters }: { filters: FlightsFilters }) {
    const [flights, setFlights] = useState<Flight[]>();
    const navigate = useNavigate();
    const metricUnits = SettingsManager.getSetting("metricUnits");

    useEffect(() => {
        API.get(`/flights?metric=${metricUnits}`, filters)
        .then((data) => {
            setFlights(data);
        });
    }, [filters]);

    if(flights === undefined) {
        return (
            <p className="m-4">Loading...</p>
        );
    }
    else if (flights.length === 0) {
        return (
            <p className="m-4">No flights!</p>
        );
    }

    const handleRowClick = (flightID: number) => {
        navigate(`/flights?id=${flightID}`);
    }

    return (
    <>
        <div className="overflow-x-auto">
        <table className="table-auto w-full">
            <tr>
                <TableHeading text="Date"/>
                <TableHeading text="Origin"/>
                <TableHeading text="Destination"/>
                <TableHeading text="Departure Time"/>
                <TableHeading text="Arrival Time"/>
                <TableHeading text="Duration"/>
                <TableHeading text="Distance"/>
                <TableHeading text="Seat"/>
                <TableHeading text="Class"/>
                <TableHeading text="Airplane"/>
                <TableHeading text="Airline"/>
                <TableHeading text="Flight Number"/>
            </tr>
            { flights.map((flight: Flight) => (
            <tr className="cursor-pointer even:bg-gray-100 hover:bg-gray-200 duration-75" 
                onClick={() => handleRowClick(flight.id)}>
                <TableCell text={flight.date}/>
                <TableCell text={flight.origin.municipality + ' (' + (flight.origin.iata || flight.origin.icao) + ')'}/>
                <TableCell text={flight.destination.municipality + ' (' + (flight.destination.iata || flight.destination.icao) + ')'} />
                <TableCell text={flight.departureTime || ""}/>
                <TableCell text={flight.arrivalTime || ""}/>
                <TableCell text={flight.duration ? flight.duration + " min" : ""}/>
                <TableCell text={flight.distance ? flight.distance.toLocaleString() + (metricUnits === "false" ? " mi" : " km") : ""}/>
                <TableCell text={flight.seat || ""}/>
                <TableCell text={flight.ticketClass || ""} />
                <TableCell text={flight.airplane || ""}/>
                <TableCell text={flight.airline || ""}/>
                <TableCell text={flight.flightNumber || ""}/>
            </tr>
            ))}
        </table>
        </div>

        <Whisper text={`Showing at most ${filters.limit || 50} flights. Adjust filters for more.`} />

    </>
    );
}
