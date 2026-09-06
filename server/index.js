import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

// Initialize Firebase Admin SDK
const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  : undefined;

if (fs.existsSync(serviceAccountPath)) {
  try {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin SDK initialized successfully using local serviceAccountKey.json.');
  } catch (err) {
    console.error('Failed to parse serviceAccountKey.json, falling back to environment:', err.message);
  }
} else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && privateKey) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    })
  });
  console.log('Firebase Admin SDK initialized successfully with environment credentials.');
} else {
  console.warn('WARNING: Environment credentials for Firebase Admin not fully set. Initializing using default/local settings.');
  admin.initializeApp({
    projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'athithi-88d04'
  });
}

const db = admin.firestore();

// Auto-seed Admin Account on startup
const seedSuperAdmin = async () => {
  try {
    const email = 'superadmin@atithisphere.com';
    const password = 'password123';
    
    let userRecord;
    try {
      userRecord = await admin.auth().getUserByEmail(email);
    } catch (authErr) {
      if (authErr.code === 'auth/user-not-found') {
        userRecord = await admin.auth().createUser({
          email,
          password,
          displayName: 'Super Admin'
        });
        console.log('Super Admin user created successfully in Firebase Auth.');
      } else {
        throw authErr;
      }
    }

    const userDocRef = db.collection('users').doc(email);
    const userDoc = await userDocRef.get();
    if (!userDoc.exists) {
      await userDocRef.set({
        uid: userRecord.uid,
        email,
        name: 'Super Admin',
        role: 'Super Admin',
        hotelId: 'all',
        employeeId: 'EMP-SA01',
        phone: '+91 99999 11111'
      });
      console.log('Super Admin user document seeded successfully in Firestore users collection.');
    }
  } catch (err) {
    if (err.message.includes('access token') || err.message.includes('Credential') || err.message.includes('OAuth2')) {
      console.log('Firebase Admin credentials not set/invalid. Skipping boot-time Super Admin seeding.');
    } else {
      console.error('Super Admin seeding failed on backend:', err.message);
    }
  }
};

seedSuperAdmin();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Token verification middleware
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn(`[${new Date().toISOString()}] Unauthorized: Missing/malformed token header on ${req.method} ${req.path}`);
      return res.status(401).json({ error: 'Unauthorized: Missing or malformed token' });
    }
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

// --- AUTH ENDPOINTS ---

// Register Guest or Staff Account
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name, phone, role, hotelId, employeeId } = req.body;
  
  if (!email || !name || !role) {
    return res.status(400).json({ error: 'Missing required parameters: email, name, role' });
  }

  // Security Check: Creating administrative/staff accounts requires authorization
  if (role !== 'Guest') {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: Admin token required for staff creation' });
      }
      const token = authHeader.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);
      
      const requestorDoc = await db.collection('users').doc(decodedToken.email.toLowerCase()).get();
      if (!requestorDoc.exists || !['Super Admin', 'Hotel Owner', 'Manager', 'Front Desk'].includes(requestorDoc.data().role)) {
        return res.status(403).json({ error: 'Forbidden: Insufficient privileges to register staff' });
      }
    } catch (err) {
      console.warn('Staff registration admin token verification failed:', err.message);
      return res.status(401).json({ error: 'Unauthorized: Invalid admin token' });
    }
  }

  try {
    // 1. Create auth user in Firebase Auth using Admin SDK
    const userRecord = await admin.auth().createUser({
      email,
      password: password || 'password123',
      displayName: name
    });

    // 2. Save user metadata document to Firestore users collection
    const userDocRef = db.collection('users').doc(email.toLowerCase());
    const userData = {
      uid: userRecord.uid,
      email: email.toLowerCase(),
      name,
      role,
      hotelId: hotelId || '',
      employeeId: employeeId || 'GUEST',
      phone: phone || '',
      plan: req.body.plan || 'Pro Premium'
    };
    await userDocRef.set(userData);

    // 3. Save to staff collection if it is an operational staff member
    if (role !== 'Guest' && role !== 'Super Admin') {
      const staffId = `staff-${Math.floor(Math.random() * 900) + 100}`;
      const staffData = {
        id: staffId,
        name,
        email: email.toLowerCase(),
        role,
        hotelId: hotelId || '',
        rating: 4.8,
        activeTickets: 0
      };
      await db.collection('staff').doc(staffId).set(staffData);
    }

    res.status(201).json({ success: true, uid: userRecord.uid });
  } catch (err) {
    console.error('Registration failed:', err);
    res.status(500).json({ error: err.message });
  }
});

// Fetch Metadata on login
app.post('/api/auth/login-metadata', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email parameter required' });
  }
  try {
    const docRef = db.collection('users').doc(email.toLowerCase());
    const docSnap = await docRef.get();
    if (docSnap.exists) {
      res.json(docSnap.data());
    } else {
      res.status(404).json({ error: 'User metadata not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- HOTEL ENDPOINTS ---

app.post('/api/hotels', authMiddleware, async (req, res) => {
  const hotel = req.body;
  const hotelId = `hotel-${Math.floor(Math.random() * 900) + 100}`;
  
  try {
    const newHotel = {
      id: hotelId,
      ...hotel,
      rating: 4.5
    };
    await db.collection('hotels').doc(hotelId).set(newHotel);
    res.status(201).json(newHotel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/hotels/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const updatedFields = req.body;
  try {
    await db.collection('hotels').doc(id).update(updatedFields);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/hotels/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    // 1. Delete the hotel property itself
    await db.collection('hotels').doc(id).delete();

    // 2. Fetch and delete all staff of this hotel, along with their users & auth accounts
    const staffQuery = await db.collection('staff').where('hotelId', '==', id).get();
    for (const doc of staffQuery.docs) {
      const staff = doc.data();
      await db.collection('staff').doc(doc.id).delete().catch(() => {});
      
      const staffEmail = staff.email || doc.id;
      if (staffEmail && typeof staffEmail === 'string' && staffEmail.includes('@')) {
        await db.collection('users').doc(staffEmail.toLowerCase()).delete().catch(() => {});
        try {
          const userRecord = await admin.auth().getUserByEmail(staffEmail.toLowerCase());
          await admin.auth().deleteUser(userRecord.uid);
        } catch (authErr) {
          console.warn(`Auth deletion failed for staff ${staffEmail}:`, authErr.message);
        }
      }
    }

    // 3. Fetch and delete any other users linked to this hotel (e.g. Front Desk manager, etc.)
    const usersQuery = await db.collection('users').where('hotelId', '==', id).get();
    for (const doc of usersQuery.docs) {
      const user = doc.data();
      await db.collection('users').doc(doc.id).delete().catch(() => {});
      
      const userEmail = user.email || doc.id;
      if (userEmail && typeof userEmail === 'string' && userEmail.includes('@')) {
        try {
          const userRecord = await admin.auth().getUserByEmail(userEmail.toLowerCase());
          await admin.auth().deleteUser(userRecord.uid);
        } catch (authErr) {
          console.warn(`Auth deletion failed for user ${userEmail}:`, authErr.message);
        }
      }
    }

    // 4. Fetch and delete all bookings linked to this hotel
    const bookingsQuery = await db.collection('bookings').where('hotelId', '==', id).get();
    for (const doc of bookingsQuery.docs) {
      await db.collection('bookings').doc(doc.id).delete().catch(() => {});
    }

    // 5. Fetch and delete all tickets linked to this hotel
    const ticketsQuery = await db.collection('tickets').where('hotelId', '==', id).get();
    for (const doc of ticketsQuery.docs) {
      await db.collection('tickets').doc(doc.id).delete().catch(() => {});
    }

    // 6. Fetch and delete all hotel feedback reviews linked to this hotel
    const feedbackQuery = await db.collection('feedback_hotel').where('hotelId', '==', id).get();
    for (const doc of feedbackQuery.docs) {
      await db.collection('feedback_hotel').doc(doc.id).delete().catch(() => {});
    }

    // 7. Fetch and delete all chats linked to this hotel
    const chatsQuery = await db.collection('chats').where('hotelId', '==', id).get();
    for (const doc of chatsQuery.docs) {
      await db.collection('chats').doc(doc.id).delete().catch(() => {});
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Cascade deletion failed:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- BOOKINGS ENDPOINTS ---

app.post('/api/bookings', authMiddleware, async (req, res) => {
  const booking = req.body;
  const bookingId = booking.id || `BK-${Math.floor(Math.random() * 9000) + 1000}`;
  try {
    const newBooking = {
      id: bookingId,
      ...booking,
      createdTime: new Date().toISOString()
    };
    await db.collection('bookings').doc(bookingId).set(newBooking);
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/bookings/:id/status', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await db.collection('bookings').doc(id).update({ status });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- TICKETS ENDPOINTS ---

app.post('/api/tickets', authMiddleware, async (req, res) => {
  const ticket = req.body;
  const ticketId = `tkt-${Math.floor(Math.random() * 9000) + 1000}`;
  try {
    const newTkt = {
      id: ticketId,
      ...ticket,
      status: 'New',
      slaSecondsLeft: 600,
      createdTime: new Date().toISOString()
    };
    await db.collection('tickets').doc(ticketId).set(newTkt);
    res.status(201).json(newTkt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/tickets/:id/status', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { status: newStatus } = req.body;
  try {
    const docRef = db.collection('tickets').doc(id);
    const docSnap = await docRef.get();
    
    if (!docSnap.exists) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const tkt = docSnap.data();
    let updateFields = { status: newStatus };

    if (newStatus === 'Completed' || newStatus === 'Closed') {
      const elapsed = Math.floor((Date.now() - new Date(tkt.createdTime).getTime()) / 1000);
      updateFields.slaSecondsLeft = Math.max(0, 600 - elapsed);

      // Decrement staff active tickets count
      if (tkt.assignedStaff) {
        const staffQuery = await db.collection('staff').where('name', '==', tkt.assignedStaff).get();
        if (!staffQuery.empty) {
          const staffDoc = staffQuery.docs[0];
          const currentActive = staffDoc.data().activeTickets || 0;
          await staffDoc.ref.update({
            activeTickets: Math.max(0, currentActive - 1)
          });
        }
      }
    }

    await docRef.update(updateFields);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/tickets/:id/assign', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { staffName } = req.body;
  try {
    const docRef = db.collection('tickets').doc(id);
    await docRef.update({
      assignedStaff: staffName,
      status: 'Accepted'
    });

    // Increment staff active tickets count
    const staffQuery = await db.collection('staff').where('name', '==', staffName).get();
    if (!staffQuery.empty) {
      const staffDoc = staffQuery.docs[0];
      const currentActive = staffDoc.data().activeTickets || 0;
      await staffDoc.ref.update({
        activeTickets: currentActive + 1
      });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- CHATS & WHATSAPP ENDPOINTS ---

app.post('/api/chats/messages', async (req, res) => {
  const { guestPhone, text, sender, guestName, hotelId } = req.body;
  if (!guestPhone || !text) {
    return res.status(400).json({ error: 'Missing parameters: guestPhone, text' });
  }

  try {
    const chatDocRef = db.collection('chats').doc(guestPhone);
    const chatDocSnap = await chatDocRef.get();

    const newMessage = {
      id: `m-${Date.now()}`,
      sender: sender || 'bot',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (chatDocSnap.exists) {
      await chatDocRef.update({
        messages: admin.firestore.FieldValue.arrayUnion(newMessage)
      });
    } else {
      await chatDocRef.set({
        guestPhone,
        guestName: guestName || 'Guest User',
        hotelId: hotelId || 'hotel-1',
        messages: [newMessage]
      });
    }

    // Bot Auto-Response Rules & Ticket Creation
    if (sender === 'guest') {
      const textLower = text.toLowerCase();
      let dept = 'Front Desk';
      let priority = 'Medium';

      if (textLower.includes('towel') || textLower.includes('linen') || textLower.includes('clean') || textLower.includes('pillow') || textLower.includes('bedsheet') || textLower.includes('blanket')) {
        dept = 'Housekeeping';
      } else if (textLower.includes('ac') || textLower.includes('light') || textLower.includes('fan') || textLower.includes('leak') || textLower.includes('broken') || textLower.includes('tv') || textLower.includes('plug') || textLower.includes('fuse')) {
        dept = 'Maintenance';
        priority = 'High';
      } else if (textLower.includes('food') || textLower.includes('water') || textLower.includes('bottle') || textLower.includes('drink') || textLower.includes('tea') || textLower.includes('coffee') || textLower.includes('dinner') || textLower.includes('lunch') || textLower.includes('breakfast')) {
        dept = 'Food & Beverage';
      }

      const ticketId = `tkt-${Math.floor(Math.random() * 9000) + 1000}`;
      const newTkt = {
        id: ticketId,
        hotelId: hotelId || 'hotel-1',
        guestName: guestName || 'Guest User',
        guestPhone: guestPhone,
        roomNumber: '305', // Fallback room number
        requestType: text,
        department: dept,
        priority: priority,
        status: 'New',
        slaSecondsLeft: 600,
        createdTime: new Date().toISOString()
      };

      await db.collection('tickets').doc(ticketId).set(newTkt);

      // Simulate WhatsApp auto bot response shortly
      setTimeout(async () => {
        const botResponse = {
          id: `m-${Date.now() + 1}`,
          sender: 'bot',
          text: `Thanks for messaging. We have received your request: "${text}". A ticket (${ticketId}) has been registered under ${dept} and is pending dispatch.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        await chatDocRef.update({
          messages: admin.firestore.FieldValue.arrayUnion(botResponse)
        });
      }, 1000);
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- FEEDBACK ENDPOINTS ---

app.post('/api/feedback/review', authMiddleware, async (req, res) => {
  const review = req.body;
  const reviewId = `rev-${Math.floor(Math.random() * 9000) + 1000}`;
  const dateStr = new Date().toISOString().split('T')[0];
  
  try {
    const newReview = {
      id: reviewId,
      ...review,
      date: dateStr
    };
    await db.collection('feedback_hotel').doc(reviewId).set(newReview);

    // Recompute average rating for that hotel property
    const reviewsQuery = await db.collection('feedback_hotel').where('hotelId', '==', review.hotelId).get();
    const reviews = reviewsQuery.docs.map(d => d.data());
    
    if (!reviews.some(r => r.id === reviewId)) {
      reviews.push(newReview);
    }
    
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = parseFloat((sum / reviews.length).toFixed(1));
    
    await db.collection('hotels').doc(review.hotelId).update({
      rating: avg
    });

    res.status(201).json({ success: true });
  } catch (err) {
    console.error('Failed to submit hotel review:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/feedback/app', authMiddleware, async (req, res) => {
  const feedback = req.body;
  const feedbackId = `app-${Math.floor(Math.random() * 9000) + 1000}`;
  const dateStr = new Date().toISOString().split('T')[0];
  
  try {
    const newItem = {
      id: feedbackId,
      ...feedback,
      status: 'Open',
      date: dateStr
    };
    await db.collection('feedback_app').doc(feedbackId).set(newItem);
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/feedback/app/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await db.collection('feedback_app').doc(id).update({ status });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- OWNER & USER DELETION ENDPOINTS ---

const removeOwnerHandler = async (req, res) => {
  const emailParam = req.query.email || req.params.email;
  if (!emailParam) {
    return res.status(400).json({ error: 'Email parameter required' });
  }

  const cleanEmail = emailParam.toLowerCase();

  try {
    // 1. Delete from users collection
    await db.collection('users').doc(cleanEmail).delete().catch(() => {});

    // Also search users where email equals cleanEmail
    const userQuery = await db.collection('users').where('email', '==', cleanEmail).get();
    for (const doc of userQuery.docs) {
      await db.collection('users').doc(doc.id).delete().catch(() => {});
    }

    // 2. Delete from staff collection if staff doc exists
    const staffQuery = await db.collection('staff').where('email', '==', cleanEmail).get();
    for (const doc of staffQuery.docs) {
      await db.collection('staff').doc(doc.id).delete().catch(() => {});
    }

    // 3. Delete Firebase Auth user account
    try {
      const userRecord = await admin.auth().getUserByEmail(cleanEmail);
      await admin.auth().deleteUser(userRecord.uid);
      console.log(`Auth user ${cleanEmail} deleted successfully.`);
    } catch (authErr) {
      console.warn(`Auth user deletion skipped for ${cleanEmail}:`, authErr.message);
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Failed to remove owner/user:', err);
    res.status(500).json({ error: err.message });
  }
};

app.delete('/api/staff/owner', authMiddleware, removeOwnerHandler);
app.delete('/api/owners/:email', authMiddleware, removeOwnerHandler);
app.delete('/api/users/:email', authMiddleware, removeOwnerHandler);

// --- STAFF ROSTER ACTIONS ---

app.delete('/api/staff/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { email } = req.query;
  try {
    let staffEmail = email;

    // Fetch staff doc first to find email if missing
    const staffDocRef = db.collection('staff').doc(id);
    const staffSnap = await staffDocRef.get();
    if (staffSnap.exists) {
      const data = staffSnap.data();
      if (!staffEmail && data.email) {
        staffEmail = data.email;
      }
    }
    await staffDocRef.delete().catch(() => {});

    if (staffEmail) {
      const cleanEmail = staffEmail.toLowerCase();
      await db.collection('users').doc(cleanEmail).delete().catch(() => {});

      const userQuery = await db.collection('users').where('email', '==', cleanEmail).get();
      for (const doc of userQuery.docs) {
        await db.collection('users').doc(doc.id).delete().catch(() => {});
      }

      try {
        const userRecord = await admin.auth().getUserByEmail(cleanEmail);
        await admin.auth().deleteUser(userRecord.uid);
      } catch (authErr) {
        console.warn('Auth credential deletion skipped:', authErr.message);
      }
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to remove staff member:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- TICKET & BOOKING DELETIONS ---

app.delete('/api/tickets/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    await db.collection('tickets').doc(id).delete();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/bookings/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    await db.collection('bookings').doc(id).delete();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start listening for API requests on defined port
app.listen(PORT, () => {
  console.log(`AtithiSphere Express backend server running on http://localhost:${PORT}`);
});
