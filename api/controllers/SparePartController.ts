import { NextFunction, Request, Response } from "express"
import moment from "moment"
import { uploadFileToCloud } from "../utils/uploadFile.util"
import { destroyFile } from "../utils/destroyFile.util"
import { DropDownDto } from "../dtos/DropDownDto"
import { GetSparePartDto, EditSparePartMachinesDto, CreateOrEditSparePartDto } from "../dtos/SparePartDto"
import { ISparePart } from "../interfaces/SparePartInterface"
import { SparePart } from "../models/SparePartModel"
import { Asset } from "../interfaces/UserInterface"


export class SparePartController {

    public async CreateSparePart(req: Request, res: Response, next: NextFunction) {
        let body = JSON.parse(req.body.body)
        const {
            name,
            partno,
            price
        } = body as CreateOrEditSparePartDto
        if (!name || !partno) {
            return res.status(400).json({ message: "please fill all required fields" })
        }

        if (await SparePart.findOne({ name: name.toLowerCase() }))
            return res.status(400).json({ message: "already exists this part" })
        if (await SparePart.findOne({ partno: partno.trim().toLowerCase() })) {
            return res.status(400).json({ message: "part with this partno already exists" })
        }
        let document: Asset = undefined
        if (req.file) {
            const allowedFiles = ["image/png", "image/jpeg", "image/gif"];
            const storageLocation = `parts/media`;
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
        await new SparePart({
            name, partno, price, photo: document,
            created_at: new Date(),
            updated_at: new Date(),
            created_by: req.user,
            updated_by: req.user
        }).save()
        return res.status(201).json({ message: "success" })

    }
    public async UpdateSparePart(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id
        let partTmp = await SparePart.findById(id)
        if (!partTmp)
            return res.status(404).json({ message: "part not found" })
        let body = JSON.parse(req.body.body)
        const {
            name,
            partno, price } = body as CreateOrEditSparePartDto
        if (!name || !partno) {
            return res.status(400).json({ message: "please fill all required fields" })
        }
        if (partTmp.name !== name.toLowerCase())
            if (await SparePart.findOne({ name: name.toLowerCase() }))
                return res.status(400).json({ message: "already exists this part" })
        if (partTmp.partno !== partno.toLowerCase())
            if (await SparePart.findOne({ partno: partno.trim().toLowerCase() })) {
                return res.status(400).json({ message: "part with this partno already exists" })
            }
        if (req.file) {
            const allowedFiles = ["image/png", "image/jpeg", "image/gif"];
            const storageLocation = `parts/media`;
            if (!allowedFiles.includes(req.file.mimetype))
                return res.status(400).json({ message: `${req.file.originalname} is not valid, only ${allowedFiles} types are allowed to upload` })
            if (req.file.size > 20 * 1024 * 1024)
                return res.status(400).json({ message: `${req.file.originalname} is too large limit is :10mb` })
            const doc = await uploadFileToCloud(req.file.buffer, storageLocation, req.file.originalname)
            if (doc) {
                if (partTmp.photo) {
                    await destroyFile(partTmp.photo._id)
                }
                partTmp.photo = doc
                await partTmp.save()
            }
            else {
                return res.status(500).json({ message: "file uploading error" })
            }


        }
        partTmp.name = name;
        partTmp.price = price;
        partTmp.updated_at = new Date();
        partTmp.partno = partno;
        if (req.user)
            partTmp.updated_by = req.user
        await partTmp.save()
        return res.status(200).json({ message: "updated" })

    }

    public async GetAllSpareParts(req: Request, res: Response, next: NextFunction) {
        let search = req.query.search
        let parts: ISparePart[] = []
        let result: GetSparePartDto[] = []
        if (search)
            parts = await SparePart.find({
                $or: [
                    { partno: { $regex: search, $options: 'i' } },
                    { name: { $regex: search, $options: 'i' } },
                ]
            }).populate('compatible_machines').populate('created_by').populate('updated_by').sort('-created_at').limit(10)
        else
            parts = await SparePart.find().populate('compatible_machines').populate('created_by').populate('updated_by').sort('-created_at').limit(10)

        for (let i = 0; i < parts.length; i++) {
            let part = parts[i]
            result.push({
                _id: part._id,
                name: part.name,
                price: part.price,
                partno: part.partno,
                photo: part.photo?.public_url || "",
                compatible_machines: part.compatible_machines && part.compatible_machines.map((m) => { return { id: m._id, label: m.name } }),
            })
        }
        return res.status(200).json(result)
    }

    public async GetSparePartsForDropdown(req: Request, res: Response, next: NextFunction) {
        let parts: ISparePart[] = []
        let result: DropDownDto[] = []
        parts = await SparePart.find().populate('created_by').populate('updated_by').sort('-created_at')
        result = parts.map((c) => { return { id: c._id, label: c.name } })
        return res.status(200).json(result)
    }

    public async AssignMachinesToSpareParts(req: Request, res: Response, next: NextFunction) {
        const { machine_ids, part_id } = req.body as EditSparePartMachinesDto

        if (machine_ids && machine_ids.length === 0)
            return res.status(400).json({ message: "please select one machine " })
        await SparePart.findByIdAndUpdate(part_id, { compatible_machines: machine_ids })
        return res.status(200).json({ message: "successfull" })
    }

}