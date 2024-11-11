<!-- App.svelte -->
<script>
	import { onMount } from 'svelte';
	import { db } from './firebase';
	import { collection, addDoc, onSnapshot } from 'firebase/firestore';
  
	let devices = [];
  
	onMount(() => {
	  const deviceInfo = {
		userAgent: navigator.userAgent,
		platform: navigator.platform,
		language: navigator.language,
		online: navigator.onLine,
		screenWidth: window.screen.width,
		screenHeight: window.screen.height,
		colorDepth: window.screen.colorDepth,
		timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
	  };
  
	  // Get geolocation data and save device info
	  navigator.geolocation.getCurrentPosition(position => {
		deviceInfo.latitude = position.coords.latitude;
		deviceInfo.longitude = position.coords.longitude;
		saveDeviceInfo(deviceInfo);
	  }, error => {
		console.error("Geolocation error: ", error);
		saveDeviceInfo(deviceInfo); // Save without geolocation data
	  });
  
	  const devicesCollection = collection(db, "Devices");
  
	  // Fetch all device data from Firestore
	  onSnapshot(devicesCollection, snapshot => {
		devices = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
	  });
	});
  
	function saveDeviceInfo(info) {
	  const devicesCollection = collection(db, "Devices");
	  addDoc(devicesCollection, info)
		.then(docRef => console.log("Document written with ID: ", docRef.id))
		.catch(error => console.error("Error adding document: ", error));
	}
  </script>
  
  
  <main>
	<h1>Mobile wall of sheep</h1>
	
	<ul>
	  {#each devices as device}
		<li>{device.userAgent} - {device.platform} - {device.language} - {device.timeZone} - {device.screenWidth}x{device.screenHeight}</li>
	  {/each}
	</ul>
  </main>
  