    import { useState, useEffect } from 'react';

    function NearestSuburbanFinder() {
        console.log("a")
    const [nearestSuburban, setNearestSuburban] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [error, setError] = useState(null);

    const getLocation = () => {
        console.log("hello")
        if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
            },
            (error) => {
            setError(error.message);
            }
        );
        } else {
        setError('Geolocation is not supported by this browser.');
        }
    };
    useEffect(() => {
        const findNearestSuburban = async () => {
        if (!latitude || !longitude) return;

        const response = await fetch(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=suburb&key=AIzaSyD34h9d_K9bH8A6PTpiSViKvq7zomZ1Yjc`
        );
            console.log(response)
        if (response.ok) {
            const data = await response.json();
            if (data.status === 'OK' && data.results.length > 0) {
            const nearestLocation = data.results[0];
            setNearestSuburban(nearestLocation);
            } else {
            console.error('No nearby suburbs found.');
            }
        } else {
            console.error('Failed to fetch nearby suburbs:', response.statusText);
        }
        };

        findNearestSuburban();
    }, [latitude, longitude]);

    return (
        <div>
        <button onClick={getLocation}>Get My Location</button>
            {/* {nearestSuburban ? (
                <div>
                <h2>Nearest Suburban Location:</h2>
                <p>Name: {nearestSuburban.name}</p>
                <p>Latitude: {nearestSuburban.geometry.location.lat}</p>
                <p>Longitude: {nearestSuburban.geometry.location.lng}</p>
                </div>
            ) : (
                <p>{error || 'Finding nearest suburban location...'}</p>
            )} */}
        </div>
    );
    }

    export default NearestSuburbanFinder;
