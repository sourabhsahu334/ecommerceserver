

const Apifeatures = require("../apiFeatures");
const catchAsyncerror = require("../midelware/catchAsyncerror");
const Products = require("../models/Products");


exports.createProduct= catchAsyncerror(async(req,res,next)=>{
   try {
    req.body.user=req.user.id;
    const prodcut = await Products.create(req.body);
    res.status(201).json({
        success:true,
        prodcut
    });
   } catch (error) {
    res.json({
        success:false,
        message:error.message
    })
   }
});
exports.getproduct=async(req,res,next)=>{
   try {
     const product  = await Products.findById(req.params.id);
     if( !product){
         return res.json({
             success:false,
             message:"product is not found in database"
         })
 
     }
     res.json({
      success:true,
         product
     })
   } catch (err) {
    res.json({
        success:false,
        message:err.message
    })
   }
    
}


exports.getAllproducts=async(req,res,next)=>{
    try {
const resultPerPage= 8;
const productcount = await Products.countDocuments()
        const apiFeature = new Apifeatures(Products.find(),req.query).search().filter().pagination(resultPerPage);
        let products = await apiFeature.query;
        res.json({
            success:true,
            productcount,
            products
        })
    } catch (err) {
        res.json({
            success:false,
            message:err.message
        })
    }
    
}
exports.updateproduct=async(req,res,next)=>{
  try {
      const product = await Products.findById(req.params.id);
      if( !product){
          return res.json({
              success:false,
              message:"product is not found in database"
          })
  
      }
      const data = await Products.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true,
          useFindAndModify:false})
          res.status(201).json({
              success:true,
              data
  
          })
  } catch (err) {
    res.json({
        success:false,
        message:err.message
    })
  }
}
exports.deleteproduct=async(req,res,next)=>{
    try {
        const product = await Products.findById(req.params.id);
        if( !product){
            return res.json({
                success:false,
                message:"product is not found in database"
            })
    
        }
        await product.remove();
            res.status(201).json({
                success:true,
                message:"product is remove"
    
            })
    } catch (err) {
        res.json({
            success:false,
            message:err.message
        })
    }
}


// Create New Review or Update the review
exports.createProductReview = (async (req, res, next) => {
   try {
     const { rating, comment, productId } = req.body;
   
     const review = {
       user: req.user._id,
       name: req.user.name,
       rating: Number(rating),
       comment,
     };
   
     const product = await Products.findById(productId);
   console.log(product)
     const isReviewed = product.reviews.find(
       (rev) => rev.user.toString() === req.user._id.toString()
     );
   
     if (isReviewed) {
       product.reviews.forEach((rev) => {
         if (rev.user.toString() === req.user._id.toString())
           (rev.rating = rating), (rev.comment = comment);
       });
     } else {
       product.reviews.push(review);
       product.numOfReviews = product.reviews.length;
     }
   
     let avg = 0;
   
     product.reviews.forEach((rev) => {
       avg += rev.rating;
     });
   
     product.ratings = avg / product.reviews.length;
   
     await product.save({ validateBeforeSave: false });
   
     res.status(200).json({
       success: true,
     });
   } catch (err) {
    res.json({
        msg:err.message
    })
   }
  });
  
  // Get All Reviews of a product
  exports.getProductReviews = (async (req, res, next) => {
    const product = await Products.findById(req.query.id);
  
    if (!product) {
      return res.json({
        status:404,
        message:"product is not found"
      });
    }
  
    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  });
  
  // Delete Review
  exports.deleteReview = (async (req, res, next) => {
    const product = await Products.findById(req.query.productId);
  
    if (!product) {
      return  res.json({
        status:404,
        message:"product is not found"
      });
    }
  
    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    );
  
    let avg = 0;
  
    reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    let ratings = 0;
  
    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }
  
    const numOfReviews = reviews.length;
  
    await Products.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
  
    res.status(200).json({
      success: true,
    });
  });
  