import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const users = [
  { username: "rival", name: "Rival Abdul Jabar", role: "super_admin" },
  { username: "surya", name: "Surya Wagito", role: "admin" },
  { username: "yudho", name: "Herra Yudho Kartiko", role: "admin" },
  { username: "josepa", name: "Josepa Sitanggang", role: "admin" },
  { username: "tifah", name: "Nurlatifah Khoirun Nissa", role: "admin" },
  { username: "uswar", name: "Uswar M. Al-Ghifari", role: "admin" },
  { username: "mita", name: "Mita Septiyandari", role: "admin" },
  { username: "fatmi", name: "Fatonah Amini", role: "admin" },
  { username: "herman", name: "Herman Cristhoper Silaban", role: "admin" },
  { username: "selvira", name: "Selvira Kurni Anty", role: "user" },
  { username: "wawan", name: "Purwanto", role: "user" },
  { username: "yani", name: "Ahmad Yani", role: "user" },
  { username: "danu", name: "Danu Abdi Saputra", role: "user" },
  { username: "anggi", name: "Anggiany Muthia Safitri", role: "user" },
  { username: "bintang", name: "Ahmad Bintang Fais Adhibi", role: "user" },
  { username: "amanda", name: "Amanda Putri Az-zahrah", role: "user" },
  { username: "teungku", name: "Teungku Muhammad Sidiq", role: "user" },
  { username: "kautsar", name: "Kautsar Hilmi Izudin", role: "user" },
  { username: "vera", name: "Vera Mirnawati", role: "user" },
  { username: "riki", name: "Riki Aranda", role: "user" },
  { username: "guspita", name: "Guspita Karleni", role: "user" },
];

async function debugImport() {
  console.log('🔍 Debugging Firestore import...');
  console.log('Using project:', firebaseConfig.projectId);

  // Test dengan satu user dulu
  const testUser = users[0];
  
  try {
    console.log('Testing with user:', testUser.username);
    
    // Data yang sangat sederhana
    const testData = {
      name: testUser.name,
      role: testUser.role,
      email: `${testUser.username}@bps.go.id`,
      createdAt: new Date().toISOString(), // Gunakan string instead of Date object
      isActive: true
    };

    console.log('Data to be saved:', JSON.stringify(testData, null, 2));

    // Coba dengan document ID yang simple
    const docRef = doc(db, 'test_users', 'simple_test');
    
    await setDoc(docRef, testData);
    console.log('✅ Simple test successful!');

    // Sekarang coba dengan actual user data
    console.log('Now trying with actual user data...');
    
    const userDocRef = doc(db, 'users', testUser.username);
    const userData = {
      username: testUser.username,
      name: testUser.name,
      role: testUser.role,
      email: `${testUser.username}@bps.go.id`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
      lastLogin: null
    };

    console.log('User data:', JSON.stringify(userData, null, 2));
    
    await setDoc(userDocRef, userData);
    console.log('✅ User test successful!');

  } catch (error: any) {
    console.error('❌ Debug error:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.details) {
      console.error('Error details:', error.details);
    }
  }
}

debugImport().catch(console.error);