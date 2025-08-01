import { db } from './firebase-config.js';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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
            // Show loading state
            searchResults.innerHTML = '<div class="loading">Searching donors...</div>';
            
            // Debug: Log the blood type being searched
            console.log(`Searching for blood type: ${bloodType}`);
            
            // Create query
            const donorsRef = collection(db, 'donors');
            const bloodTypeQuery = query(donorsRef, where('bloodType', '==', bloodType));
            
            // Debug: Log the query being executed
            console.log("Firestore query:", bloodTypeQuery);
            
            // Execute query
            const querySnapshot = await getDocs(bloodTypeQuery);
            
            // Debug: Log query results
            console.log(`Found ${querySnapshot.size} matching donors`);
            
            // Clear previous results
            searchResults.innerHTML = '';
            
            if (querySnapshot.empty) {
                searchResults.innerHTML = `
                    <div class="no-results">
                        <p>No donors found with blood type ${bloodType}.</p>
                        <p>Please check back later or register as a donor.</p>
                    </div>
                `;
                return;
            }
            
            // Process and display results
            querySnapshot.forEach(doc => {
                const donor = doc.data();
                console.log("Donor data:", donor); // Debug log
                
                const donorCard = document.createElement('div');
                donorCard.className = 'donor-card';
                donorCard.innerHTML = `
                    <h3>${donor.name || 'Anonymous Donor'}</h3>
                    <p><strong>Blood Type:</strong> ${donor.bloodType || 'Unknown'}</p>
                    <p><strong>Location:</strong> ${donor.location || 'Location not specified'}</p>
                    <p><strong>Contact:</strong> ${donor.phone || 'Contact not provided'}</p>
                    <p><strong>Last Donation:</strong> ${donor.lastDonation || 'Not specified'}</p>
                    ${donor.email ? `<p class="email"><strong>Email:</strong> ${donor.email}</p>` : ''}
                `;
                searchResults.appendChild(donorCard);
            });
            
        } catch (error) {
            console.error('Search error:', error);
            searchResults.innerHTML = `
                <div class="error">
                    <p>Error searching for donors.</p>
                    <p>${error.message}</p>
                    <p>Please try again later.</p>
                </div>
            `;
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

// test animation for pixel stars
