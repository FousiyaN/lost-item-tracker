import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';
import { getDistance } from '../utils/geo';

const LocationContext = createContext();

export function useLocation() {
    return useContext(LocationContext);
}

export function LocationProvider({ children }) {
    const { currentUser } = useAuth();
    const [homeLocation, setHomeLocation] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [permissionError, setPermissionError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasNotified, setHasNotified] = useState(false);

    // Load home location from Firestore
    useEffect(() => {
        if (!currentUser) return;

        async function loadHomeLocation() {
            try {
                const docRef = doc(db, 'users', currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists() && docSnap.data().homeLocation) {
                    setHomeLocation(docSnap.data().homeLocation);
                }
            } catch (err) {
                console.error("Failed to load home location", err);
            }
            setLoading(false);
        }

        loadHomeLocation();
    }, [currentUser]);

    // Request Notification permissions
    useEffect(() => {
        if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
            Notification.requestPermission();
        }
    }, []);

    // Watch position
    useEffect(() => {
        if (!('geolocation' in navigator)) {
            setPermissionError('Geolocation is not supported by your browser');
            return;
        }

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const coords = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                setCurrentLocation(coords);
                setPermissionError(null);

                // Check distance if home is set
                if (homeLocation && !hasNotified) {
                    const distance = getDistance(homeLocation.lat, homeLocation.lng, coords.lat, coords.lng);

                    // If moved > 200m away from home
                    if (distance > 200) {
                        triggerReminderNotification();
                        setHasNotified(true);
                    } else if (distance < 50) {
                        // Reset if they come back home
                        setHasNotified(false);
                    }
                }
            },
            (error) => {
                console.error(error);
                setPermissionError(error.message);
            },
            { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, [homeLocation, hasNotified]);

    const triggerReminderNotification = () => {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Wait! Lost Item Tracker', {
                body: 'You just left home. Did you forget your important items (Keys, Wallet)?',
                icon: '/favicon.ico' // fallback if exists
            });
        }
    };

    const saveHomeLocation = async () => {
        if (!currentLocation || !currentUser) return false;

        try {
            await setDoc(doc(db, 'users', currentUser.uid), {
                homeLocation: currentLocation
            }, { merge: true });
            setHomeLocation(currentLocation);
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    const value = {
        homeLocation,
        currentLocation,
        permissionError,
        saveHomeLocation,
        loading
    };

    return (
        <LocationContext.Provider value={value}>
            {children}
        </LocationContext.Provider>
    );
}
