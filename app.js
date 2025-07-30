 import { db } from './firebase-config.js';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ... rest of your existing app.js code ...
 
import { db } from './firebase-config.js';

import { collection, query, where, getDocs, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const bloodTypeSearch = document.getElementById('bloodTypeSearch');
    const searchBtn = document.getElementById('searchBtn');
    const searchResults = document.getElementById('searchResults');
    const donorForm = document.getElementById('donorForm');
    
    // Search for donors
    searchBtn.addEventListener('click', searchDonors);
    
    // Register new donor
    donorForm.addEventListener('submit', registerDonor);
    
    // Function to search donors by blood type
    async function searchDonors() {
        const bloodType = bloodTypeSearch.value;
        
        if (!bloodType) {
            alert('Please select a blood type');
            return;
        }
        
        try {
            // Query Firestore for donors with matching blood type
            const q = query(collection(db, 'donors'), where('bloodType', '==', bloodType));
            const querySnapshot = await getDocs(q);
            
            searchResults.innerHTML = '';
            
            if (querySnapshot.empty) {
                searchResults.innerHTML = '<p>No donors found with this blood type.</p>';
                return;
            }
            
            querySnapshot.forEach(doc => {
                const donor = doc.data();
                const donorCard = document.createElement('div');
                donorCard.className = 'donor-card';
                donorCard.innerHTML = `
                    <h3>${donor.name}</h3>
                    <p><strong>Blood Type:</strong> ${donor.bloodType}</p>
                    <p><strong>Location:</strong> ${donor.location}</p>
                    <p><strong>Phone:</strong> ${donor.phone}</p>
                    <p><strong>Last Donation:</strong> ${donor.lastDonation || 'Not specified'}</p>
                `;
                searchResults.appendChild(donorCard);
            });
        } catch (error) {
            console.error('Error searching donors:', error);
            searchResults.innerHTML = '<p>Error searching for donors. Please try again.</p>';
        }
    }
    
    // Function to register a new donor
    async function registerDonor(e) {
        e.preventDefault();
        
        const name = document.getElementById('donorName').value.trim();
        const email = document.getElementById('donorEmail').value.trim();
        const phone = document.getElementById('donorPhone').value.trim();
        const bloodType = document.getElementById('donorBloodType').value;
        const location = document.getElementById('donorLocation').value.trim();
        const lastDonation = document.getElementById('lastDonation').value;
        
        if (!name || !email || !phone || !bloodType || !location) {
            alert('Please fill in all required fields');
            return;
        }
        
        try {
            // Add donor to Firestore
            await addDoc(collection(db, 'donors'), {
                name,
                email,
                phone,
                bloodType,
                location,
                lastDonation: lastDonation || 'Not specified',
                registeredAt: serverTimestamp()
            });
            
            alert('Thank you for registering as a blood donor!');
            donorForm.reset();
        } catch (error) {
            console.error('Error registering donor:', error);
            alert(`Error registering: ${error.message}`);
        }
    }
});