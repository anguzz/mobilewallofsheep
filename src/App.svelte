<script>
    import { onMount } from 'svelte';
    import { db } from './firebase';
    import { 
        collection, 
        addDoc, 
        onSnapshot, 
        query, 
        orderBy, 
        serverTimestamp 
    } from 'firebase/firestore';
  
    let devices = [];
  
    onMount(() => {
        const deviceInfo = {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            languages: navigator.languages,
            online: navigator.onLine,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            colorDepth: window.screen.colorDepth,
            pixelDepth: window.screen.pixelDepth,
            devicePixelRatio: window.devicePixelRatio,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            hardwareConcurrency: navigator.hardwareConcurrency,
            maxTouchPoints: navigator.maxTouchPoints,
            cookieEnabled: navigator.cookieEnabled,
            javaEnabled: navigator.javaEnabled ? navigator.javaEnabled() : false,
            doNotTrack: navigator.doNotTrack,
            timestamp: serverTimestamp(),
        };
  
        // Request geolocation data with permission
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                deviceInfo.latitude = position.coords.latitude;
                deviceInfo.longitude = position.coords.longitude;
                saveDeviceInfo(deviceInfo);
            }, error => {
                console.error("Geolocation error: ", error);
                // Save without geolocation data
                saveDeviceInfo({ ...deviceInfo, latitude: 'N/A', longitude: 'N/A' });
            });
        } else {
            saveDeviceInfo({ ...deviceInfo, latitude: 'N/A', longitude: 'N/A' });
        }
  
        const devicesCollection = collection(db, "Devices");
        const devicesQuery = query(devicesCollection, orderBy('timestamp', 'desc'));
  
        onSnapshot(devicesQuery, snapshot => {
            devices = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        });
    });
  
    function saveDeviceInfo(info) {
        const devicesCollection = collection(db, "Devices");
        addDoc(devicesCollection, info)
            .then(docRef => console.log("Document written with ID: ", docRef.id))
            .catch(error => console.error("Error adding document: ", error));
    }
  
    function formatTimestamp(timestamp) {
        if (timestamp && timestamp.toDate) {
            return timestamp.toDate().toLocaleString();
        }
        return 'N/A';
    }
</script>



<main>
    <h1>Mobile Wall of Sheep</h1>
    <ul>
        {#each devices as device}
        <li>
            <strong>Timestamp:</strong> {formatTimestamp(device.timestamp)}<br>
            <strong>User Agent:</strong> {device.userAgent}<br>
            <strong>Platform:</strong> {device.platform}<br>
            <strong>Language:</strong> {device.language}<br>
            <strong>Languages:</strong> {device.languages.join(', ')}<br>
            <strong>Time Zone:</strong> {device.timeZone}<br>
            <strong>Online:</strong> {device.online ? 'Yes' : 'No'}<br>
            <strong>Screen Resolution:</strong> {device.screenWidth} x {device.screenHeight}<br>
            <strong>Color Depth:</strong> {device.colorDepth} bits<br>
            <strong>Pixel Depth:</strong> {device.pixelDepth} bits<br>
            <strong>Device Pixel Ratio:</strong> {device.devicePixelRatio}<br>
            <strong>Hardware Concurrency:</strong> {device.hardwareConcurrency} cores<br>
            <strong>Max Touch Points:</strong> {device.maxTouchPoints}<br>
            <strong>Cookies Enabled:</strong> {device.cookieEnabled ? 'Yes' : 'No'}<br>
            <strong>Java Enabled:</strong> {device.javaEnabled ? 'Yes' : 'No'}<br>
            <strong>Do Not Track:</strong> {device.doNotTrack === '1' ? 'Yes' : 'No'}<br>
            {#if device.latitude && device.longitude}
                <strong>Latitude:</strong> {device.latitude}<br>
                <strong>Longitude:</strong> {device.longitude}<br>
            {/if}
        </li>
        {/each}
    </ul>
</main>
