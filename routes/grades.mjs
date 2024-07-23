import express from "express";
import Grade from "../models/grades.mjs";
import mongoose from 'mongoose';
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// Create a single grade entry
router.post("/", async (req, res) => {
  try{
    let newDocument = req.body;
    if (newDocument.student_id) {
      newDocument.learner_id = newDocument.student_id;
      delete newDocument.student_id;
    }
    const grade = new Grade(newDocument);
    let result = await grade.save();
    res.status(204).send(result);
  }catch (error){
    res.status(500).send(error.message);
  }
  
});

// Get a single grade entry
router.get("/:id", async (req, res) => {
  try{
    const result = await Grade.findById(req.params.id);
    if (!result) res.send("Not found").status(404);
    res.status(200).send(result);
  }catch(error){
    res.status(500).send(error.message);
  }
});

// Add a score to a grade entry
router.patch("/:id/add", async (req, res) => {
  try{
    let query = { _id: ObjectId(req.params.id) };

    let result = await Grade.updateOne(query, {
      $push: { scores: req.body }
    });

    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
  } catch (error){
    res.status(500).send(error.message);
  }
});

// Remove a score from a grade entry
router.patch("/:id/remove", async (req, res) => {
  try{
    let query = { _id: ObjectId(req.params.id) };

    let result = await Grade.updateOne(query, {
      $pull: { scores: req.body }
    });

    if (!result) res.send("Not found").status(404);
    res.send(result).status(200);
  } catch(error) {
    res.status(500).send(error.message);
  }

});

// Delete a single grade entry
router.delete("/:id", async (req, res) => {
  try{
    let query = { _id: ObjectId(req.params.id) };
    let result = await Grade.deleteOne(query);

    if (!result) res.send("Not found").status(404);
    res.send(result).status(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get route for backwards compatibility
router.get("/student/:id", async (req, res) => {
  res.redirect(`learner/${req.params.id}`);
});

// Get a learner's grade data
router.get("/learner/:id", async (req, res) => {
  try{
    let query = { learner_id: Number(req.params.id) };
  
    // Check for class_id parameter
    if (req.query.class) query.class_id = Number(req.query.class);

    let result = await Grade.find(query);

    if (!result) res.send("Not found").status(404);
    res.send(result).status(200);
  } catch (error){
    res.status(500).send(error.message);
  }

});

// Delete a learner's grade data
router.delete("/learner/:id", async (req, res) => {
  try{

    let query = { learner_id: Number(req.params.id) };

    let result = await Grade.deleteMany(query);

    if (!result) res.send("Not found").status(404);
    res.send(result).status(200);
  }catch (error){
    res.status(500).send(error.message);
  }

});

// Get a class's grade data
router.get("/class/:id", async (req, res) => {
  try{
    let query = { class_id: Number(req.params.id) };

    // Check for learner_id parameter
    if (req.query.learner) query.learner_id = Number(req.query.learner);

    let result = await Grade.find(query);

    if (!result) res.send("Not found").status(404);
    res.send(result).status(200);
  } catch (error){
    res.status(500).send(error.message);
  }

});

// Update a class id
router.patch("/class/:id", async (req, res) => {
  try{
    let query = { class_id: Number(req.params.id) };

    let result = await Grade.updateMany(query, {
      $set: { class_id: req.body.class_id }
    });

    if (!result) res.send("Not found").status(404);
    res.send(result).status(200);
  } catch (error){
    res.status(500).send(error.message);

  }
});

// Delete a class
router.delete("/class/:id", async (req, res) => {
  try{
    let query = { class_id: Number(req.params.id) };

    let result = await Grade.deleteMany(query);

    if (!result) res.send("Not found").status(404);
    res.send(result).status(200);
  }catch (error){
    res.status(500).send(error.message);
  }

});

export default router;
