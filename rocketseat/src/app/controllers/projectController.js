const express = require('express');
const authMiddleware = require('../middlewares/auth');

const Project = require('../models/project');
const Task = require('../models/task');

const router = express.Router();

router.use(authMiddleware);

//list
router.get('/', async (req, res) => {
    try{
        const projects = await Project.find().populate(['user', 'task']);
        const total = projects.length;

        return res.send({projects, total: total});
    }catch(err){
        return res.status(400).send({error: "Don't possible get projects"});
    }
});

//view
router.get('/:projectId', async (req, res) => {
    try{
        const project = await Project.findById(req.params.projectId).populate(['task', 'user']);

        return res.send({project});
    }catch(err){
        return res.status(400).send({error: "Don't possible get project"});
    }
});

//create
router.post('/', async (req, res) => {
    try{
        const {title, description, tasks} = req.body;
        const project = await Project.create({title, description, user: req.userId});

        await Promisse.all(tasks.map(
            async task => {
                const projectTask = new Task({...task, project: project._id});

                await projectTask.save();
                project.tasks.push(projectTask);
            }
        ));

        await project.save();

        return res.send({project});
    }catch(err){
        return res.status(400).send({error: "Don't possible get projects"});
    }
});

//update
router.put('/:projectId', async (req, res) => {
    try{
        const {title, description, tasks} = req.body;
        const project = await Project
        .findByIdAndUpdate(req.params.projectId, {title, description}, {new: true});

        project.tasks = [];
        await Task.remove({project: project._id});

        await Promisse.all(tasks.map(
            async task => {
                const projectTask = new Task({...task, project: project._id});

                await projectTask.save();
                project.tasks.push(projectTask);
            }
        ));

        await project.save();

        return res.send({project});
    }catch(err){
        return res.status(400).send({error: "Don't possible get projects"});
    }
});

//delete
router.delete('/:projectId', async (req, res) => {
    try{
        await Project.findByIdAndRemove(req.params.projectId);

        return res.send();
    }catch(err){
        return res.status(400).send({error: "Don't possible delete projects"});
    }
});

modulo.exports = (app) => app.use('/projects', router);