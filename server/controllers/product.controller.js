import ProductModel from "../models/product.model.js";

export const createProductController=async(req,res)=>{
    try {
        const {
            name,
            image,
            category,
            subcategory,
            unit,
            stock,
            price,
            discount,
            description,
            more_details}=req.body

            if(!name ||!image[0]||!category||!subcategory[0]||!unit || !price || !description){
                return res.status(400).json({
                    message:"Enter required fields",
                    error:true,
                    success:false
                })
            }
        const product=new ProductModel({
            name,
            image,
            category,
            subcategory,
            unit,
            stock,
            price,
            discount,
            description,
            more_details
             })
        const saveProduct=await product.save()
        return res.json({
            message:" Product Create Successfully",
            data:saveProduct,
            error:false,
            success:true
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message|| error,
            error:true,
            success:false
        })
        
    }
}

export const getProductController=async(req,res)=>{

    try {
        let {page,limit,search}=req.body

        if(!page){
            page=1
        }
        if(!limit){
            limit=12
        }
        let query=search?{
            $text:{
                $search:search
            }

        }:{}
        const skip=(page-1)*limit

        const [data,totalCount]=await Promise.all([
            ProductModel.find(query).sort({createdAt: -1}).skip(skip).limit(limit).populate('category subcategory'),
            ProductModel.countDocuments(query)
        ])

        return res.json({
            message:" product Data",
            error:false,
            success:true,
            totalCount:totalCount,
            totalNopage:Math.ceil(totalCount/limit),
            data:data
        })
        
    } catch (error) {
        return res.status(500).json({
            message:error.message || error,
            error:true,
            success:false
        })
    }

}

export const getProductByCategory=async(req,res)=>{
    try {
     const {id }=req.body
     if(!id){
        return res.status(400).json({
            message:"provide category id",
            error:true,
            success:false
        })
     }
     const product=await ProductModel.find({
        category:{$in :id}
     }).limit(15)

     return res.json({
        message:"category product list",
        data:product,
        error:false,
        success:true
     }) 
        
    } catch (error) {
       return res.status(500).json({
            message: error.message || error,
            error:true,
            success:false
        })
    }
}

export const getProductByCategoryAndSubcategory = async (req, res) => {
    try {
      let { categoryId, subcategoryId, page, limit } = req.body;

      // Validation
      if (!categoryId || !subcategoryId) {
        return res.status(400).json({
          message: "Provide categoryId and subcategoryId",
          error: true,
          success: false,
        });
      }
  
      // Fallback defaults
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;
  
      const skip = (page - 1) * limit;
  
      const query = {
        category: { $in: [categoryId] },
        subcategory: { $in: [subcategoryId] },
      };
  
      const [data, dataCount] = await Promise.all([
        ProductModel.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        ProductModel.countDocuments(query),
      ]);
  
      return res.json({
        message: "Product list",
        data,
        totalCount: dataCount,
        page,
        limit,
        error: false,
        success: true,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message || error,
        error: true,
        success: false,
      });
    }
  };

export const getProductDetails = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
        success: false,
        error: true,
      });
    }

    
    const product = await ProductModel.findOne({_id: productId});

    
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
        error: true,
      });
    }

    return res.json({
      message: "Product details fetched successfully",
      data: product,
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

export const updateProductDetails=async(req,res)=>{
  try {
    const {_id}=req.body;
    if(!_id){
      return res.status(400).json({
        message:"provide product _id ",
        error:true,
        success:false
      })
    }

    const updateProduct=await ProductModel.updateOne({_id:_id},{
      ...req.body
    })
    return res.status(200).json({
        message:"Update Successfully",
        error:false,
        success:true,
        data:updateProduct
    })
    
  } catch (error) {
    return res.status(500).json({
      message:error.message|| error,
      error:true,
      success:false
    })
  }
}

export const deleteProductDetails= async (req,res)=>{
  try {
     const {_id}=req.body;
     if(!_id){
      return res.status(400).json({
        message:"provide ID",
        error:true,
        success:false
      })
     }
  const deleteProduct= await ProductModel.deleteOne({_id:_id})
    return res.json({
      message:"Delete Successfully",
      error:false,
      success:true,
      data:deleteProduct

    })
  
    
  } catch (error) {

    return res.status(500).json({
      message:error.message || error,
      error:true,
      success:false
    })
    
  }
}
 
//search Product

export const searchProduct = async (req, res) => {
  try {
    let { search = "", page = 1, limit = 20 } = req.body;

    page = Number(page);
    limit = Number(limit);

    const query = search
      ? {
          $text: { $search: search },
        }
      : {};

    const skip = (page - 1) * limit;

    const [data, dataCount] = await Promise.all([
      ProductModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category subcategory"),
      ProductModel.countDocuments(query),
    ]);

    return res.json({
      message: "Product data",
      success: true,
      error: false,
      data: data || [],
      totalCount: dataCount,
      totalPage: Math.ceil(dataCount / limit),
      page,
      limit,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server error",
      success: false,
      error: true,
    });
  }
};

  