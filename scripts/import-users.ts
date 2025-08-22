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

async function fixImport() {
  try {
    console.log('🛠️  Starting fixed import...');
    
    for (const user of users) {
      try {
        // **FIX: Gunakan data yang sangat sederhana dulu**
        const userData = {
          username: user.username,
          name: user.name,
          role: user.role,
          email: `${user.username}@bps.go.id`,
          // **FIX: Hindari Date objects, gunakan string atau timestamp**
          createdAt: new Date().toISOString(),
          isActive: true
        };

        // **FIX: Pastikan document ID valid**
        const docId = user.username.toLowerCase().replace(/[^a-z0-9_-]/g, '');
        
        console.log(`Importing: ${docId}`);
        
        // **FIX: Gunakan collection yang berbeda untuk test**
        await setDoc(doc(db, 'temp_users', docId), userData);
        
        console.log(`✅ Success: ${user.username}`);
        
      } catch (userError: any) {
        console.error(`❌ Error with ${user.username}:`, userError.message);
        continue;
      }

      await new Promise(resolve => setTimeout(resolve, 50));
    }

    console.log('🎉 Fixed import completed!');

  } catch (error: any) {
    console.error('❌ Critical error:', error.message);
  }
}

fixImport().catch(console.error);