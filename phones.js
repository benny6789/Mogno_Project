const express = require("express");
const { auth } = require("../middlewares/auth");

const { PhoneModel, validatePhone } = require("../models/phoneModel");
const { CompanyModel, validateCompany } = require("../models/phoneModel");

const router = express.Router();

// הגדרת ראוטר של הרואט שנגדיר באפ
router.get("/",async(req,res) => {
    try{
        let data = await PhoneModel.find({}).limit(20);
        res.json(data);
      }
      catch(err){
        console.log(err);
        res.status(502).json({err})
      } })


router.get("/q1",async(req,res) => {
    try{
      const data = await PhoneModel
      .find({})
      .limit(10)
      .sort({_id:-1})
      res.json(data)
    }
    catch (err) {
      console.log(err);
      res.status(502).json({ err });
    }
  })

  router.get("/q2",async(req,res) => {
    try{
      const data = await PhoneModel
      .find({})
      .limit(5)
      .sort({price:-1})
      res.json(data)
    }
    catch (err) {
      console.log(err);
      res.status(502).json({ err });
    }
  })

  router.get("/q3",async(req,res) => {
    try{
      const data =await PhoneModel
      .find({})
      .limit(3)
      .sort({total_score:-1})
      .skip(2)
      res.json(data)
    }
    catch (err) {
      console.log(err);
      res.status(502).json({ err });
    }
  })

  router.get("/q4",async(req,res)=>{
    try{
        const data = await PhoneModel.find({name:/Mi 10/i})
        res.json(data);

    }
    catch(err){
        console.log(err);
        res.status(502).json({err})
    }
})

router.get("/q5",async(req,res)=>{
    try{
        const s = req.query.s;

        const searchExp = new RegExp(s)
        const data = await PhoneModel.find({gpu:searchExp})
    res.json(data);
}
catch(err){
  console.log(err);
  res.status(502).json({err})
}
 });


 router.post("/q6",auth,async(req,res)=>{
    const validBody = validateCompany(req.body);
    if(validBody.error){
      return res.status(400).json(validBody.error.details)
    }
    try{
      const company = new CompanyModel(req.body);
      toy.user_id = req.tokenData._id;
      await company.save();
      res.status(201).json(toy);
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
 });
 router.put("/q7",auth,async(req,res) => {
    const validBody = validateCompany(req.body);
    if(validBody.error){
      return res.status(400).json(validBody.error.details)
    }
    try{
      const id = req.params.id;
      //user_id makes sure only the user identified could update their record
      const data = await CompanyModel.updateOne({_id:id,user_id:req.tokenData._id},req.body);
      res.json(data);
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  })

  router.delete("/q8",auth,async(req,res) => {
    try{
      const id = req.params.id;
      let data;
      //If the user is admin he can delete other records and their own.
      if(req.tokenData.role == "admin" || req.tokenData.role == "superadmin"){
        data = await CompanyModel.deleteOne({_id:id});
      }//Checks if the user is an admin wether it is the owner of the record
      else{
        data = await CompanyModel.deleteOne({_id:id,user_id:req.tokenData._id});
      }
      res.json(data);
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  })

  //return the amount of records in the collection
  router.get("/q9",async(req,res) => {
    try{
      const limit = req.query.limit || 5;
      const count = await PhoneModel.countDocuments({});
      res.json({count,pages:Math.ceil(count/limit)});
    }
    catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  })


  router.get("/q10", async (req, res) => {
    try {
      let count = await PhoneModel.countDocuments({ cpu: /Qualcomm/i });
      res.json({ count });
    } catch(err){
        console.log(err);
        res.status(502).json({err})
      }
  });
  
  router.get("/q11", async (req, res) => {
    try {
      let data = await PhoneModel.find({ price: { $gte: 1300, $lte: 2000 } })
                                 .sort({ price: 1 })
                                 .limit(4);
      res.json(data);
    } catch(err){
        console.log(err);
        res.status(502).json({err})
      }
  });

  router.get("/q12", async (req, res) => {
    try {
      let data = await PhoneModel.find( {total_score: { $in: [86, 90, 79] } });
      res.json(data);
    } catch(err){
        console.log(err);
        res.status(502).json({err})
      }
    
  });


  router.get("/q13", async (req, res) => {
    try {
      const data = await PhoneModel.find({},{name:1,total_score:1} )
                                 .sort({ company_id: 1 })
                                 .limit(10);
      res.json(data);
    } catch(err){
      console.log(err);
      res.status(502).json({err})
    }
  });
  
  router.get("/q14", async (req, res) => {
    try {
      let data = await PhoneModel.find( {$or:[{battery_score:76},{company_id:2}]});
      res.json(data);
    } catch(err){
        console.log(err);
        res.status(502).json({err})
      }
    
  }); 

  router.get("/q15", async (req, res) => {
    try {
      let data = await PhoneModel.find( {$and:[{battery_score:76},{company_id:4}]});
      res.json(data);
    } catch(err){
        console.log(err);
        res.status(502).json({err})
      }
    
  });
  router.get("/q16", async (req, res) => {
    try {
      const data = await PhoneModel.aggregate([
        {$group:{
          _id:"$company_id",
          countItems:{$count:{}}

        }
        
        },
        {
          $sort: { _id: 1 }
        }
        
      ])
      res.json(data);
      
    } catch(err){
        console.log(err);
        res.status(502).json({err})
      }
    
  }); 

  router.get("/q17", async (req, res) => {
    try {
      const data = await PhoneModel.aggregate([
        {$group:{
          _id:"$company_id",
          avgQty:{$avg:"$price"}

        }
        
        },
        {
          $sort: { _id: 1 }
        }
        
      ])
      res.json(data);
      
    } catch(err){
        console.log(err);
        res.status(502).json({err})
      }
    
  }); 

  router.get("/q18", async (req, res) => {
    try {
      const data = await PhoneModel.aggregate([
        {$group:{
          _id:"$company_id",
          minCmp:{$min:"$price"}

        }
        
        },
        {
          $sort: { _id: 1 }
        }
        
      ])
      res.json(data);
      
    } catch(err){
        console.log(err);
        res.status(502).json({err})
      }
    
  }); 

  router.get("/q19", async (req, res) => {
    try {
      const data = await PhoneModel
      .find()
      .populate({path:"company_id",select:"company_id",foreignField:"id"})
      
      res.json(data);
      
    } catch(err){
        console.log(err);
        res.status(502).json({err})
      }
    
  }); 


  router.get("/q20", async (req, res) => {
    try {
      const data = await PhoneModel
      .find()
      .sort({price: -1})
      .limit(5)
      .populate({path:"company_id",select:"company_id",foreignField:"id"})
      .select('country');
      
      res.json(data);
      
    } catch(err){
        console.log(err);
        res.status(502).json({err})
      }
    
  }); 







// export default
module.exports = router;