// config/superAdminSeeder.js
import User from '../models/userModel.js';

const createSuperAdmin = async () => {
  try {
    const email = 'superadmin@example.com';
    const password = 'password';

    // Delete old super admin
    await User.deleteOne({ email });

    // Create new one with required fields
    const superAdmin = await User.create({
      name: 'Super Admin',
      email,
      password,
      role: 'superadmin',
      phone: '0000000000',       // dummy phone
      designation: 'Super Admin' // required designation
    });

    console.log(`✅ Super admin created: ${superAdmin.email}`);
  } catch (error) {
    console.error(`❌ Error creating super admin: ${error.message}`);
  }
};

export default createSuperAdmin;
