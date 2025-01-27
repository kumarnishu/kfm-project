import { NextFunction, Request, Response } from "express"
import moment from "moment"
import { uploadFileToCloud } from "../services/uploadFIletoCloud"
import { destroyFile } from "../services/destryFile"
import { CreateOrEditMachineDto, GetMachineDto } from "../dtos/MachineDto";
import { DropDownDto } from "../dtos/DropDownDto";
import { IMachine } from "../interfaces/MachineInterface";
import { Machine } from "../models/MachineModel";
import { Asset } from "../interfaces/UserInterface";

export class MachineController {

    public async CreateMachine(req: Request, res: Response, next: NextFunction) {
        let body = JSON.parse(req.body.body)
        const {
            name,
            model
        } = body as CreateOrEditMachineDto
        if (!name || !model) {
            return res.status(400).json({ message: "please fill all required fields" })
        }

        if (await Machine.findOne({ name: name.toLowerCase() }))
            return res.status(400).json({ message: "already exists this machine" })
        let document: Asset | undefined = undefined
        if (req.file) {
            const allowedFiles = ["image/png", "image/jpeg", "image/gif"];
            const storageLocation = `machines/media`;
            if (!allowedFiles.includes(req.file.mimetype))
                return res.status(400).json({ message: `${req.file.originalname} is not valid, only ${allowedFiles} types are allowed to upload` })
            if (req.file.size > 20 * 1024 * 1024)
                return res.status(400).json({ message: `${req.file.originalname} is too large limit is :10mb` })
            const doc = await uploadFileToCloud(req.file.buffer, storageLocation, req.file.originalname)

            if (doc) {
                document = doc
            }
            else {
                return res.status(500).json({ message: "file uploading error" })
            }


        }
        await new Machine({
            name, model, photo: document,
            created_at: new Date(),
            updated_at: new Date(),
            created_by: req.user,
            updated_by: req.user
        }).save()
        return res.status(201).json({ message: "success" })

    }
    public async UpdateMachine(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id
        let machineTmp = await Machine.findById(id)
        if (!machineTmp)
            return res.status(404).json({ message: "machine not found" })
        let body = JSON.parse(req.body.body)
        const {
            name,
            model } = body as CreateOrEditMachineDto
        if (!name || !model) {
            return res.status(400).json({ message: "please fill all required fields" })
        }
        if (machineTmp.name !== name.toLowerCase())
            if (await Machine.findOne({ name: name.toLowerCase() }))
                return res.status(400).json({ message: "already exists this machine" })
        if (req.file) {
            const allowedFiles = ["image/png", "image/jpeg", "image/gif"];
            const storageLocation = `machines/media`;
            if (!allowedFiles.includes(req.file.mimetype))
                return res.status(400).json({ message: `${req.file.originalname} is not valid, only ${allowedFiles} types are allowed to upload` })
            if (req.file.size > 20 * 1024 * 1024)
                return res.status(400).json({ message: `${req.file.originalname} is too large limit is :10mb` })
            const doc = await uploadFileToCloud(req.file.buffer, storageLocation, req.file.originalname)

            if (doc) {
                if (machineTmp.photo) {
                    await destroyFile(machineTmp.photo._id)
                }
                machineTmp.photo = doc
                await machineTmp.save()
            }
            else {
                return res.status(500).json({ message: "file uploading error" })
            }


        }
        machineTmp.name = name;
        machineTmp.updated_at = new Date();
        machineTmp.model = model;
        if (req.user)
            machineTmp.updated_by = req.user
        await machineTmp.save()
        return res.status(200).json({ message: "updated" })

    }

    public async GetAllMachines(req: Request, res: Response, next: NextFunction) {
        let search = req.query.search
        let machines: IMachine[] = []
        let result: GetMachineDto[] = []
        if (search)
            machines = await Machine.find({
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { model: { $regex: search, $options: 'i' } },
                ]
            }).populate('created_by').populate('updated_by').sort('-created_at').limit(10)
        else
            machines = await Machine.find().populate('created_by').populate('updated_by').sort('-created_at').limit(10)
        for (let i = 0; i < machines.length; i++) {
            let machine = machines[i]
            result.push({
                _id: machine._id,
                name: machine.name,
                model: machine.model,
                photo: machine.photo?.public_url || ""
            })
        }
        return res.status(200).json(result)
    }

    public async GetMachinesForDropdown(req: Request, res: Response, next: NextFunction) {
        let machines: IMachine[] = []
        let result: DropDownDto[] = []
        machines = await Machine.find().populate('created_by').populate('updated_by').sort('-created_at')
        result = machines.map((c) => { return { id: c._id, label: c.name, value: c.name } })

        return res.status(200).json(result)
    }
}