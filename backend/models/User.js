const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false  // Don't return password in queries by default
  },
  avatar: {
    type: String,
    default: 'https://ui-avatars.com/api/?background=667eea&color=fff&name='
  },
  preferences: {
    darkMode: {
      type: Boolean,
      default: false
    },
    defaultCategory: {
      type: String,
      default: 'Personal'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function() {
  // Only hash if password is modified
  if (!this.isModified('password')) return 
  
  // Generate salt and hash password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update avatar URL with user's name
userSchema.pre('save', function() {
  if (this.isModified('name')) {
    this.avatar = `https://ui-avatars.com/api/?background=667eea&color=fff&name=${encodeURIComponent(this.name)}`;
  }
});

module.exports = mongoose.model('User', userSchema);