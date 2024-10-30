import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import { SettingsManager } from '../settingsManager';
import { Button, Heading, Input, Select, Subheading, TextArea } from '../components/Elements'
import { Airport, Flight } from '../models';
import API from '../api';
import AirportInput from './AirportInput';

interface FlightPatchOptions {
    date?: string;
    origin?: Airport;
    destination?: Airport;
    departureTime?: string;
    arrivalTime?: string;
    seat?: string;
    ticketClass?: string;
    duration?: number;
    distance?: number;
    airplane?: string;
    tailNumber?: string;
    airline?: string;
    flight_number?: string;
    notes?: string;
}
export default function SingleFlight({ flightID }) {
    const [flight, setFlight] = useState<Flight>();
    const [flightPatch, setFlightPatch] = useState<FlightPatchOptions>({});
    const [editMode, setEditMode] = useState<Boolean>(false);
    const navigate = useNavigate();
    const metricUnits = SettingsManager.getSetting("metricUnits");

    useEffect(() => {
        API.get(`/flights?id=${flightID}&metric=${metricUnits}`)
        .then((data) => {
            setFlight(data);
        });
    }, []);

    if(flight === undefined) {
        return (
            <p className="m-4">Loading...</p>
        );
    }

    const updateFlightPatch = (key: string, value: any) => {
        if(!value) {
            setFlightPatch(current => {
                const copy = {...current};
                delete copy[key];
                return copy;
            })
            return;
        }

        setFlightPatch({...flightPatch, [key]: value});
    }

    const toggleEditMode = () => {
        setEditMode(!editMode);
    }

    const handleInputChange = (event) => {
        const key = event.target.name;
        const value = event.target.value;

        updateFlightPatch(key, value);
    }

    const handleSaveClick = () => {
        if(!flightPatch) {
            this.toggleEditMode();
            return;
        }

        API.patch(`flights?id=${flight.id}`, flightPatch)
        .then(() => window.location.reload());
    }

    const handleDeleteClick = () => {
        if(confirm("Are you sure?")) {
            API.delete(`/flights?id=${flight.id}`)
            .then(() => navigate("/"));
        }
    }

    return (
        <>
            <Heading text={`${flight.origin.iata || flight.origin.municipality } to ${flight.destination.iata || flight.destination.municipality}`} />
            <h2 className="-mt-4 mb-4 text-xl">{flight.date}</h2>
           
            <div>
            <div className="flex flex-wrap">
                <div className="container">
                    <Subheading text="Timings" />
                    { editMode ? 
                    <>
                        <p>Date: <Input type="date" name="date" onChange={handleInputChange} /></p>
                        <p>Departure Time: <Input type="time" name="departureTime" onChange={handleInputChange} /></p>
                        <p>Arrival Time: <Input type="time" name="arrivalTime" onChange={handleInputChange} /></p>
                        <p>Arrival Date: <Input type="date" name="arrivalDate" onChange={handleInputChange} /></p>
                        <p>Duration: <Input type="number" name="duration" onChange={handleInputChange} /></p>
                    </>
                    :
                    <>
                        <p>Date: <span>{flight.date}</span></p>
                        <p>Departure Time: <span>{flight.departureTime || "N/A"}</span></p>
                        <p>Arrival Time: <span>{flight.arrivalTime || "N/A"}</span></p>
                        <p>Arrival Date: <span>{flight.arrivalDate || "N/A"}</span></p>
                        <p>Duration: <span>{flight.duration ? flight.duration + " min" : "N/A"}</span></p>
                    </>
                    }
                </div>

                <div className="container">
                    <Subheading text="Airports" />
                    { editMode ?
                    <>
                        <p>Origin: <AirportInput onSelected={(airport: Airport) => updateFlightPatch("origin", airport)} /></p>
                        <p>Destination: <AirportInput onSelected={(airport: Airport) => updateFlightPatch("destination", airport)} /></p>
                        <p>Distance (km): <Input type="number" name="distance" onChange={handleInputChange} /></p>
                    </>
                    :
                    <>
                        <p>Distance: <span>{flight.distance ? flight.distance + (metricUnits === "false" ? " mi" : " km") : "N/A"}</span></p>
                        <p className="font-bold">Origin</p> 
                        <ul className="mb-2">
                            <li>ICAO/IATA: <span>{flight.origin.icao}/{flight.origin.iata}</span></li>
                            <li>Type: <span>{flight.origin.type}</span></li>
                            <li>Name: <span>{flight.origin.name}</span></li>
                            <li>Location: <span>{flight.origin.continent}, {flight.origin.country}, {flight.origin.region}, {flight.origin.municipality}</span></li>
                        </ul>

                        <p className="font-bold">Destination</p> 
                        <ul>
                            <li>ICAO/IATA: <span>{flight.destination.icao}/{flight.destination.iata}</span></li>
                            <li>Type: <span>{flight.destination.type}</span></li>
                            <li>Name: <span>{flight.destination.name}</span></li>
                            <li>Location: <span>{flight.destination.continent}, {flight.destination.country}, {flight.destination.region}, {flight.destination.municipality}</span></li>
                        </ul>
                    </>
                    }
                </div>

                <div className="container md:max-w-[33%]">
                    <Subheading text="Other" />
                    { editMode ?
                    <>
                        <div className="flex space-x-4">
                            <p>Seat: <Select name="seat" onChange={handleInputChange} options={[
                                { text: "Choose", value: "" },
                                { text: "Aisle", value: "aisle" },
                                { text: "Middle", value: "middle" },
                                { text: "Window", value: "window" }
                            ]} /></p>
                            <p>Class: <Select name="ticketClass" onChange={handleInputChange} options={[
                                { text: "Choose", value: "" },
                                { text: "Private", value: "private" },
                                { text: "First", value: "first" },
                                { text: "Business", value: "business" },
                                { text: "Economy+", value: "economy+" },
                                { text: "Economy", value: "economy" }
                            ]} /></p>
                        </div>
                        <div className="flex space-x-4">
                            <p>Airplane: <Input type="text" name="airplane" onChange={handleInputChange} /></p>
                            <p>Tail Number: <Input type="text" name="tailNumber" onChange={handleInputChange} /></p>
                        </div>
                        <div className="flex space-x-4">
                            <p>Airline: <Input type="text" name="airline" onChange={handleInputChange} /></p>
                            <p>Flight Number: <Input type="text" name="flightNumber" onChange={handleInputChange} /></p>
                        </div>
                        <p>Notes</p>
                        <TextArea name="notes" onChange={handleInputChange}/>
                    </>
                    :
                    <>
                        <p>Seat: <span>{flight.seat || "N/A"}</span></p>
                        <p>Class: <span>{flight.ticketClass || "N/A"}</span></p>
                        <p>Airplane: <span>{flight.airplane || "N/A"}</span></p>
                        <p>Tail Number: <span>{flight.tailNumber || "N/A"}</span></p>
                        <p>Flight Number: <span>{flight.airline || ""} {flight.flightNumber || "N/A"}</span></p>
                        <p>Notes: {flight.notes || "N/A"}</p>
                    </>}
                </div>
            </div>

            { editMode &&
                <Button text="Save" 
                        level="success" 
                        disabled={!flightPatch || Object.keys(flightPatch).length === 0} 
                        onClick={handleSaveClick} />
            }
            <Button text={editMode ? "Cancel" : "Edit" } level="default" onClick={toggleEditMode}/>
            <Button text="Delete" level="danger" onClick={handleDeleteClick}/>
            </div>
        </>
    );
}
