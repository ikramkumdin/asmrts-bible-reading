import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Initialize Firebase Admin
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './serviceAccountKey.json';

try {
  const serviceAccount = require(path.resolve(process.cwd(), serviceAccountPath));
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log('✅ Firebase Admin initialized');
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin:', error);
  process.exit(1);
}

const db = admin.firestore();

async function verifyProUser(email: string) {
  try {
    console.log(`\n🔍 Searching for user: ${email}`);
    
    // Find user by email
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();
    
    if (snapshot.empty) {
      console.log('❌ No user found with that email');
      return;
    }
    
    console.log(`✅ Found ${snapshot.size} user document(s)\n`);
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`📄 Document ID: ${doc.id}`);
      console.log(`   Email: ${data.email}`);
      console.log(`   UID: ${data.uid}`);
      console.log(`   isPremium: ${data.isPremium} (${typeof data.isPremium})`);
      console.log(`   isPro: ${data.isPro} (${typeof data.isPro})`);
      console.log(`   proSubscriptionEnd: ${data.proSubscriptionEnd}`);
      console.log(`   tokenCount: ${data.tokenCount}`);
      console.log(`   All fields:`, Object.keys(data).join(', '));
      console.log('');
      
      // Check Pro status
      if (data.isPro === true) {
        console.log('✅ User IS Pro!');
        
        // Check subscription end date
        if (data.proSubscriptionEnd) {
          const endDate = new Date(data.proSubscriptionEnd);
          const now = new Date();
          const isExpired = endDate < now;
          
          console.log(`   Subscription end: ${endDate.toISOString()}`);
          console.log(`   Status: ${isExpired ? '❌ EXPIRED' : '✅ ACTIVE'}`);
          
          if (!isExpired) {
            const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            console.log(`   Days remaining: ${daysLeft}`);
          }
        } else {
          console.log('   ⚠️  No subscription end date set');
        }
      } else {
        console.log('❌ User is NOT Pro');
        console.log('   Run setUserPro.ts to make them Pro');
      }
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.error('❌ Please provide an email address');
  console.log('Usage: npx tsx scripts/verifyProUser.ts <email>');
  process.exit(1);
}

verifyProUser(email);

