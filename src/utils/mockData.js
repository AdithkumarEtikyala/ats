// AtithiSphere Mock Database - Preloaded with 1 default property for instant demo usage

export const MOCK_HOTELS = [
  { id: "hotel-1", name: "Grand Palace Hotel & Spa", city: "Mumbai", rooms: 120, rating: 4.8, restaurantName: "Atithi Dining Hall" },
  { id: "hotel-2", name: "Goa Retreat & Beach Club", city: "Goa", rooms: 80, rating: 4.6, restaurantName: "Shack Grill" },
  { id: "hotel-3", name: "Delhi Heights Business Hotel", city: "Delhi", rooms: 150, rating: 4.5, restaurantName: "Skyline Cafe" }
];

export const MOCK_STAFF = [
  { id: "staff-1", name: "Amit Sharma", role: "Front Desk", hotelId: "hotel-1", rating: 4.9, activeTickets: 0 },
  { id: "staff-2", name: "Priya Patel", role: "Housekeeping", hotelId: "hotel-1", rating: 4.8, activeTickets: 1 },
  { id: "staff-3", name: "Rajesh Kumar", role: "Maintenance", hotelId: "hotel-1", rating: 4.7, activeTickets: 1 }
];

export const MOCK_BOOKINGS = [
  {
    id: "bk-1001",
    hotelId: "hotel-1",
    guestName: "Arjun Mehta",
    guestPhone: "+91 98765 43210",
    restaurantName: "Atithi Dining Hall",
    roomNumber: "305",
    roomType: "Deluxe Suite",
    checkIn: "2026-07-04",
    checkOut: "2026-07-08",
    status: "checked-in",
    amount: 18000
  }
];

export const MOCK_TICKETS = [
  {
    id: "tkt-2001",
    hotelId: "hotel-1",
    bookingId: "bk-1001",
    guestName: "Arjun Mehta",
    roomNumber: "305",
    requestType: "Extra Towels",
    department: "Housekeeping",
    priority: "High",
    assignedStaff: "Priya Patel",
    status: "In Progress",
    slaSecondsLeft: 240,
    createdTime: new Date(Date.now() - 6 * 60000).toISOString()
  },
  {
    id: "tkt-2002",
    hotelId: "hotel-1",
    bookingId: "bk-1001",
    guestName: "Arjun Mehta",
    roomNumber: "305",
    requestType: "AC Leaking Water",
    department: "Maintenance",
    priority: "Urgent",
    assignedStaff: "Rajesh Kumar",
    status: "New",
    slaSecondsLeft: 480,
    createdTime: new Date(Date.now() - 2 * 60000).toISOString()
  }
];

export const MOCK_CHAT_SESSIONS = [
  {
    guestPhone: "+91 98765 43210",
    guestName: "Arjun Mehta",
    hotelId: "hotel-1",
    messages: [
      { id: "m-1", sender: "guest", text: "Hello, I just checked into Room 305.", time: "14:02" },
      { id: "m-2", sender: "bot", text: "Welcome Arjun Mehta! I am your Grand Palace virtual concierge. How may I help you today?\n\n1. Request Towels\n2. Order Room Service\n3. Front Desk Call", time: "14:03" },
      { id: "m-3", sender: "guest", text: "Can you send 2 fresh towels to my room?", time: "14:05" },
      { id: "m-4", sender: "bot", text: "Certainly! I have generated ticket tkt-2001 for Housekeeping. Priya Patel will deliver them in 5 minutes.", time: "14:06" }
    ]
  }
];

export const MOCK_ANALYTICS = {
  complianceRate: 94.2,
  avgResponseSeconds: 182,
  deptCompliance: [
    { name: "Front Desk", compliance: 98 },
    { name: "Housekeeping", compliance: 95 },
    { name: "Maintenance", compliance: 89 },
    { name: "Food & Beverage", compliance: 94 }
  ],
  requestBreakdown: [
    { name: "Towels/Linen", count: 184 },
    { name: "Water Bottles", count: 250 },
    { name: "Room Service F&B", count: 110 }
  ]
};
