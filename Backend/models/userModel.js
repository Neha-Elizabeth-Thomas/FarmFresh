import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import crypto from 'crypto'

const addrSchema=new mongoose.Schema({
    house:String,
    street:String,
    city:String,
    postOffice:String,
    district:String,
    country:{
        type:String,
        default:'India'
    },
    isDefault:{
        type:Boolean,
        default:false
    },
    landmark:String
},{_id:false})


const sellerProfileSchema = new mongoose.Schema({
  storeName: {
    type: String,
    required: true
  },

  storeDescription: {
    type: String,
    required: true
  },

  storeLogo: {
    type: String // URL (optional)
  },

  address: addrSchema,

  deliveryAreas: [String], // List of pin codes or area names

  gstNumber: {
    type: String,
    required: true
  },

  govIDProofURL: {
    type: String, // Cloudinary URL of uploaded ID proof
    required: true
  },

  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    upiId: String
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  verifiedAt: {
    type: Date
  },
}, { _id: false });

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
}, { _id: false });

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    phone:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,    
        required:true
    },
    deliveryAddress:[addrSchema],
    role: {
    type: String,
    default: 'buyer'
    },
  cart: [cartItemSchema],
  sellerProfile: sellerProfileSchema,
  
    // Fields for password reset
  passwordResetToken: String,
  passwordResetExpires: Date,
},{timestamps:true})

userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();

    try{
        const salt=await bcrypt.genSalt(10);
        this.password=await bcrypt.hash(this.password,salt);
        next();
    }catch(err){
        next(err);
    }
})

userSchema.methods.matchPassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}

userSchema.methods.getResetPasswordToken = function() {
    // Generate a random 32-byte token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash the token and set it to the passwordResetToken field
    // We save the HASHED token to the DB for security
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set an expiration time (e.g., 15 minutes from now)
    this.passwordResetExpires = Date.now() + 15 * 60 * 1000;

    // Return the UNHASHED token to be sent via email
    return resetToken;
};

const User=mongoose.model('User',userSchema);
export default User;