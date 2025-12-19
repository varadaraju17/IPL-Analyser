const fs = require('fs');
const players = require('./src/data/players.json');

// AUCTION PRICES MAP (User Provided)
// Normalize keys to lowercase for robust matching
const auctionPrices = {
    // CSK
    "Kartik Sharma": "₹14,20,00,000",
    "Prashant Veer": "₹14,20,00,000",
    "Rahul Chahar": "₹5,20,00,000",
    "Matt Henry": "₹2,00,00,000",
    "Akeal Hosein": "₹2,00,00,000",
    "Matthew Short": "₹1,50,00,000",
    "Zakary Foulkes": "₹75,00,000", // "Zak Foulkes" in input, mapped to squad name
    "Zak Foulkes": "₹75,00,000",
    "Sarfaraz Khan": "₹75,00,000",
    "Aman Khan": "₹40,00,000",
    // DC
    "Auqib Dar": "₹8,40,00,000", // Mapped to Auqib Nabi if needed, or squad name needs check
    "Auqib Nabi": "₹8,40,00,000", // User said Auqib Dar, squad has Auqib Nabi? Check.
    "Pathum Nissanka": "₹4,00,00,000",
    "Kyle Jamieson": "₹2,00,00,000",
    "Lungisani Ngidi": "₹2,00,00,000",
    "Lungi Ngidi": "₹2,00,00,000",
    "Ben Duckett": "₹2,00,00,000",
    "David Miller": "₹2,00,00,000",
    "Prithvi Shaw": "₹75,00,000",
    "Sahil Parakh": "₹30,00,000",
    // GT
    "Jason Holder": "₹7,00,00,000",
    "Tom Banton": "₹2,00,00,000",
    "Ashok Sharma": "₹90,00,000",
    "Luke Wood": "₹75,00,000",
    "Prithviraj Yarra": "₹30,00,000",
    "Prithvi Raj": "₹30,00,000", // Squad name variation
    // KKR
    "Cameron Green": "₹25,20,00,000",
    "Matheesha Pathirana": "₹18,00,00,000",
    "Mustafizur Rahman": "₹9,20,00,000",
    "Tejasvi Singh": "₹3,00,00,000", // Squad has "Tejasvi Dahiya"? or "Tejasvi Singh"?
    "Tejasvi Dahiya": "₹3,00,00,000",
    "Rachin Ravindra": "₹2,00,00,000",
    "Finn Allen": "₹2,00,00,000",
    "Tim Seifert": "₹1,50,00,000",
    "Akash Deep": "₹1,00,00,000",
    "Rahul Tripathi": "₹75,00,000",
    "Daksh Kamra": "₹30,00,000",
    "Sarthak Ranjan": "₹30,00,000",
    "Prashant Solanki": "₹30,00,000",
    "Kartik Tyagi": "₹30,00,000",
    // LSG
    "Josh Inglis": "₹8,60,00,000",
    "Mukul Choudhary": "₹2,60,00,000",
    "Akshat Raghuwanshi": "₹2,20,00,000",
    "Anrich Nortje": "₹2,00,00,000",
    "Wanindu Hasaranga": "₹2,00,00,000",
    "Naman Tiwari": "₹1,00,00,000",
    // MI
    "Quinton De Kock": "₹1,00,00,000",
    "Quinton de Kock": "₹1,00,00,000",
    "Mayank Rawat": "₹30,00,000",
    "Atharva Ankolekar": "₹30,00,000",
    "Mohammad Izhar": "₹30,00,000",
    "Mohd Izhar": "₹30,00,000",
    "Danish Malewar": "₹30,00,000",
    // PBKS
    "Ben Dwarshuis": "₹4,40,00,000",
    "Cooper Connolly": "₹3,00,00,000",
    "Vishal Nishad": "₹30,00,000",
    "Pravin Dubey": "₹30,00,000",
    "Praveen Dubey": "₹30,00,000",
    // RR
    "Ravi Bishnoi": "₹7,20,00,000",
    "Adam Milne": "₹2,40,00,000",
    "Ravi Singh": "₹95,00,000",
    "Sushant Mishra": "₹90,00,000",
    "Kuldeep Sen": "₹75,00,000",
    "Brijesh Sharma": "₹30,00,000",
    "Aman Rao Perala": "₹30,00,000",
    "Aman Rao": "₹30,00,000",
    "Vignesh Puthur": "₹30,00,000",
    "Yash Raj Punja": "₹30,00,000",
    // RCB
    "Venkatesh Iyer": "₹7,00,00,000",
    "Mangesh Yadav": "₹5,20,00,000",
    "Jacob Duffy": "₹2,00,00,000",
    "Jordan Cox": "₹75,00,000",
    "Kanishk Chouhan": "₹30,00,000",
    "Vihaan Malhotra": "₹30,00,000",
    "Vicky Ostwal": "₹30,00,000",
    "Satvik Deswal": "₹30,00,000",
    // SRH
    "Liam Livingstone": "₹13,00,00,000",
    "Jack Edwards": "₹3,00,00,000",
    "Salil Arora": "₹1,50,00,000",
    "Shivam Mavi": "₹75,00,000",
    "Krains Fuletra": "₹30,00,000",
    "Praful Hinge": "₹30,00,000",
    "Amit Kumar": "₹30,00,000",
    "Onkar Tarmale": "₹30,00,000",
    "Sakib Hussain": "₹30,00,000",
    "Shivang Kumar": "₹30,00,000"
};

// Normalize string for comparison
const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

const updatedPlayers = players.map(p => {
    // Try exact match first
    let price = auctionPrices[p.name];

    // If no exact match, try normalized match
    if (!price) {
        const pNameNorm = normalize(p.name);
        for (const [key, val] of Object.entries(auctionPrices)) {
            if (normalize(key) === pNameNorm) {
                price = val;
                break;
            }
        }
    }

    return {
        ...p,
        price: price || "Retained"
    };
});

fs.writeFileSync('src/data/players.json', JSON.stringify(updatedPlayers, null, 2));
console.log(`Updated ${updatedPlayers.length} players with Auction Prices/Retained status.`);
