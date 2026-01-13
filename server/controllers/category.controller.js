
import CategoryModel from "../models/category.model.js";
import SubCategoryModel from "../models/subcategory.model.js";
import ProductModel from "../models/product.model.js";

 export const  AddCategoryController=async (req,res)=>{
    try {
        const{name,image}=req.body
        if(!name|| !image){
            return res.status(400).json({
                message:" Enter required fields",
                error:true,
                success:false
            })
           
        }

        const addCategory= new CategoryModel({
            name,
            image
        })
        const saveCategory=await addCategory.save()
        if(!saveCategory){
            return res.status(500).json({
                message:" Not save category in database",
                error:true,
                success:false
            })

            
        }
          return res.json({
            message:"Add Category",
            data:saveCategory,
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

export const getCategoryConroller=async (req,res)=>{
    try {

        const data=await  CategoryModel.find().sort({createdAt:-1})
        return res.json({
            data:data,
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

export const updateCategoryController= async (req,res)=>{
    try {
        const {_id,name,image}=req.body

        const update= await CategoryModel.updateOne({
            _id:_id
        },{
            name,
            image
        })

        return res.json({
            message:" Updated Category",
            success:true,
            error:false,
            data:update
        })
        
    } catch (error) {
        return res.status(500).json({
           message: error.message|| error,
           error:true,
           success:false  
        })
    }
}

export const deleteCategoryController= async(req,res)=>{
    try {
     const {_id}=req.body

     const checkSubcategory=await SubCategoryModel.find({
        category :{
            "$in":[_id]
        }
        
     }).countDocuments()
    
    const checkProduct= await ProductModel.find({
        category :{
            "$in":[_id]
        }
    }).countDocuments()
   
    if(checkSubcategory> 0 || checkProduct > 0){
       return res.status(400).json({
        message:" Category is already use can't delete",
        error:true,
        success:false
       })
    }

    const deleteCategory=await CategoryModel.deleteOne({_id:_id})
     return res.json({
        message:" Delete Successfully",
        error:false,
        success:true,
        data:deleteCategory
     })
        
    } catch (error) {
        return res.status(500).json({
            message:error.message || error,
            error:true,
            success:false
        })
    }
}