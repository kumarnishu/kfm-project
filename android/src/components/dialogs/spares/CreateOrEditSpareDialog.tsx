import React from 'react'
import CreateOrEditSparePartForm from '../../forms/spares/CreateOrEditSparePartForm';
import { GetSparePartDto } from '../../../dtos/SparePartDto';
import Dialog from '../../common/Dialog';

type Props = {
    dialog: string | undefined,
    setDialog: React.Dispatch<React.SetStateAction<string | undefined>>
    part?: GetSparePartDto,
}

function CreateOrEditSpareDialog({ part, dialog,setDialog }: Props) {
    
    return (
       <Dialog fullScreen={false} visible={dialog === 'CreateOrEditSpareDialog'} handleClose={() => setDialog(undefined)}
        >
            <CreateOrEditSparePartForm part={part}  setDialog={setDialog} />
        </Dialog>
    )
}

export default CreateOrEditSpareDialog

