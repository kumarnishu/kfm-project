import React from 'react'
import CreateOrEditMachineForm from '../../forms/machines/CreateOrEditMachineForm';
import {GetMachineDto} from "../../../dtos/MachineDto"
import Dialog from '../../common/Dialog';
type Props = {
    dialog: string | undefined,
    setDialog: React.Dispatch<React.SetStateAction<string | undefined>>
    machine?: GetMachineDto,
}

function CreateOrEditMachineDialog({ machine, dialog, setDialog }: Props) {
    return (
       <Dialog fullScreen={true} visible={dialog === 'CreateOrEditMachineDialog'} handleClose={() => setDialog(undefined)}
        >
            <CreateOrEditMachineForm machine={machine}  setDialog={setDialog} />
        </Dialog>
    )
}

export default CreateOrEditMachineDialog

